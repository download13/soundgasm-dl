import type { TrackUrlInfo } from '@/common/track.ts'

import { createWriteStream, WriteStream } from 'node:fs'
import { stat, readdir } from 'node:fs/promises'
import { basename, dirname, extname } from 'node:path'

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

	async hasTrack({ profileSlug, trackSlug }: TrackUrlInfo) {
		const profilePath = `${this.#dataPath}/${profileSlug}`

		const profileStat = await stat(profilePath)
		if (!profileStat.isDirectory()) {
			return false
		}

		const trackFiles = await readdir(profilePath)
		const trackSlugs = trackFiles.map(filename =>
			basename(filename, extname(filename))
		)

		if (!trackSlugs.includes(trackSlug)) {
			return false
		}

		const info = await stat(`${profilePath}/${trackSlug}`)

		return info.size > 0
	}
}
