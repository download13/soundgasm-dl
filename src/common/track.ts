import type { Store } from '@/store/index.ts'
import type { ProfileUrlInfo } from './profile.ts'

import { fetchText } from './utils.ts'

export type TrackUrlInfo = ProfileUrlInfo & {
	trackSlug: string
}

export async function ensureTrackDownloaded(
	trackInfo: TrackUrlInfo,
	store: Store
) {
	const trackString = `${trackInfo.profileSlug}/${trackInfo.trackSlug}`

	if (await store.hasTrack(trackInfo)) {
		console.log(`Track ${trackString} exists in store, skipping`)
		return
	}

	const downloadInfo = await getTrackDownloadUrl(trackInfo)

	if (!downloadInfo) return null

	const res = await fetch(downloadInfo.url)

	if (res.body) {
		console.log(`Downloading track ${trackString}`)

		await store.streamTo(res.body, {
			...trackInfo,
			extension: downloadInfo.extension,
		})

		console.log(`Stored track ${trackString}`)
	}
}

export function parseTrackUrlInfo(url: string): TrackUrlInfo | null {
	const match = url.match(
		/https:\/\/soundgasm\.net\/u\/([0-9a-zA-Z_-]+)\/([0-9a-zA-Z_-]+)/
	)
	if (!match) return null

	const [, profileSlug, trackSlug] = match

	return {
		profileSlug,
		trackSlug,
	}
}

async function getTrackDownloadUrl(track: TrackUrlInfo) {
	const trackPageHtml = await fetchText(
		`https://soundgasm.net/u/${track.profileSlug}/${track.trackSlug}`
	)

	const match = trackPageHtml.match(
		/https:\/\/media.soundgasm.net\/sounds\/([0-9a-f]+)\.([0-9a-zA-Z]+)/
	)

	if (!match) {
		return null
	}

	const [, soundId, extension] = match

	return {
		url: `https://media.soundgasm.net/sounds/${soundId}.${extension}`,
		extension,
	}
}
