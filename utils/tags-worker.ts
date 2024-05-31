import { NoteDTO, NoteId, SynonymId, TagId } from "@/actions/types";

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

  search(text: string): Set<TagSummary> {
    const detectedTags: Set<TagSummary> = new Set();
    for (let i = 0; i < text.length; i++) {
      let node: TrieNode = this.root;
      for (let j = i; j < text.length; j++) {
        const char: string = text[j]!;
        if (!node.children[char]) {
          break;
        }
        node = node.children[char]!;
        if (node.isEndOfTag) {
          detectedTags.add({ text: text.slice(i, j + 1), id: node.id!, synonymId: node.synonymId });
        }
      }
    }
    return detectedTags;
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

export type Incoming
  = {
    type: 'addTags',
    data: TagSummary[]
  }
  | {
    type: 'removeTags',
    data: TagId[]
  }
  | {
    type: 'updateTags',
    data: TagSummary[]
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
  tags: TagSummary[]
}

export type TagsWorker = Omit<Worker, 'postMessage' | 'onmessage'> & {
  postMessage: (message: Incoming) => void,
  onmessage: (event: MessageEvent<Outgoing>) => void
};

const trie = new Trie();
const allTags = [] as Array<TagSummary>;
const allNotes = [] as Array<NoteDTO>;
const previousResults = new Map<NoteId, Array<TagSummary>>();

const notify = () => allNotes.forEach(note => {
  const results = Array.from(trie.search(note.text.toLowerCase()));
  if (JSON.stringify(results) === JSON.stringify(previousResults.get(note.id)!))
    return;
  previousResults.set(note.id, results);
  postMessage({
    noteId: note.id,
    tags: results,
  })
});

onmessage = (event: MessageEvent<Incoming>) => {
  const { type, data } = event.data;
  switch (type) {
    case 'addTags': {
      allTags.push(...data);
      data.forEach(tag => trie.insert(tag.text.toLowerCase(), tag.id, tag.synonymId!));
      notify();
      break;
    }
    case 'removeTags': {
      const index = allTags.findIndex(tag => data.includes(tag.id));
      if (index !== -1)
        allTags.splice(index, 1);
      data.forEach(tagId => trie.remove(allTags.find(t => t.id === tagId)!.text.toLowerCase()));
      notify();
      break;
    }
    case 'updateTags': {
      data.forEach(tagSummary => {
        const tag = allTags.find(t => t.id === tagSummary.id);
        if (!tag) return;
        trie.remove(tag.text.toLowerCase());
        trie.insert(tagSummary.text.toLowerCase(), tag.id, tag.synonymId!);
      });
      notify();
      break;
    }
    case 'updateNote': {
      const note = allNotes.find(n => n.id === data.id);
      if (!note)
        allNotes.push(data);
      else
        note.text = data.text;
      notify();
      break;
    }
    case 'removeNote': {
      const index = allNotes.findIndex(n => n.id === data);
      if (index !== -1)
        allNotes.splice(index, 1);
      break;
    }
  }
};

