import { formatDistanceToNow } from 'date-fns'
import { render } from 'preact'
import { App } from './App.js'
import { Provider as AuthProvider } from './context/Auth.js'

console.debug('API endpoint', API_ENDPOINT)
console.debug('version', VERSION)
console.debug(
	'build time',
	BUILD_TIME,
	formatDistanceToNow(new Date(BUILD_TIME), {
		addSuffix: true,
	}),
)

const root = document.getElementById('root')

if (root === null) {
	console.error(`Could not find root element!`)
} else {
	render(
		<AuthProvider>
			<App />
		</AuthProvider>,
		root,
	)
}
