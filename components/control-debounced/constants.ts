import { ChangeEventHandler } from "react"

export type Props<T> = {
  debounceTime?: number,
  value: string,
  onChange: (value: string) => void,
  render: React.ReactElement<{ value: string, onChange: ChangeEventHandler<T> }>
}
