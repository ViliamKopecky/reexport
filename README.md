# reexport

**Experimental** utility to automate reexporting TypeScript in `index.ts` files. Primary target is TypeScript but it should work for any language with `//` comments.

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

## Features

- watch mode `--watch`
- glob matching `reexport "**/index.{ts,tsx},something.js"`
- verbose mode `-v` | more verbose `-vv` | even more verbose `-vvv`

## Custom reexport outputs

Define outptu pattern after colon (`:`) symbol.
### Available variables

<table>
	<thead>
		<tr>
			<th colspan="6"><code>path/to/File.suffix.tsx</code></th>
		</tr>
	</thead>
	<tbody>
		<tr><td><code>$BASENAME</code></td><td><code>$PATH</code></td><td><code>$TS_PATH</code></td><td><code>$NAME</code></td><td><code>$SAFE_NAME</code></td><td><code>$EXT</code></td></tr>
		<tr><td><code>File.module.tsx</code></td><td><code>path/to/File.module.tsx</code></td><td><code>path/to/File.module</code></td><td><code>File.module</code></td><td><code>d</code></td><td><code>.tsx</code></td></tr>
	</tbody>
</table>

### Examples

```typescript
// @reexport ./*.{ts,tsx}:export * from './$TS_PATH'
export * from './Alice'
export * from './Bob'
// @end-reexport

const things = {
	// @reexport ./*.{ts,tsx}:	$SAFE_NAME: () => import('./$TS_PATH'),
	Alice: () => import('./Alice'),
	Bob: () => import('./Bob'),
	// @end-reexport
}
```

