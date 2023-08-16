import { AsHeadline } from '#components/HeadlineFont.js'
import { OnboardingInfo } from '#views/OnboardingInfo.js'

export const Onboarding = () => (
	<OnboardingInfo>
		<h2>Getting started</h2>
		<p>
			If you are new to <AsHeadline>teamstatus.space</AsHeadline>, then{' '}
			<a href="/organizations?onboarding=1">
				let's familiarize yourself with how it works
			</a>
			.
		</p>
	</OnboardingInfo>
)
