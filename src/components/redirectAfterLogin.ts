export const redirectAfterLogin = (redirect: string): string =>
	`/login?${new URLSearchParams({
		redirect,
	}).toString()}`
