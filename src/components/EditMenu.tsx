import { CollapseRightIcon, SubMenuIcon } from '#components/Icons.js'
import { useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'

export const EditMenu = ({ children }: { children: ComponentChildren }) => {
	const [operationsVisible, showOperations] = useState<boolean>(false)

	if (!operationsVisible) {
		return (
			<button
				type="button"
				class="btn btn-sm btn-light me-1"
				onClick={() => showOperations(true)}
			>
				<SubMenuIcon size={18} />
			</button>
		)
	}
	return (
		<div>
			{children}
			<button
				type="button"
				class="btn btn-sm btn-light ms-2"
				onClick={() => showOperations(false)}
			>
				<CollapseRightIcon size={18} />
			</button>
		</div>
	)
}
