import type { ComponentChildren } from 'preact'
import { useUI } from '#context/UI.js'
import cx from 'classnames'
import type { JSXInternal } from 'preact/src/jsx'

export const Aside = ({
	children,
	class: c,
	style,
}: {
	children: ComponentChildren
	class?: string
	style?: JSXInternal.CSSProperties
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
			style={style}
		>
			{children}
		</aside>
	)
}
