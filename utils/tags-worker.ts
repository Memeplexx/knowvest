import { NoteDTO, NoteId, SynonymId, TagId } from "@/actions/types";
import { DeepReadonlyArray } from "olik";

class TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEndOfTag: boolean = false;
  id: TagId | null = null;
  synonymId: SynonymId | null = null;
}

class Trie {
  root: TrieNode = new TrieNode();
  insert(word: string, tagId: TagId, synonymId: SynonymId): void {
    let node: TrieNode = this.root;
    for (const char of word) {
      if (!node.children[char])
        node.children[char] = new TrieNode();
      node = node.children[char]!;
    }
    node.isEndOfTag = true;
    node.id = tagId;
    node.synonymId = synonymId;
  }

  search(text: string) {
    const detectedTags = new Array<TagResult>();
    for (let i = 0; i < text.length; i++) {
      let node: TrieNode = this.root;
      for (let j = i; j < text.length; j++) {
        const char: string = text[j]!;
        if (!node.children[char]) {
          break;
        }
        node = node.children[char]!;
        if (node.isEndOfTag) {
          detectedTags.push({
            text: text.slice(i, j + 1),
            id: node.id!,
            synonymId: node.synonymId,
            from: i,
            to: j + 1,
          });
        }
      }
    }
    return detectedTags.sort((a, b) => a.id - b.id);
  }

  remove(word: string) {
    this.removeHelper(this.root, word, 0);
  }

  removeHelper(node: TrieNode, word: string, depth: number) {
    if (!node)
      return false;
    if (depth === word.length) {
      if (node.isEndOfTag) {
        node.isEndOfTag = false;
        node.id = null;
      }
      return Object.keys(node.children).length === 0;
    }
    const char = word[depth]!;
    const shouldDeleteCurrentNode = this.removeHelper(node.children[char]!, word, depth + 1);
    if (shouldDeleteCurrentNode) {
      delete node.children[char];
      return Object.keys(node.children).length === 0 && !node.isEndOfTag;
    }
    return false;
  }
}

export type TagSummary = {
  id: TagId,
  text: string;
  synonymId: SynonymId | null;
};

export type TagResult = {
  from: number;
  to: number;
} & TagSummary;

export type Incoming
  = {
    type: 'initialize',
    data: { tags: DeepReadonlyArray<TagSummary>, notes: DeepReadonlyArray<NoteDTO> }
  }
  | {
    type: 'addTags',
    data: TagSummary[]
  }
  | {
    type: 'addNotes',
    data: DeepReadonlyArray<NoteDTO>
  }
  | {
    type: 'removeTags',
    data: DeepReadonlyArray<TagId>
  }
  | {
    type: 'updateTags',
    data: DeepReadonlyArray<TagSummary>
  }
  | {
    type: 'updateNote',
    data: NoteDTO
  }
  | {
    type: 'removeNote',
    data: NoteId
  };

export type Outgoing = {
  noteId: NoteId,
  tags: TagResult[]
}[]

export type TagsWorker = Omit<Worker, 'postMessage' | 'onmessage'> & {
  postMessage: (message: Incoming) => void,
  onmessage: (event: MessageEvent<Outgoing>) => void
};

const trie = new Trie();
const allTags = [] as Array<TagSummary>;
const allNotes = [] as Array<NoteDTO>;
const resultsCache = new Map<NoteId, Array<TagResult>>();

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
    case 'addNotes':
      return addNotes(data);
    case 'updateNote':
      return updateNote(data);
    case 'removeNote':
      return removeNote(data);
  }
};

const sendToProvider = (data: Outgoing) => postMessage(data);

const initialize = ({ tags: incomingTags, notes: incomingNotes }: { tags: DeepReadonlyArray<TagSummary>, notes: DeepReadonlyArray<NoteDTO> }) => {
  allTags.push(...incomingTags);
  incomingTags.forEach(incomingTag => {
    trie.insert(incomingTag.text, incomingTag.id, incomingTag.synonymId!);
  });
  allNotes.push(...incomingNotes);
  const toPost = incomingNotes.map(incomingNote => {
    const results = trie.search(incomingNote.text);
    resultsCache.set(incomingNote.id, results);
    return { noteId: incomingNote.id, tags: results };
  });
  if (toPost.length)
    sendToProvider(toPost);
}

