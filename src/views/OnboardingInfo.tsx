import { Aside } from '#components/Aside.js'
import { logoColors } from '#components/Colorpicker.js'
import Color from 'color'
import type { ComponentChild } from 'preact'

export const OnboardingInfo = ({ children }: { children: ComponentChild }) => {
	return (
		<Aside
			style={{
				backgroundColor: new Color(logoColors[7]).lighten(1.25).hex(),
			}}
			class={'py-4 mb-4'}
		>
			<div class="container mt-lg-4">
				<div class="row">
					<div class="col-12 col-lg-8 offset-lg-2">{children}</div>
				</div>
			</div>
		</Aside>
	)
}
