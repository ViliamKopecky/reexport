import chokidar from 'chokidar'
import fs from 'fs/promises'
import path from 'path'
import { createDebounce } from './createDebounce'
import { createWatchersRepository } from './createWatchersRepository'
import { findSectionsInContent } from './findSectionsInContent'
import { processFile } from './processFile'

export default reexport

export async function reexport(options: {
	files: string[];
	cwd?: string;
	watch?: boolean;
}) {
	const { files } = options

	const cwd = options.cwd ?? process.cwd()
	const watch = options.watch ?? false

	const debounce = createDebounce()

	const debouncedProcessFile = (filepath: string) =>
		debounce(filepath, () => processFile(cwd, filepath))

	if (watch) {
		const watchers = createWatchersRepository()
		const watcher = chokidar.watch(files, { cwd })

		watcher.on('all', async (_event, filepath) => {
			const content = await fs.readFile(path.join(cwd, filepath), 'utf-8')

			const parsed = await findSectionsInContent(content)

			const watchset = new Set<string>()

			parsed.forEach((p) => {
				if (p.input) {
					watchset.add(p.input)
				}
			})

			const patterns = [...watchset]

			patterns.forEach((pattern) => {
				const existing = watchers[filepath]?.[pattern]

				if (!existing) {
					const f = (watchers[filepath] =
						watchers[filepath] ?? (watchers[filepath] = {}))
					const p = (f[pattern] =
						f[pattern] ??
						chokidar.watch(pattern, { cwd: path.dirname(filepath) }))
					p.on('all', () => {
						debouncedProcessFile(filepath)
					})
				}
			})

			debouncedProcessFile(filepath)
		})

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
			module.globby(files, { cwd })
		)
		await Promise.all(foundFiles.map((filepath) => processFile(cwd, filepath)))

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => {}
	}
}
