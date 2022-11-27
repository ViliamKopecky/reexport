import { Command } from 'commander'
import { inspect } from 'util'
import { reexport } from './main'

inspect.defaultOptions.depth = 10

const program = new Command()

program
	.name('reexport')
	.description('CLI reexport modules from index files')
	.usage('--watch "**/index.{ts,tsx}"')
	.argument('<files...>', 'glob pattern of index files to process')
	.option('-w, --watch', 'watch for changes')
	.option('-i, --ignore <patterns...>', 'ignore files matching glob patterns', [
		'**/node_modules/**',
		'**/.git/**',
		'**/.next/**',
		'**/build/**',
		'**/dist/**',
	])
	.option(
		'-v, --verbose [level]',
		'verbose output',
		(input, prev) => {
			const numeric = String(Number(input)) === input ? Number(input) : null
			return numeric ?? prev + 1
		},
		0
	)
	.action((files, options) => {
		reexport({
			verbose: Number(options.verbose),
			watch: Boolean(options.watch),
			cwd: process.cwd(),
			files,
			ignore: options.ignore ?? [],
		})
	})

program.parse()
