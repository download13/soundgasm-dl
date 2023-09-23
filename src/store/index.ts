import type { TrackUrlInfo } from '@/common/track.ts'

import { createWriteStream, WriteStream } from 'node:fs'
import { stat, readdir } from 'node:fs/promises'
import { basename, dirname, extname } from 'node:path'

import { mkdirp } from 'mkdirp'

type TrackPathInfo = TrackUrlInfo & {
	extension: string
}

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
		{ profileSlug, trackSlug, extension }: TrackPathInfo
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

		try {
			const profileStat = await stat(profilePath)
			if (!profileStat.isDirectory()) {
				// console.log('no profile dir')
				// process.exit()
				return false
			}
		} catch (err) {
			if (
				err &&
				typeof err === 'object' &&
				'code' in err &&
				err.code === 'ENOENT'
			) {
				// Directory does not exist
				return false
			}

			throw err
		}

		const trackFiles = await readdir(profilePath)
		const trackPaths = trackFiles.map((filename): TrackPathInfo => {
			const extension = extname(filename).substring(1)

			return {
				profileSlug,
				trackSlug: basename(filename, '.' + extension),
				extension,
			}
		})

		// console.log('trackPaths', trackPaths)

		const trackPath = trackPaths.find(
			tp => tp.profileSlug === profileSlug && tp.trackSlug === trackSlug
		)

		if (!trackPath) {
			// console.log('no trackpath')
			// process.exit()
			return false
		}

		const info = await stat(
			`${profilePath}/${trackSlug}.${trackPath.extension}`
		)

		// console.log('size', info.size)
		// process.exit()

		return info.size > 0
	}
}
