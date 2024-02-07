import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import {
	addMilliseconds,
	formatDay,
	formatTime,
	formatTimezone,
	relativeTime,
} from './date.js'

describe('date utils', () => {
	const d = new Date('2024-02-07T20:25:37.163Z')
	test('addMilliseconds()', () => {
		assert.equal(
			addMilliseconds(d, 1000).getTime(),
			new Date('2024-02-07T20:25:38.163Z').getTime(),
		)
	})

	test('formatDay()', () => assert.equal(formatDay(d), '2024-02-07'))
	test('formatTime()', () => assert.equal(formatTime(d), '9:25 PM')) // Users time-zone format
	test('formatTimezone()', () => assert.equal(formatTimezone(d), '+01:00'))
	test('relativeTime()', () => {
		const now = new Date('2024-02-07T21:25:37.163Z')
		assert.equal(relativeTime(d, now), 'about 1 hour ago')
	})
})
