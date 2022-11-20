import { findSectionsInContent } from './findSectionsInContent'

const F1 = `
// @reexport
`

const F2 = `
// @reexport
// @end-reexport
`

const F3 = `
// @reexport ./*.tsx
`

const F4 = `
// @reexport ./*.tsx,./**/*.story.tsx
`

const F5 = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$2'
`

const F6 = `
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$2'
a
b
c
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

describe('findSectionsInContent', async () => {
	it('should work', async () => {
		expect(await findSectionsInContent(F1)).toEqual([
			{ input: '', output: undefined },
		])
		expect(await findSectionsInContent(F2)).toEqual([
			{ input: '', output: undefined },
		])
		expect(await findSectionsInContent(F3)).toEqual([
			{ input: './*.tsx', output: undefined },
		])
		expect(await findSectionsInContent(F4)).toEqual([
			{ input: './*.tsx,./**/*.story.tsx', output: undefined },
		])
		expect(await findSectionsInContent(F5)).toEqual([
			{ input: './*.tsx,./**/*.story.tsx', output: '\texport * from \'./$2\'' },
		])
		expect(await findSectionsInContent(F6)).toEqual([
			{ input: './*.tsx,./**/*.story.tsx', output: '\texport * from \'./$2\'' },
		])
		expect(await findSectionsInContent(F7)).toEqual([
			{ input: 'a', output: 'b' },
			{ input: 'c', output: 'd' },
			{ input: 'e', output: 'f' },
		])
	})
})
