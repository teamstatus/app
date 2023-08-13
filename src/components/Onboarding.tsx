import { logoColors } from '#components/Colorpicker.js'
import Color from 'color'
import { Aside } from '#components/Aside.js'

export const Onbaording = () => (
	<Aside>
		<div
			style={{
				backgroundColor: new Color(logoColors[8]).lighten(0.9).hex(),
			}}
			class={'pt-4'}
		>
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 ">
						<h2>Getting started</h2>
						<p>
							If you are new to{' '}
							<span
								style={{
									fontFamily: 'var(--headline-font)',
									fontWeight: 700,
								}}
							>
								teamstatus.space
							</span>{' '}
							then let's familiarize yourself with how it works.
						</p>
						<p>
							In{' '}
							<span
								style={{
									fontFamily: 'var(--headline-font)',
									fontWeight: 700,
								}}
							>
								teamstatus.space
							</span>{' '}
							everything centers around sharing what happened in a project using
							a <em>sync</em>, a meeting where multiple project members come
							together to share about what happened in the project since the
							last sync.
						</p>
						<p>
							Before you can share your first status in a sync , we need a
							project that this status belongs to. And projects belong to
							organizations.
						</p>
						<p>
							So let's start by{' '}
							<a href="/organization/create?onboarding=1">
								creating an organization
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	</Aside>
)
