export function parseRegexMatch(args: RegExpMatchArray) {
	const [_0, __0, opening, indent, input, _1, output, _2, _3, _4, closing] =
		args

	const result = { opening, indent, input: input ?? '', output, closing }

	return result
}
