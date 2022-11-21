# reexport

**Experimental** utility to automate reexporting TypeScript in `index.ts` files.

Insert comment instructions `// @reexport glob/pattern/*.tsx` in place where you want to reexport such files and this utility will reexport all matching files.

## Usage

Your `index.ts` looking like this:

```typescript
// @reexport ./*.{ts,tsx}
```

With directory like this:

```
./index.ts
./Alice.tsx
./Bob.ts
```

Running this:

```bash
npx reexport ./index.ts
```

Will generate this:

```typescript
// @reexport ./*.{ts,tsx}
export * from './Alice'
export * from './Bob'
// @end-reexport
```

## Installation

```bash
npm install reexport
```

## CLI usage

```
npm i -g reexport

reexport "./src/**/index.{ts,tsx}"
```

## NPX usage

```
npx reexport "./src/**/index.{ts,tsx}"
```


## Node.js usage

```typescript
import { reexport } from 'reexport'

reexport({ files: ['./index.ts'], watch: true })
```
