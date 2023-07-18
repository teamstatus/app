import { useUI } from '../context/UI.js'
import { Ago } from './Ago.js'

export const Footer = () => {
	const { projectsMenuVisible } = useUI()

	return (
		<footer
			class="text-body-tertiary text-center p-4"
			style={{
				filter: projectsMenuVisible ? 'blur(5px)' : undefined,
			}}
		>
			version: {VERSION} &middot; build time:{' '}
			<time dateTime={BUILD_TIME}>
				<Ago date={new Date(BUILD_TIME)} />
			</time>
		</footer>
	)
}
