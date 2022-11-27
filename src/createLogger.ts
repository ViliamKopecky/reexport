export function createLogger(options: {
	verbose?: number
	prefix?: string
	log?: (...args: unknown[]) => unknown
}) {
	const prefix = options.prefix
	const verbose = options.verbose ?? 0
	const log = options.log ?? console.log

	const levelLogger =
		(level: number) =>
			(...args: unknown[]) => {
				if (verbose >= level) {
					log(
						...(level !== 0 ? [`[${Array(level).fill('v').join('')}]`] : []),
						...(prefix ? [prefix] : []),
						...args
					)
				}
			}

	const logger = {
		log: levelLogger(0),
		verbose: levelLogger(1),
		debug: levelLogger(2),
		level: verbose,
	}

	return logger
}

export type Logger = ReturnType<typeof createLogger>
