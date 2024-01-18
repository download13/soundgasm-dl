import { writeFile } from 'node:fs/promises'
import got from 'got'
import type { TrackUrlInfo } from '@/common/track'
import cheerio from 'cheerio'

export async function getProfileTrackUrlsFromGoogle(
	profileSlug: string
): Promise<string[]> {
	const results = await searchGoogle(`inurl:soundgasm.net/u/${profileSlug}/`)
	console.log(results)

	return results
}

async function searchGoogle(query: string) {
	const response = await got('https://www.google.com/search', {
		searchParams: { q: query, filter: '0' },
		headers: {
			Accept: 'text/html,*/*',
			'User-Agent':
				'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 DMOST/2.0.0 (; LGE; webOSTV; WEBOS6.3.2 03.34.95; W6_lm21a;)',
			'Sec-Ch-Ua':
				'"Google Chrome";v="79", "Chromium";v="79", "Not=A?Brand";v="24"',
			'Sec-Ch-Ua-Mobile': '?1',
			'Sec-Ch-Ua-Platform': 'webOS',
			'Sec-Fetch-Dest': 'document',
			'Sec-Fetch-Mode': 'navigate',
			'Sec-Fetch-Site': 'cross-site',
			'Sec-Fetch-User': '?1',
			'Upgrade-Insecure-Requests': '1',
		},
	})

	return response.body
}

type GoogleResult = {
	title: string
	link: string
}

export function parseGoogleResults(response: string): GoogleResult[] {
	const dom = cheerio.load(response)

	const main = document.querySelector('#main')!
	const mainChildren = Array.from(main.children)

	const resultElements = mainChildren.filter(el => {
		console.log(el.localName, el.children.length)

		if (el.localName !== 'div') return false
		if (el.children.length !== 1) return false
		// console.log(el.firstElementChild, el.firstElementChild?.className)
		// if (el.firstElementChild?.classList.length === 0) return false

		return true
	})
	console.log(resultElements)

	const results = resultElements.map(el => {
		const title = el.querySelector('h3')!.innerText
		const pingLink = el.querySelector('a')!.href

		const pingParams = new URLSearchParams(pingLink)
		const link = pingParams.get('q')!
		console.log(title, pingLink)

		return { title, link }
	})

	window.close()

	return results
}

function treeWalker() {}
