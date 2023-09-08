import { Command } from 'commander'
// import React, { useState, useEffect } from 'react'
// import { render, Text } from 'ink'
import { ensureTrackDownloaded, parseTrackUrlInfo } from '@/common/track.ts'
import { Store } from '@/store/index.ts'

export async function trackCommand(
	trackUrl: string,
	_localOptions: unknown,
	program: Command
) {
	const options = program.optsWithGlobals()

	const store = new Store({ dataPath: options.dataPath })

	const trackInfo = parseTrackUrlInfo(trackUrl)
	console.log('trackCommand', trackInfo)

	if (!trackInfo) {
		return console.log('invalid track url')
	}

	await ensureTrackDownloaded(trackInfo, store)
}
