export { };

Array.prototype.distinct = function <T, P>(getProp?: (el: T) => P) {
  const result = new Array<T>();
  for (const el of this) {
    if (getProp) {
      if (!result.map(r => getProp(r)).includes(getProp(el))) {
        result.push(el);
      }
    } else {
      if (!result.includes(el)) {
        result.push(el);
      }
    }
  }
  return result;
};

Array.prototype.peek = function <T>(fn: (el: T, index: number) => unknown) {
  this.forEach((e, i) => fn(e, i));
  return this;
};

Array.prototype.mapToObject = function <T, K extends { toString(): string }, V>(
  getKey: (el: T, index: number) => K, getVal: (el: T, index: number) => V) {
  const result = {} as { [key: string]: V };
  this.forEach((element, index) => result[getKey(element, index).toString()] = getVal(element, index));
  return result;
};

Array.prototype.mapToMap = function <T, K, V>(getKey: (el: T, index: number) => K, getVal: (el: T, index: number) => V) {
  const result = new Map<K, V>();
  this.forEach((element, index) => result.set(getKey(element, index), getVal(element, index)));
  return result;
};

Array.prototype.groupBy = function <T, P extends string | number>(fn: (el: T) => P) {
  const result: T[][] = [];
  this.forEach(e => {
    const key = fn(e);
    const arr = result.find(r => r.some(rr => fn(rr) === key));
    if (arr) {
      arr.push(e);
    } else {
      result.push([e]);
    }
  });
  return result;
};

Array.prototype.findOrThrow = function (predicate, onError) {
  const found = this.find(predicate);
  if (!found) {
    if (onError) {
      onError();
    } else {
      throw new Error('Could not find array element');
    }
  }
  return found;
};

Array.prototype.filterTruthy = function () {
  return this.filter(value => !!value);
};

Array.prototype.merge = function <T, P = T>(toMerge: T[], getUniqueIdentifier: ((el: T) => P | T) = (el => el)) {
  toMerge
    .forEach(el => {
      const elementIndex = this.findIndex(e => getUniqueIdentifier(e) === getUniqueIdentifier(el));
      if (elementIndex !== -1) {
        this[elementIndex] = el;
      } else {
        this.push(el);
      }
    });
};

Array.prototype.mergeMap = function <T>(incoming: T | T[], match: (el1: T, el2: T) => boolean) {
  const toMerge = Array.isArray(incoming) ? incoming : [incoming];
  return [
    ...this.filter(el => !toMerge.some(e => match(e, el))),
    ...toMerge,
  ];
};

Array.prototype.remove = function <T>(elementFinder: (el: T) => boolean) {
  const indicesToRemove = this
    .map((e, i) => { if (elementFinder(e)) { return i; } return undefined; })
    .filter(e => e !== undefined) as number[];
  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    this.splice(indicesToRemove[i]!, 1);
  }
};

Array.prototype.replace = function <T, P = T>(element: T, getUniqueIdentifier: (el: T) => P) {
  const toMatch = getUniqueIdentifier(element);
  const index = this.findIndex(e => getUniqueIdentifier(e) === toMatch);
  if (index === -1) {
    throw new Error('Could not find element to replace');
  }
  this[index] = element;
};

Array.prototype.replaceElseInsert = function <T, P = T>(element: T, getUniqueIdentifier: (el: T) => P) {
  const toMatch = getUniqueIdentifier(element);
  const index = this.findIndex(e => getUniqueIdentifier(e) === toMatch);
  if (index === -1) {
    this.push(element);
  } else {
    this[index] = element;
  }
};

Array.prototype.aggregate = function () {
  return {
    sum: () => this.reduce((prev, curr) => prev + curr, 0),
    average: () => this.reduce((prev, curr) => prev + curr, 0) / this.length,
  };
};

Object.keysTyped = Object.keys;
