import type { ComponentChildren } from 'preact'
import { useUI } from '#context/UI.tsx'
import cx from 'classnames'

export const Main = ({
	children,
	class: c,
}: {
	children: ComponentChildren
	class?: string
}) => {
	const { projectsMenuVisible, showProjectsMenu } = useUI()

	return (
		<main
			class={cx(c, {
				blur: projectsMenuVisible,
			})}
			onClick={() => {
				if (projectsMenuVisible) {
					showProjectsMenu(false)
				}
			}}
		>
			{children}
		</main>
	)
}
