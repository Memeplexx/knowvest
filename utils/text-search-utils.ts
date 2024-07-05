import { NoteDTO, NoteId, SynonymId, TagId } from "@/actions/types";
import { DeepReadonlyArray } from "olik";

export class TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEndOfTag: boolean = false;
  id: TagId | null = null;
  synonymId: SynonymId | null = null;
}

export type SearchArg = {
  id: TagId,
  text: string;
  synonymId: SynonymId | null;
};

export type SearchResult = {
  from: number;
  to: number;
  id: TagId,
  text: string;
  synonymId: SynonymId | null;
};

export type TextSearchContextActions = {
  initialize: (payload: { tags: DeepReadonlyArray<SearchArg>, notes: DeepReadonlyArray<NoteDTO> }) => void;
  addTags: (tags: SearchArg[]) => void;
  addNotes: (notes: DeepReadonlyArray<NoteDTO>) => void;
  removeTags: (tags: DeepReadonlyArray<TagId>) => void;
  updateTags: (tags: DeepReadonlyArray<SearchArg>) => void;
  updateNote: (note: NoteDTO) => void;
  removeNote: (noteId: NoteId) => void;
  onNoteTagsUpdated: (listener: (arg: DeepReadonlyArray<NoteSearchResults>) => void) => () => void;
  setSearchTerms: (terms: DeepReadonlyArray<string>) => void;
  onNotesSearched: (listener: (arg: DeepReadonlyArray<NoteSearchResults>) => void) => () => void;
};

export type Incoming = { [key in keyof TextSearchContextActions]: { type: key, data: Parameters<TextSearchContextActions[key]>[0] } }[keyof TextSearchContextActions];


export type NoteSearchResults = {
  noteId: NoteId,
  matches: SearchResult[]
};

export type Outgoing = {
  type: 'noteTagsUpdated' | 'notesSearched',
  value: NoteSearchResults[]
}

export type TagsWorker = Omit<Worker, 'postMessage' | 'onmessage'> & {
  postMessage: (message: Incoming) => void,
  onmessage: (event: MessageEvent<Outgoing>) => void
};

export class Trie {
  root: TrieNode = new TrieNode();
  insert(term: string, tagId: TagId, synonymId: SynonymId): void {
    let node: TrieNode = this.root;
    for (const char of term) {
      if (!node.children[char])
        node.children[char] = new TrieNode();
      node = node.children[char]!;
    }
    node.isEndOfTag = true;
    node.id = tagId;
    node.synonymId = synonymId;
  }

  search(text: string) {
    const detectedResults = new Array<SearchResult>();
    for (let i = 0; i < text.length; i++) {
      let node: TrieNode = this.root;
      for (let j = i; j < text.length; j++) {
        const char: string = text[j]!;
        if (!node.children[char]) {
          break;
        }
        node = node.children[char]!;
        if (node.isEndOfTag) {
          detectedResults.push({
            text: text.slice(i, j + 1),
            id: node.id!,
            synonymId: node.synonymId,
            from: i,
            to: j + 1,
          });
        }
      }
    }
    return detectedResults
      .map(e => ({ e, s: JSON.stringify(e) }))
      .sort((a, b) => a.s.localeCompare(b.s))
      .map(e => e.e);
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