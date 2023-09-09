import { test } from '@playwright/test'

test('login', async ({ page }) => {
	await page.goto('http://localhost:8080/')
	await page.getByRole('button').click()
	await page.getByRole('link', { name: 'Log in' }).click()
	await page
		.getByPlaceholder('e.g. "alex@example.com"')
		.fill('alex@test.teamstatus.space')
	await page.getByRole('button', { name: 'Request PIN' }).click()
	await page.getByPlaceholder('e.g. "12345678"').fill('12345678')
	await page.getByRole('button', { name: 'Sign in' }).click()
	await page.getByPlaceholder('e.g. "alex"').fill('alex')
	await page.getByPlaceholder('e.g. "Alex Doe"').fill('Alex Doe')
	await page.getByPlaceholder('e.g. "they/them"').fill('they/them')
	await page.getByRole('complementary').getByRole('button').click()
	await page.getByRole('heading', { name: 'Welcome @alex!' }).click()
	await page.getByRole('banner').getByRole('button').click()
	await page.getByRole('link', { name: 'Profile@alex' }).click()
})
