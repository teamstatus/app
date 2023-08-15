import { logoColors } from '#components/Colorpicker.js'
import Color from 'color'
import { Aside } from '#components/Aside.js'
import { AsHeadline } from '#components/HeadlineFont.js'

export const Onboarding = () => (
	<Aside>
		<div
			style={{
				backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
			}}
			class={'p-4'}
		>
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
						<h2 class="mb-3">Getting started</h2>
						<p>
							If you are new to <AsHeadline>teamstatus.space</AsHeadline>, then{' '}
							<a href="/organizations?onboarding=1">
								let's familiarize yourself with how it works
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	</Aside>
)
