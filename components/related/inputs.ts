import { derive } from "olik";
import { Props } from "./constants";
import { store } from "@/utils/store";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CardHandle } from "../card/constants";

export const useInputs = (props: Props) => {

  const queriedNotes = derive(
    store.activeNoteId,
    store.notes,
    store.tags,
    store.noteTags,
    store.synonymIds,
  ).$with((activeNoteId, notes, tags, noteTags, synonymIds) => {
    return synonymIds
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(t => t.id)
      .distinct()
      .flatMap(tagId => noteTags.filter(nt => nt.noteId !== activeNoteId && nt.tagId === tagId))
      .groupBy(n => n.noteId)
      .map(n => ({
        note: notes.findOrThrow(nn => nn.id === n[0].noteId),
        count: n.length,
      }))
      .sort((a, b) => b.count - a.count)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  });

  const noteCountString = derive(
    queriedNotes
  ).$with((queriedNotes) => {
    return `${queriedNotes.length} result${queriedNotes.length === 1 ? '' : 's'}`;
  })

  const [loadingRelatedNotes, setLoadingRelatedNotes] = useState(true);
  const RelatedNotes = useMemo(() => {
    return dynamic(() => import('../related-items').finally(() => setLoadingRelatedNotes(false)));
  }, []);

  return {
    props,
    refs: {
      card: useRef<CardHandle>(null),
    },
    state: {
      loadingRelatedNotes,
      queriedNotes: queriedNotes.$useState(),
      noteCountString: noteCountString.$useState(),
    },
    RelatedNotes,
  }

};