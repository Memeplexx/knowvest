import { useEffect, useRef } from "react";
import { connectOlikDevtoolsToStore } from "olik";
import { ServerSideProps, initialTransientState } from "./constants";
import { NoteId } from "@/server/dtos";
import { useRecord } from "@/utils/hooks";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { store } from "@/utils/store";

export const useHooks = (props: ServerSideProps) => {

  useLogoutUserIfSessionExpired();

  const activeNoteId = useRef(props.notes[0]?.id || 0 as NoteId).current;
  const selectedTagIds = useRef(props.noteTags.filter(nt => nt.noteId === activeNoteId).map(nt => nt.tagId)).current;

  const init = useRef(true);
  if (init.current) {
    store.$patchDeep({
      ...props,
      activeNoteId,
      synonymIds: props.tags.filter(t => selectedTagIds.includes(t.id)).map(t => t.synonymId).distinct(),
      activePanel: {
        editorHasText: !!props.notes[0]?.text || false,
      }
    });
    init.current = false;
  }

  const state = store.home.$useState();

  const transient = useRecord(
    initialTransientState
  )

  useEffect(() => {
    connectOlikDevtoolsToStore({ trace: true });
  }, []);

  useLcpAnalyser();

  useHeaderExpander();

  return {
    store,
    ...transient,
    ...state,
  }
}

const useHeaderExpander = () => {
  useEffect(() => {
    const listener = () => {
      const { headerExpanded } = store.$state.home;
      if (window.innerWidth < 1000 && !headerExpanded) {
        store.home.headerExpanded.$set(true);
      } else if (window.innerWidth >= 1000 && headerExpanded) {
        store.home.headerExpanded.$set(false);
      }
    }
    listener();
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener);
  }, []);
}

const useLogoutUserIfSessionExpired = () => {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/?session-expired=true').catch(console.error);
    }
  }, [router, session.status]);
}

const useLcpAnalyser = () => {
  useEffect(() => {
    const LCP_SUB_PARTS = [
      'Time to first byte',
      'Resource load delay',
      'Resource load time',
      'Element render delay',
    ];
  
    new PerformanceObserver((list) => {
      const lcpEntry = list.getEntries().at(-1) as { url: string; startTime: number; element: unknown; } | undefined;
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const lcpResEntry = performance
        .getEntriesByType('resource')
        .filter((e) => e.name === lcpEntry!.url)[0] as PerformanceResourceTiming;
  
      // Ignore LCP entries that aren't images to reduce DevTools noise.
      // Comment this line out if you want to include text entries.
      if (!lcpEntry?.url) return;
  
      // Compute the start and end times of each LCP sub-part.
      // WARNING! If your LCP resource is loaded cross-origin, make sure to add
      // the `Timing-Allow-Origin` (TAO) header to get the most accurate results.
      const ttfb = navEntry.responseStart;
      const lcpRequestStart = Math.max(
        ttfb,
        // Prefer `requestStart` (if TOA is set), otherwise use `startTime`.
        lcpResEntry ? lcpResEntry.requestStart || lcpResEntry.startTime : 0
      );
      const lcpResponseEnd = Math.max(
        lcpRequestStart,
        lcpResEntry ? lcpResEntry.responseEnd : 0
      );
      const lcpRenderTime = Math.max(
        lcpResponseEnd,
        // Use LCP startTime (which is the final LCP time) as sometimes
        // slight differences between loadTime/renderTime and startTime
        // due to rounding precision.
        lcpEntry ? lcpEntry.startTime : 0
      );
  
      // Clear previous measures before making new ones.
      // Note: due to a bug this does not work in Chrome DevTools.
      LCP_SUB_PARTS.forEach((part) => performance.clearMeasures(part));
  
      // Create measures for each LCP sub-part for easier
      // visualization in the Chrome DevTools Performance panel.
      const lcpSubPartMeasures = [
        performance.measure(LCP_SUB_PARTS[0], {
          start: 0,
          end: ttfb,
        }),
        performance.measure(LCP_SUB_PARTS[1], {
          start: ttfb,
          end: lcpRequestStart,
        }),
        performance.measure(LCP_SUB_PARTS[2], {
          start: lcpRequestStart,
          end: lcpResponseEnd,
        }),
        performance.measure(LCP_SUB_PARTS[3], {
          start: lcpResponseEnd,
          end: lcpRenderTime,
        }),
      ];
  
      // Log helpful debug information to the console.
      console.log('LCP value: ', lcpRenderTime);
      console.log('LCP element: ', lcpEntry.element, lcpEntry.url);
      console.table(
        lcpSubPartMeasures.map((measure) => ({
          'LCP sub-part': measure.name,
          'Time (ms)': measure.duration,
          '% of LCP': `${Math.round((1000 * measure.duration) / lcpRenderTime) / 10
            }%`,
        }))
      );
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  })
}
