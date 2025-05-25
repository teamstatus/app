import { render } from 'preact'
import { App } from './App.tsx'
import { relativeTime } from '#util/date.ts'

console.debug('API endpoint', API_ENDPOINT)
console.debug('version', VERSION)
console.debug('build time', BUILD_TIME, relativeTime(new Date(BUILD_TIME)))

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(<App />, root)
}
