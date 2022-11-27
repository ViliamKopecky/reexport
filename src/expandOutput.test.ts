import { expandOutput } from './expandOutput'

describe('expandOutput', async () => {
	it('variables', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '$BASENAME $TS_PATH $PATH $NAME $SAFE_NAME $EXT',
			})
		).toEqual('d.module.tsx a/b/c/d.module a/b/c/d.module.tsx d.module d .tsx')
	})
	it('index file', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/index.tsx',
				template: '$BASENAME $TS_PATH $PATH $NAME $SAFE_NAME $EXT',
			})
		).toEqual('index.tsx a/b/c a/b/c/index.tsx index index .tsx')
	})
	it('escaped variables', async () => {
		expect(
			expandOutput({
				filepath: 'a/b/c/d.module.tsx',
				template: '\\$BASENAME \\$TS_PATH \\$PATH \\$NAME \\$SAFE_NAME \\$EXT',
			})
		).toEqual('$BASENAME $TS_PATH $PATH $NAME $SAFE_NAME $EXT')
	})
})
