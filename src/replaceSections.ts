import path from 'path'
import { expandOutput } from './expandOutput'
import { getReexportRegex } from './getReexportRegex'
import { parseRegexMatch } from './parseRegexMatch'

export function replaceSections(props: {
	filepath: string
	content: string
	matchedFilesRepo: Record<string, string[] | undefined>
	defaultOutput?: string
}) {
	const { content, matchedFilesRepo, filepath } = props

	const currentFileBasename = path.basename(filepath)

	const defaultOutput = props.defaultOutput ?? 'export * from \'./$2\''

	const regex = getReexportRegex()

	const update = content.toString().replace(regex, (...args) => {
		const { opening, indent, input, output, closing } = parseRegexMatch(args)

		const lambda = { input, output }

		const mid = lambda
			? matchedFilesRepo[lambda.input]
				?.filter((filename) => filename !== currentFileBasename)
				?.sort((a, b) => a.localeCompare(b))
				?.map((file) =>
					expandOutput({
						filepath: file,
						template: `${lambda?.output ?? defaultOutput}`,
					})
				)
				?.join('\n')
			: ''

		return `${opening}${mid ? `\n${mid}` : ''}\n${
			closing ?? `${indent.replace(/\n/g, '')}// @end-reexport\n`
		}`
	})

	return update
}
