import { expect, type Page } from '@playwright/test'
import { loadUser } from './session'

export const login = async (page: Page) => {
	const { email, username } = await loadUser()
	await page.goto('http://localhost:8080/')
	await page.getByPlaceholder('e.g. "alex@example.com"').fill(email)
	await page.getByRole('button', { name: 'Request PIN' }).click()
	await page.getByPlaceholder('e.g. "12345678"').fill('12345678')
	await expect(
		page.getByRole('heading', {
			name: `Welcome to your dashboard, @${username}!`,
		}),
	).toBeVisible()
}
