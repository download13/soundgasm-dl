import test from 'ava'
import { readFile } from 'node:fs/promises'
import { parseGoogleResults } from './google.ts'

const googleTestHtml = await readFile(
	'test/fixtures/google_tv_inurl_soundgasm.html',
	{ encoding: 'utf-8' }
)

test('parseGoogleResults', async t => {
	const results = parseGoogleResults(googleTestHtml)
	console.log(results)
	t.assert(results.length === 10)
})
