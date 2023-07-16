import { Ago } from './Ago.js'

export const Footer = () => (
	<footer class="text-body-tertiary text-center">
		version: {VERSION} &middot; build time:{' '}
		<time dateTime={BUILD_TIME}>
			<Ago date={new Date(BUILD_TIME)} />
		</time>
	</footer>
)
