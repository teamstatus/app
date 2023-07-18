import { describe, test as it } from 'node:test'
import assert from 'node:assert'
import { orderIds } from './orderIds.js'

const examples: [string[], string, 'up' | 'down', string[]][] = [
	[['$acme'], '$acme', 'up', ['$acme']],
	[['$acme'], '$acme', 'down', ['$acme']],
	[['$acme', '$bravo'], '$acme', 'down', ['$bravo', '$acme']],
	[['$acme', '$bravo'], '$acme', 'up', ['$acme', '$bravo']],
	[['$acme', '$bravo'], '$bravo', 'down', ['$acme', '$bravo']],
	[['$acme', '$bravo'], '$bravo', 'up', ['$bravo', '$acme']],
	[
		['$acme', '$bravo', '$charlie'],
		'$bravo',
		'up',
		['$bravo', '$acme', '$charlie'],
	],
	[
		['$acme', '$bravo', '$charlie'],
		'$bravo',
		'down',
		['$acme', '$charlie', '$bravo'],
	],
	[
		['$acme', '$bravo', '$charlie', '$delta'],
		'$bravo',
		'down',
		['$acme', '$charlie', '$bravo', '$delta'],
	],
	[
		['$acme', '$bravo', '$charlie', '$delta'],
		'$charlie',
		'up',
		['$acme', '$charlie', '$bravo', '$delta'],
	],
]

describe('orderIds()', () => {
	for (const [orderedProjectIds, projectId, direction, expected] of examples) {
		it(`should order projects ${JSON.stringify(
			orderedProjectIds,
		)}: ${direction} ${projectId} -> ${JSON.stringify(expected)}`, () =>
			assert.deepEqual(
				orderIds(orderedProjectIds, projectId, direction),
				expected,
			))
	}
})
