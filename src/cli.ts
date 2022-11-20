import { inspect } from 'util'
import { reexport } from './main'

inspect.defaultOptions.depth = 10

const files = process.argv.slice(2)

const cwd = process.cwd()

reexport({ cwd, files, watch: true })
