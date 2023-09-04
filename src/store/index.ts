import { parseTrackUrlInfo, type TrackUrlInfo } from '@/common/track.ts'
import { createWriteStream, WriteStream } from 'node:fs'
import { dirname } from 'node:path'

import { mkdirp } from 'mkdirp'

type StoreOptions = {
	dataPath: string
}

export class Store {
	#dataPath: string

	constructor({ dataPath }: StoreOptions) {
		this.#dataPath = dataPath
	}

	async streamTo(
		stream: ReadableStream,
		{ profileSlug, trackSlug }: TrackUrlInfo,
		extension: string
	) {
		const filePath = `${
			this.#dataPath
		}/${profileSlug}/${trackSlug}.${extension}`

		await mkdirp(dirname(filePath))

		const fileStream = WriteStream.toWeb(createWriteStream(filePath))

		await stream.pipeTo(fileStream)
	}
}
