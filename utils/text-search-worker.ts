import { NoteDTO, NoteId, SynonymId, TagId } from "@/actions/types";
import { DeepReadonlyArray } from "olik";
import { Incoming, NoteSearchResults, SearchArg, SearchResult, Trie } from "./text-search-utils";


const trie = new Trie();
const allTags = [] as Array<SearchArg>;
const allNotes = [] as Array<NoteDTO>;
const resultsCache = new Map<NoteId, Array<SearchResult>>();

onmessage = (event: MessageEvent<Incoming>) => {
  const { type, data } = event.data;
  switch (type) {
    case 'initialize':
      return initialize(data);
    case 'addTags':
      return addTags(data);
    case 'removeTags':
      return removeTags(data);
    case 'updateTags':
      return updateTags(data);
    case 'setSearchTerms':
      return setSearchTerms(data);
    case 'addNotes':
      return addNotes(data);
    case 'updateNote':
      return updateNote(data);
    case 'removeNote':
      return removeNote(data);
  }
};

const noteTagsUpdated = (value: DeepReadonlyArray<NoteSearchResults>) => postMessage({ type: 'noteTagsUpdated', value });

const initialize = ({ tags: incomingTags, notes: incomingNotes }: { tags: DeepReadonlyArray<SearchArg>, notes: DeepReadonlyArray<NoteDTO> }) => {
  allTags.push(...incomingTags);
  incomingTags.forEach(incomingTag => {
    trie.insert(incomingTag.text, incomingTag.tagId, incomingTag.synonymId!);
  });
  allNotes.push(...incomingNotes);
  const toPost = incomingNotes.map(incomingNote => {
    const results = trie.search(incomingNote.text);
    resultsCache.set(incomingNote.id, results);
    return { noteId: incomingNote.id, matches: results };
  });
  if (toPost.length)
    noteTagsUpdated(toPost);
}

const addTags = (incomingTags: DeepReadonlyArray<SearchArg>) => {
  if (!incomingTags.length) return;
  const trieLocal = new Trie();
  incomingTags.forEach(incomingTag => {
    const found = allTags.find(t => t.tagId === incomingTag.tagId);
    if (found) throw new Error(`Tag already exists: ${JSON.stringify(found)}`);
    allTags.push(incomingTag);
    const tagText = incomingTag.text;
    trieLocal.insert(tagText, incomingTag.tagId, incomingTag.synonymId!);
    trie.insert(tagText, incomingTag.tagId, incomingTag.synonymId!);
  });
  const toPost = [] as NoteSearchResults[];
  allNotes.forEach(note => {
    const results = trieLocal.search(note.text);
    if (!results.length) return;
    const cacheItem = resultsCache.get(note.id)!;
    cacheItem.push(...results);
    toPost.push({ noteId: note.id, matches: cacheItem });
  });
  if (toPost.length)
    noteTagsUpdated(toPost);
}

const removeTags = (incomingTagIds: DeepReadonlyArray<TagId>) => {
  if (!incomingTagIds.length) return;
  incomingTagIds.forEach(incomingTagId => {
    trie.remove(allTags.find(t => t.tagId === incomingTagId)!.text);
    const index = allTags.findIndex(tag => tag.tagId === incomingTagId);
    if (index !== -1)
      allTags.splice(index, 1);
  });
  const toPost = [] as NoteSearchResults[];
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const filtered = tagSummaries.filter(tagSummary => !incomingTagIds.includes(tagSummary.tagId));
    if (filtered.length === tagSummaries.length) return; // if note does not contain any of the removed tags, do not update resultsCache
    resultsCache.set(noteId, filtered);
    toPost.push({ noteId, matches: filtered });
  });
  if (toPost.length)
    noteTagsUpdated(toPost);
};

