import { parse } from 'node-html-parser'
import { type TrackUrlInfo, parseTrackUrlInfo } from './track.ts'
import { fetchText } from './utils.ts'

export type ProfileUrlInfo = {
	profileSlug: string
}

export function getProfileUrl(profileSlug: string): string {
	return `https://soundgasm.net/u/${profileSlug}`
}

export async function getProfilePublicTracks(
	profile: ProfileUrlInfo
): Promise<TrackUrlInfo[]> {
	const profilePageHtml = await fetchText(getProfileUrl(profile.profileSlug))

	const profilePage = parse(profilePageHtml)

	const trackLinks = profilePage.querySelectorAll('.sound-details a')

	const trackUrls = trackLinks
		.map(el => el.getAttribute('href'))
		.filter((link): link is string => typeof link === 'string')
	// console.log('trackUrls', trackUrls)

	const urls = trackUrls.flatMap(v => parseTrackUrlInfo(v) ?? [])

	return urls
}

export function parseProfileUrlInfo(v: string): ProfileUrlInfo {
	const match = v.match(/https:\/\/soundgasm.net\/u\/([0-9a-zA-Z]+)/)

	if (!match) return { profileSlug: v }

	const [, profileSlug] = match

	return { profileSlug }
}
