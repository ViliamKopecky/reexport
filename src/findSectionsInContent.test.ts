import { findSectionsInContent } from './findSectionsInContent'

describe('findSectionsInContent', async () => {
	test.each([
		[
			`
// @reexport
`,
			[{ input: '', output: undefined }],
		],
		[
			`
// @reexport
// @end-reexport
`,
			[{ input: '', output: undefined }],
		],
		[
			`
// @reexport ./*.tsx
`,
			[{ input: './*.tsx', output: undefined }],
		],
		[
			`
// @reexport ./*.tsx,./**/*.story.tsx
`,
			[{ input: './*.tsx,./**/*.story.tsx', output: undefined }],
		],
		[
			`
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$2'
`,
			[{ input: './*.tsx,./**/*.story.tsx', output: '\texport * from \'./$2\'' }],
		],
		[
			`
// @reexport ./*.tsx,./**/*.story.tsx:\texport * from './$2'
a
b
c
// @end-reexport
`,
			[{ input: './*.tsx,./**/*.story.tsx', output: '\texport * from \'./$2\'' }],
		],
		[
			`
// @reexport a:b
// @end-reexport

// @reexport c:d
// @end-reexport

// @reexport e:f
a
b
c
// @end-reexport
`,
			[
				{ input: 'a', output: 'b' },
				{ input: 'c', output: 'd' },
				{ input: 'e', output: 'f' },
			],
		],
	])('case %#\n%s', async (input, expected) => {
		expect(await findSectionsInContent(input)).toEqual(expected)
	})
})
