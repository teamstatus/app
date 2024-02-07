import { render } from 'preact'
import { App } from './App.js'
import { relativeTime } from '#util/date.js'

console.debug('API endpoint', API_ENDPOINT)
console.debug('WS endpoint', WS_ENDPOINT)
console.debug('version', VERSION)
console.debug('build time', BUILD_TIME, relativeTime(new Date(BUILD_TIME)))

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(<App />, root)
}
