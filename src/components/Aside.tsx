import type { ComponentChildren } from 'preact'
import { useUI } from '#context/UI.js'
import cx from 'classnames'

export const Aside = ({
	children,
	class: c,
}: {
	children: ComponentChildren
	class?: string
}) => {
	const { projectsMenuVisible, showProjectsMenu } = useUI()

	return (
		<aside
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
		</aside>
	)
}
