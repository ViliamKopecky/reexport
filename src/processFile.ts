import fs from 'fs/promises'
import path from 'path'
import { ReexportContext } from './ReexportContext'
import { replaceSectionsInContent } from './replaceSectionsInContent'

export async function processFile(cwd: string, filepath: string, context: ReexportContext) {
	const absolutePath = path.join(cwd, filepath)
	context.logger.debug(`professFile.read ${absolutePath}`)

	const original = (await fs.readFile(absolutePath, 'utf-8')).toString()

	const update = await replaceSectionsInContent({
		content: original,
		filepath,
	})

	if (update !== original) {
		context.logger.log(
			`reexports updated in ${context.logger.level >= 1 ? absolutePath : filepath}`
		)

		context.logger.verbose({ original, update })

		await fs.writeFile(absolutePath, update)
		return { updated: true }
	}
	context.logger.verbose(
		`reexports unchanged in ${context.logger.level >= 1 ? absolutePath : filepath}`
	)
	return { updated: false }
}
