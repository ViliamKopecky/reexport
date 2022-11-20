import path from 'path'
import { findSectionsInContent } from './findSectionsInContent'
import { replaceSections } from './replaceSections'

export async function replaceSectionsInContent(props: {
	content: string
	filepath: string
	defaultOutput?: string
}) {
	const { content, filepath } = props

	const sections = await findSectionsInContent(content)

	const inputs = new Set(
		sections
			.map((p) => p?.input)
			.filter((item): item is NonNullable<typeof item> => Boolean(item))
	)

	const matchedFilesRepo = Object.fromEntries(
		await Promise.all(
			[...inputs].map(
				async (input) =>
					[
						input,
						await (
							await import('globby')
						).globby(input, { cwd: path.dirname(filepath) }),
					] as const
			)
		)
	)

	return replaceSections({
		filepath,
		content,
		matchedFilesRepo,
		defaultOutput: props.defaultOutput,
	})
}
