import ActiveEditor from "@/components/active-editor";
import { NoteId } from "@/server/dtos";
import { Container } from "@/utils/pages/configure-test/styles";
import { store } from "@/utils/store";

export default function ConfigureTest() {
  if (!store.$state.activeNoteId) {
    store.activeNoteId.$set(1 as NoteId);
    return <></>
  }
  return (
    <Container
      children={
        <>
          <ActiveEditor />
          <div>context</div>
        </>
      }
    />
  );
}