const addTags = (incomingTags: TagSummary[]) => {
  const trieLocal = new Trie();
  incomingTags.forEach(incomingTag => {
    const found = allTags.find(t => t.id === incomingTag.id);
    if (found) throw new Error(`Tag already exists: ${JSON.stringify(found)}`);
    allTags.push(incomingTag);
    const tagText = incomingTag.text;
    trieLocal.insert(tagText, incomingTag.id, incomingTag.synonymId!);
    trie.insert(tagText, incomingTag.id, incomingTag.synonymId!);
  });
  const toPost = [] as Outgoing;
  allNotes.forEach(note => {
    const results = trieLocal.search(note.text);
    if (!results.length) return;
    const cacheItem = resultsCache.get(note.id)!;
    cacheItem.push(...results);
    toPost.push({ noteId: note.id, tags: cacheItem });
  });
  if (toPost.length)
    sendToProvider(toPost);

}

const removeTags = (incomingTagIds: DeepReadonlyArray<TagId>) => {
  incomingTagIds.forEach(incomingTagId => {
    trie.remove(allTags.find(t => t.id === incomingTagId)!.text);
    const index = allTags.findIndex(tag => tag.id === incomingTagId);
    if (index !== -1)
      allTags.splice(index, 1);
  });
  const toPost = [] as Outgoing;
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const filtered = tagSummaries.filter(tagSummary => !incomingTagIds.includes(tagSummary.id));
    if (filtered.length === tagSummaries.length) return; // if note does not contain any of the removed tags, do not update resultsCache
    resultsCache.set(noteId, filtered);
    toPost.push({ noteId, tags: filtered });
  });
  if (toPost.length)
    sendToProvider(toPost);
};

const updateTags = (incomingTags: DeepReadonlyArray<TagSummary>) => {

  // Create some local variables for later
  const trieLocal = new Trie();
  const incomingTagIds = incomingTags.map(t => t.id);
  const toPost = [] as Outgoing;

  // Start by removing old tags from the trie, re-inserting them into the trie, and updating the tag text in the allTags array
  incomingTags.forEach(incomingTag => {
    const tag = allTags.find(t => t.id === incomingTag.id);
    if (!tag) throw new Error(`Tag to update not found: ${JSON.stringify(incomingTag)}`);
    trie.remove(tag.text);
    trie.insert(incomingTag.text, tag.id, tag.synonymId!);
    trieLocal.insert(incomingTag.text, tag.id, tag.synonymId!);
    tag.text = incomingTag.text;
  });

  // Remove old from resultsCache
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const tagSummariesWithIncomingTagsRemoved = tagSummaries.filter(tagSummary => !incomingTagIds.includes(tagSummary.id)).sort((a, b) => a.id - b.id);
    if (tagSummariesWithIncomingTagsRemoved.length === tagSummaries.length) return; // if note does not contain any of the updated tags, do not update resultsCache
    resultsCache.set(noteId, tagSummariesWithIncomingTagsRemoved);
    toPost.push({ noteId, tags: tagSummariesWithIncomingTagsRemoved });
  });

  // Add new ro resultsCache
  allNotes.forEach(note => {
    const results = trieLocal.search(note.text);
    if (!results.length) return; // if note does not contain any of the updated tags, do not update resultsCache or toPost array
    const cacheItem = resultsCache.get(note.id)!;
    cacheItem.push(...results);
    const toPostItem = toPost.find(p => p.noteId === note.id);
    if (toPostItem)
      toPostItem.tags.push(...results);
    else
      toPost.push({ noteId: note.id, tags: cacheItem });
  });

  if (toPost.length)
    sendToProvider(toPost);
}

const addNotes = (incomingNotes: DeepReadonlyArray<NoteDTO>) => {
  const toPost = [] as Outgoing;
  incomingNotes.forEach(incomingNote => {
    const found = allNotes.find(n => n.id === incomingNote.id);
    if (found) throw new Error(`Note already exists: ${JSON.stringify(found)}`);
    const results = trie.search(incomingNote.text);
    resultsCache.set(incomingNote.id, results);
    allNotes.push(incomingNote);
    toPost.push({ noteId: incomingNote.id, tags: results });
  })
  if (toPost.length)
    sendToProvider(toPost);
}

const updateNote = (incomingNote: NoteDTO) => {
  const found = allNotes.find(n => n.id === incomingNote.id);
  if (!found) throw new Error(`Note not found: ${JSON.stringify(incomingNote)}`);
  found.text = incomingNote.text;
  const results = trie.search(found.text);
  if (JSON.stringify(results) === JSON.stringify(resultsCache.get(incomingNote.id)!))
    return;
  resultsCache.set(incomingNote.id, results);
  sendToProvider([{ noteId: incomingNote.id, tags: results }]);
}

const removeNote = (incomingNoteId: NoteId) => {
  const index = allNotes.findIndex(n => n.id === incomingNoteId);
  if (index === -1) throw new Error(`Note not found: ${incomingNoteId}`);
  allNotes.splice(index, 1);
  resultsCache.delete(incomingNoteId);
}
