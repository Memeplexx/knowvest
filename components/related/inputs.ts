import { derive } from "olik/derive";
import { Props } from "./constants";
import { useContext, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CardHandle } from "../card/constants";
import { StoreContext } from "@/utils/constants";
import { useIsMounted } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;

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

  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(true);
  const RelatedNotes = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../related-items').finally(() => setLoading(false)));
  }, [isMounted]);

  return {
    props,
    store,
    refs: {
      card: useRef<CardHandle>(null),
    },
    state: {
      loading,
      queriedNotes: queriedNotes.$useState(),
      noteCountString: noteCountString.$useState(),
    },
    RelatedNotes,
  }

};