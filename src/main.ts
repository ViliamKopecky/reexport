import chokidar from 'chokidar'
import fs from 'fs/promises'
import path from 'path'
import { createDebounce } from './createDebounce'
import { createLogger } from './createLogger'
import { createWatchersRepository } from './createWatchersRepository'
import { findSectionsInContent } from './findSectionsInContent'
import { processFile } from './processFile'
import { ReexportContext } from './ReexportContext'

export default reexport

export async function reexport(options: {
	files: string[]
	ignore: string[]
	cwd?: string
	watch?: boolean
	verbose?: number
}) {
	const { files, ignore } = options

	const cwd = options.cwd ?? process.cwd()
	const watch = options.watch ?? false

	const logger = createLogger({ verbose: options.verbose })

	if ((options.verbose ?? 0) >= 0) {
		console.log('reexport\n')
	}

	logger.verbose(options)

	const context: ReexportContext = { logger }

	const debounce = createDebounce()

	const debouncedProcessFile = (filepath: string) => {
		logger.verbose(`debouncing processFile('${filepath}')`)
		return debounce(filepath, () => {
			logger.verbose(`running processFile('${filepath}')`)
			return processFile(cwd, filepath, context)
		})
	}

	if (watch) {
		const watchers = createWatchersRepository()
		const watcher = chokidar.watch(files, { cwd, ignored: ignore })

		const handler = async (event: 'add' | 'change' | 'unlink', filepath: string) => {
			logger.verbose(`watcher event: ${event} ${filepath}`)
			const content = await fs.readFile(path.join(cwd, filepath), 'utf-8')

			const parsed = await findSectionsInContent(content)

			const watchset = new Set<string>()

			parsed.forEach((p) => {
				if (p.input) {
					watchset.add(p.input)
				}
			})

			const patterns = [...watchset]

			logger.verbose(`watcher patterns: ${patterns.join(', ')}`)

			patterns.forEach((pattern) => {
				const existing = watchers[filepath]?.[pattern]

				if (!existing) {
					logger.verbose(`adding pattern watcher ${pattern} for ${filepath}`)
					const f = (watchers[filepath] = watchers[filepath] ?? (watchers[filepath] = {}))
					const p = (f[pattern] =
						f[pattern] ?? chokidar.watch(pattern, { cwd: path.dirname(filepath) }))
					p.on('all', () => {
						debouncedProcessFile(filepath)
					})
				}
			})

			debouncedProcessFile(filepath)
		}

		watcher.on('add', async (filepath) => handler('add', filepath))
		watcher.on('change', async (filepath) => handler('change', filepath))
		watcher.on('unlink', async (filepath) => handler('unlink', filepath))

		return async () => {
			await watcher.close()
			await Promise.all(
				Object.values(watchers).map((f) => {
					if (f) {
						Promise.all(Object.values(f).map((p) => p?.close()))
					}
				})
			)
		}
	} else {
		const foundFiles = await import('globby').then((module) =>
			module.globby(files, { cwd, ignore, onlyFiles: true })
		)
		if (foundFiles.length) {
			logger.verbose(`found ${foundFiles.length} matching files: ${foundFiles.join(', ')}`)

			const updates = await Promise.all(
				foundFiles.map((filepath) => processFile(cwd, filepath, context))
			)

			const updated = updates.filter((u) => u.updated)
			logger.log(`reexports updated in ${updated.length}/${foundFiles.length} files`)
		} else {
			logger.log('found no matching files')
		}
		return () => undefined
	}
}
