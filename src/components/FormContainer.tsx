import type { ComponentChild } from 'preact'
import cx from 'classnames'
import './FormContainer.css'

export const FormContainer = ({
	header,
	children,
	class: c,
}: {
	class?: string
	header: ComponentChild
	children: ComponentChild
}) => (
	<div class={cx('my-4 formContainer', c)}>
		<header>{header}</header>
		<div>{children}</div>
	</div>
)
