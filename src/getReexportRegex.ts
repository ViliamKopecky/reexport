export function getReexportRegex() {
	return /((([ \t]*)\/\/ @reexport[ \t]*([^:\n]+)?(:(.*))?)(\n|$))((.*\n)*?(([ \t]*)(\/\/ @end-reexport)(\n|$)))?/gi
}
