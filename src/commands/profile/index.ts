import {
	getProfilePublicTracks,
	parseProfileUrlInfo,
} from '@/common/profile.ts'
import { ensureTrackDownloaded } from '@/common/track.ts'
import { waitMilliseconds } from '@/common/utils.ts'
import { Store } from '@/store/index.ts'
import { Command } from 'commander'
import pMap from 'p-map'

export async function profileCommand(
	profile: string,
	localOptions: { concurrency: string; wait: string },
	program: Command
) {
	const concurrency = parseInt(localOptions.concurrency) ?? 1
	const wait = parseInt(localOptions.wait) ?? 1

	const options = program.optsWithGlobals()

	const store = new Store({ dataPath: options.dataPath })

	const profileInfo = parseProfileUrlInfo(profile)

	const tracks = await getProfilePublicTracks(profileInfo)

	await pMap(
		tracks,
		async track => {
			await ensureTrackDownloaded(track, store)
			await waitMilliseconds(wait * 1000)
		},
		{ concurrency }
	)

	console.log({ profileInfo, concurrency, wait, tracks })
	// TODO: dl profile
}
