import type { ComponentChildren } from 'preact'
import { linkUrl } from '#util/link.js'
import { useAuth } from '#context/Auth.js'

export const LinkWithAuthentication = ({
	pathParams,
	onboarding,
	children,
}: {
	pathParams: string[]
	onboarding?: true
	children: ComponentChildren
}) => {
	const { user } = useAuth()

	const onboardingValue = onboarding ? '1' : undefined

	if (user === undefined) {
		// Not logged in
		return (
			<a
				href={linkUrl(['login'], {
					redirect: linkUrl(pathParams, { onboarding: onboardingValue }),
				})}
			>
				{children}
			</a>
		)
	}
	if (user.id === undefined) {
		// No username selected
		return (
			<a
				href={linkUrl(['id'], {
					redirect: linkUrl(pathParams, { onboarding: onboardingValue }),
				})}
			>
				{children}
			</a>
		)
	}
	return (
		<a href={linkUrl(pathParams, { onboarding: onboardingValue })}>
			{children}
		</a>
	)
}
