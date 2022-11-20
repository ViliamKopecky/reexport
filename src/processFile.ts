import fs from 'fs/promises'
import path from 'path'
import { replaceSectionsInContent } from './replaceSectionsInContent'

export async function processFile(cwd: string, filepath: string) {
	const original = (
		await fs.readFile(path.join(cwd, filepath), 'utf-8')
	).toString()

	const update = await replaceSectionsInContent({
		content: original,
		filepath,
	})

	if (update !== original) {
		await fs.writeFile(path.join(cwd, filepath), update)
	}
}
