import { replaceSections } from './replaceSections'

const F1 = `
// @reexport
`
const F1Output = `
// @reexport
// @end-reexport
`

const F2 = `
// @reexport
// @end-reexport
`
const F2Output = `
// @reexport
// @end-reexport
`

const F3 = `
// @reexport ./*.tsx
`
const F3Output = `
// @reexport ./*.tsx
export * from './a'
export * from './b'
// @end-reexport
`

const F4 = `
// @reexport ./*.tsx,./**/*.story.tsx
`
const F4Output = `
// @reexport ./*.tsx,./**/*.story.tsx
export * from './a'
export * from './b'
export * from './d/e/f.story'
export * from './g/h.story'
// @end-reexport
`

const F5 = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$TS_PATH'
`
const F5Output = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$TS_PATH'
\texport * from './a'
\texport * from './b'
\texport * from './d/e/f.story'
\texport * from './g/h.story'
// @end-reexport
`

const F6 = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$TS_PATH'
a
b
c
// @end-reexport
`
const F6Output = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$TS_PATH'
	export * from './a'
	export * from './b'
	export * from './d/e/f.story'
	export * from './g/h.story'
// @end-reexport
`

const F7 = `
// @reexport a:b
// @end-reexport

// @reexport c:d
// @end-reexport

// @reexport e:f
a
b
c
// @end-reexport
`
const F7Output = `
// @reexport a:b
b
// @end-reexport

// @reexport c:d
d
// @end-reexport

// @reexport e:f
// @end-reexport
`

describe('replaceSections', async () => {
	it('F1', async () => {
		expect(
			replaceSections({
				content: F1,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {},
			})
		).toEqual(F1Output)
	})
	it('F2', async () => {
		expect(
			replaceSections({
				content: F2,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {},
			})
		).toEqual(F2Output)
	})
	it('F3', async () => {
		expect(
			replaceSections({
				content: F3,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {
					'./*.tsx': ['a.tsx', 'b.tsx', 'c.tsx'],
				},
			})
		).toEqual(F3Output)
	})
	it('F4', async () => {
		expect(
			replaceSections({
				content: F4,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {
					'./*.tsx,./**/*.story.tsx': [
						'a.tsx',
						'b.tsx',
						'c.tsx',
						'd/e/f.story.tsx',
						'g/h.story.tsx',
					],
				},
			})
		).toEqual(F4Output)
	})
	it('F5', async () => {
		expect(
			replaceSections({
				content: F5,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {
					'./*.tsx,./**/*.story.tsx': [
						'a.tsx',
						'b.tsx',
						'c.tsx',
						'd/e/f.story.tsx',
						'g/h.story.tsx',
					],
				},
			})
		).toEqual(F5Output)
	})
	it('F6', async () => {
		expect(
			replaceSections({
				content: F6,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {
					'./*.tsx,./**/*.story.tsx': [
						'a.tsx',
						'b.tsx',
						'c.tsx',
						'd/e/f.story.tsx',
						'g/h.story.tsx',
					],
				},
			})
		).toEqual(F6Output)
	})
	it('F7', async () => {
		expect(
			replaceSections({
				content: F7,
				filepath: 'a/b/c.tsx',
				matchedFilesRepo: {
					a: ['a'],
					c: ['c'],
				},
			})
		).toEqual(F7Output)
	})
})