const updateTags = (incomingTags: DeepReadonlyArray<SearchArg>) => {
  if (!incomingTags.length) return;

  // Create some local variables for later
  const trieLocal = new Trie();
  const incomingTagIds = incomingTags.map(t => t.tagId);
  const toPost = [] as NoteSearchResults[];

  // Start by removing old tags from the trie, re-inserting them into the trie, and updating the tag text in the allTags array
  incomingTags.forEach(incomingTag => {
    const tag = allTags.find(t => t.tagId === incomingTag.tagId);
    if (!tag) throw new Error(`Tag to update not found: ${JSON.stringify(incomingTag)}`);
    trie.remove(tag.text);
    trie.insert(incomingTag.text, tag.tagId, tag.synonymId!);
    trieLocal.insert(incomingTag.text, tag.tagId, tag.synonymId!);
    tag.text = incomingTag.text;
  });

  // Remove old from resultsCache
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const tagSummariesWithIncomingTagsRemoved = tagSummaries.filter(tagSummary => !incomingTagIds.includes(tagSummary.tagId)).sort((a, b) => a.tagId - b.tagId);
    if (tagSummariesWithIncomingTagsRemoved.length === tagSummaries.length) return; // if note does not contain any of the updated tags, do not update resultsCache
    resultsCache.set(noteId, tagSummariesWithIncomingTagsRemoved);
    toPost.push({ noteId, matches: tagSummariesWithIncomingTagsRemoved });
  });

  // Add new ro resultsCache
  allNotes.forEach(note => {
    const results = trieLocal.search(note.text);
    if (!results.length) return; // if note does not contain any of the updated tags, do not update resultsCache or toPost array
    const cacheItem = resultsCache.get(note.id)!;
    cacheItem.push(...results);
    const toPostItem = toPost.find(p => p.noteId === note.id);
    if (toPostItem)
      toPostItem.matches.push(...results);
    else
      toPost.push({ noteId: note.id, matches: cacheItem });
  });

  if (toPost.length)
    noteTagsUpdated(toPost);
}

const addNotes = (incomingNotes: DeepReadonlyArray<NoteDTO>) => {
  const toPost = [] as NoteSearchResults[];
  incomingNotes.forEach(incomingNote => {
    const found = allNotes.find(n => n.id === incomingNote.id);
    if (found) throw new Error(`Note already exists: ${JSON.stringify(found)}`);
    const results = trie.search(incomingNote.text);
    resultsCache.set(incomingNote.id, results);
    allNotes.push(incomingNote);
    toPost.push({ noteId: incomingNote.id, matches: results });
  })
  if (toPost.length)
    noteTagsUpdated(toPost);
}

const updateNote = (incomingNote: NoteDTO) => {
  const found = allNotes.find(n => n.id === incomingNote.id);
  if (!found) throw new Error(`Note not found: ${JSON.stringify(incomingNote)}`);
  found.text = incomingNote.text;
  const results = trie.search(found.text);
  if (JSON.stringify(results) === JSON.stringify(resultsCache.get(incomingNote.id)!))
    return;
  resultsCache.set(incomingNote.id, results);
  noteTagsUpdated([{ noteId: incomingNote.id, matches: results }]);
}

const removeNote = (incomingNoteId: NoteId) => {
  const index = allNotes.findIndex(n => n.id === incomingNoteId);
  if (index === -1) throw new Error(`Note not found: ${incomingNoteId}`);
  allNotes.splice(index, 1);
  resultsCache.delete(incomingNoteId);
}

const setSearchTerms = (incomingSearchTerms: DeepReadonlyArray<string>) => {
  const trieLocal = new Trie();
  incomingSearchTerms.forEach(incomingSearchTerm => {
    trieLocal.insert(incomingSearchTerm, 0 as TagId, 0 as SynonymId);
  });
  const toPost = allNotes
    .map(note => ({ noteId: note.id, matches: trieLocal.search(note.text) }))
    .filter(searchResults => searchResults.matches.length);
  postMessage({ type: 'notesSearched', value: toPost });
}
