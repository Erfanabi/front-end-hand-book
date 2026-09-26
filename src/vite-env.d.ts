/// <reference types="vite/client" />

declare module 'virtual:search-index' {
  const index: Array<{
    lang: string
    part: string
    chapter: string
    heading: string
    id: string
    depth: number
  }>
  export default index
}
