// This declaration file tells TypeScript how to handle non-JS/TS imports.
declare module '*.css' {
  const content: unknown
  export default content
}
