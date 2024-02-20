export type Props = {
  value: string,
  onChangeDebounced: (value: string) => void,
  debounceTime?: number
}
