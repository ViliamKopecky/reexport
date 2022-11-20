import { getReexportRegex } from './getReexportRegex'
import { parseRegexMatch } from './parseRegexMatch'

export async function findSectionsInContent(content: string) {
	const regex = getReexportRegex()

	const match = content.matchAll(regex)

	const sections = [...match]

	return sections.map((group) => {
		const { input, output } = parseRegexMatch(group)
		return { input, output }
	})
}
