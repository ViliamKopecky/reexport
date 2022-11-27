import path from 'path'

const replacers: Record<string, (filepath: string) => string> = {
	'1': (f) => path.basename(f),
	'2': (f) => path.join(path.dirname(f), path.basename(f, path.extname(f))),
	'3': (f) => path.basename(f, path.extname(f)),
	'4': (f) => path.basename(f).split('.').shift() ?? '',
	'5': (f) => path.extname(f),

	BASENAME: (f) => path.basename(f),
	TS_PATH: (f) =>
		path.join(path.dirname(f), path.basename(f, path.extname(f))).replace(/\/index$/g, ''),
	PATH: (f) => f,
	NAME: (f) => path.basename(f, path.extname(f)),
	SAFE_NAME: (f) => path.basename(f).split('.').shift() ?? '',
	EXT: (f) => path.extname(f),
}

const replacerRegex = new RegExp(`(\\\\?)\\$(${Object.keys(replacers).join('|')})`, 'gm')

export function expandOutput(props: { template: string; filepath: string }) {
	return props.template.replace(replacerRegex, (...args) => {
		const { filepath } = props
		const escaped = args[1]
		const variant = args[2]

		if (!escaped) {
			return replacers[variant as keyof typeof replacers]?.(filepath) ?? filepath
		}

		return `$${variant}`
	})
}
