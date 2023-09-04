import { parseProfileUrlInfo } from '@/common/profile.ts'
import { deepEqual } from 'node:assert'
import { test } from 'node:test'

test('parseProfileUrlInfo', () => {
	deepEqual(parseProfileUrlInfo('https://soundgasm.net/u/muffinsmuffins'), {
		profileSlug: 'muffinsmuffins',
	})
})
