import { FSWatcher } from 'chokidar'

export type WatchersRepository = Record<
	string,
	Record<string, FSWatcher | undefined> | undefined
>

export function createWatchersRepository(): WatchersRepository {
	return {}
}
