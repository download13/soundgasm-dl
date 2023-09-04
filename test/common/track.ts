import { parseTrackUrlInfo } from '@/common/track.ts'
import { deepEqual } from 'node:assert'
import { test } from 'node:test'

test('parseTrackUrlInfo', () => {
	deepEqual(
		parseTrackUrlInfo(
			'https://soundgasm.net/u/muffinsmuffins/your-shy-gf-accidentally-pees-herself-during-sex'
		),
		{
			authorSlug: 'muffinsmuffins',
			trackSlug: 'your-shy-gf-accidentally-pees-herself-during-sex',
		}
	)
})
