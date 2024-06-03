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
    return detectedTags.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
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
  console.log('..', type)
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
  console.log('_____')
  allTags.push(...incomingTags);
  incomingTags.forEach(incomingTag => {
    trie.insert(incomingTag.text.toLowerCase(), incomingTag.id, incomingTag.synonymId!);
  });
  allNotes.push(...incomingNotes);
  const toPost = incomingNotes.map(incomingNote => {
    const results = trie.search(incomingNote.text.toLowerCase());
    resultsCache.set(incomingNote.id, results);
    return { noteId: incomingNote.id, tags: results };
  });
  if (toPost.length)
    sendToProvider(toPost);
}

const addTags = (incomingTags: TagSummary[]) => {
  const trieLocal = new Trie(); // we don't want to search ALL tags in ALL notes. Let's create a Trie to only search the tags that were added
  incomingTags.forEach(incomingTag => {
    const found = allTags.find(t => t.id === incomingTag.id);
    if (found) throw new Error(`Tag already exists: ${JSON.stringify(found)}`);
    allTags.push(incomingTag);
    const tagText = incomingTag.text.toLowerCase();
    trieLocal.insert(tagText, incomingTag.id, incomingTag.synonymId!);
    trie.insert(tagText, incomingTag.id, incomingTag.synonymId!);
  });
  const toPost = [] as Outgoing;
  allNotes.forEach(note => {
    const results = trieLocal.search(note.text.toLowerCase());
    if (JSON.stringify(results) === JSON.stringify(resultsCache.get(note.id)!))
      return;
    resultsCache.set(note.id, results);
    toPost.push({ noteId: note.id, tags: results });
  });
  if (toPost.length)
    sendToProvider(toPost);
}

const removeTags = (incomingTagIds: DeepReadonlyArray<TagId>) => {
  incomingTagIds.forEach(incomingTagId => {
    const index = allTags.findIndex(tag => tag.id === incomingTagId);
    if (index !== -1)
      allTags.splice(index, 1);
    trie.remove(allTags.find(t => t.id === incomingTagId)!.text.toLowerCase());
  });
  const toPost = [] as Outgoing;
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const filtered = tagSummaries.filter(tagSummary => !incomingTagIds.includes(tagSummary.id));
    if (filtered.length < tagSummaries.length) { // where tags removed?
      resultsCache.set(noteId, filtered);
      toPost.push({ noteId, tags: filtered });
    }
  });
  if (toPost.length)
    sendToProvider(toPost);
};

const updateTags = (incomingTags: DeepReadonlyArray<TagSummary>) => {
  const tagsRemoved = new Array<TagId>();
  incomingTags.forEach(incomingTag => {
    const tag = allTags.find(t => t.id === incomingTag.id);
    if (!tag) throw new Error(`Tag to update not found: ${JSON.stringify(incomingTag)}`);
    trie.remove(tag.text.toLowerCase());
    tagsRemoved.push(tag.id);
    trie.insert(incomingTag.text.toLowerCase(), tag.id, tag.synonymId!);
    tag.text = incomingTag.text;
  });
  const toPost = [] as Outgoing;
  Array.from(resultsCache).forEach(([noteId, tagSummaries]) => {
    const filtered = tagSummaries.filter(tagSummary => !tagsRemoved.includes(tagSummary.id));
    if (filtered.length === tagSummaries.length) return; // if filtered tags are same length as original, no tags were removed
    resultsCache.set(noteId, filtered);
    toPost.push({ noteId, tags: filtered });
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
  found.text = incomingNote.text.toLowerCase();
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
