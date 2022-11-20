import { expandOutput } from './expandOutput'

describe('expandOutput', async () => {
	it('dollar', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '$1 $2 $3 $4 $5',
			})
		).toEqual('d.module.tsx a/b/c/d.module d.module d .tsx')
	})
	it('named', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '$BASENAME $PATH $NAME $SAFE_NAME $EXT',
			})
		).toEqual('d.module.tsx a/b/c/d.module d.module d .tsx')
	})
	it('escaped dollar', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '\\$1 \\$2 \\$3 \\$4 \\$5',
			})
		).toEqual('$1 $2 $3 $4 $5')
	})
	it('escaped named', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '\\$BASENAME \\$PATH \\$NAME \\$SAFE_NAME \\$EXT',
			})
		).toEqual('$BASENAME $PATH $NAME $SAFE_NAME $EXT')
	})
})
