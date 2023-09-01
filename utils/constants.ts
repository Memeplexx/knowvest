import { UseFloatingOptions, flip, size, autoUpdate } from '@floating-ui/react';

export const OrderTypes = {
  Created: 'dateCreated',
  Updated: 'dateUpdated',
  Viewed: 'dateViewed',
} as const;

export const floatingUiDefaultOptions = {
  whileElementsMounted: autoUpdate,
  middleware: [
    flip({ padding: 10 }),
    size({
      apply({ rects, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${availableHeight}px`
        });
      },
      padding: 10,
    })
  ]
} as Partial<UseFloatingOptions>;
