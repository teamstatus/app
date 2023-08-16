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
					<div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						{children}
					</div>
				</div>
			</div>
		</Aside>
	)
}
