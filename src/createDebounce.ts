export function createDebounce(timeout = 500) {
	const tasks: Record<string, NodeJS.Timeout> = {}

	return function debounce(task: string, callback: () => void) {
		if (tasks[task]) {
			clearTimeout(tasks[task])
		}

		tasks[task] = setTimeout(() => {
			callback()
		}, timeout)
	}
}
