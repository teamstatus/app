import { expect, test } from '@playwright/test'
import Chance from 'chance'
import { storeUser } from './session'
import { login } from './login'

const chance = new Chance()

test('register and select an ID', async ({ page }) => {
	const email = chance.email({ domain: 'test.teamstatus.space' })
	const name = chance.name()
	const username = email.split('@')[0] as string

	await storeUser(email, username)

	await page.goto('http://localhost:8080/')
	await page.getByTestId('show-menu').click()
	await page.getByRole('link', { name: 'Log in' }).click()
	await page.getByPlaceholder('e.g. "alex@example.com"').fill(email)
	await page.getByRole('button', { name: 'Request PIN' }).click()
	await page.getByPlaceholder('e.g. "12345678"').fill('12345678')
	await page.getByRole('button', { name: 'Sign in' }).click()
	await page.getByPlaceholder('e.g. "alex"').fill(username)
	await page.getByPlaceholder('e.g. "Alex Doe"').fill(name)
	await page.getByPlaceholder('e.g. "they/them"').fill('they/them')
	await page.getByRole('complementary').getByRole('button').click()
	await expect(
		page.getByRole('heading', { name: `Welcome @${username}!` }),
	).toBeVisible()
})

test('log-in', async ({ page }) => {
	await login(page)
})

test('onboarding flow', async ({ page }) => {
	await login(page)
	await page.getByTestId('onboarding-start').click()
	await page.getByTestId('create-organization').click()
	const orgId = crypto.randomUUID()
	await page
		.getByPlaceholder('e.g. "teamstatus"', { exact: true })
		.fill(`test-org-${orgId}`)
	await page
		.getByPlaceholder('e.g. "Teamstatus"', { exact: true })
		.fill(`Test Organization ${orgId}`)
	await page.getByRole('main').getByRole('button').click()
	await expect(page.getByText(`Test Organization ${orgId}`)).toBeVisible()

	await page.getByTestId('create-project').click()
	await page
		.getByPlaceholder('e.g. "teamstatus"', { exact: true })
		.fill(`projectA`)
	await page
		.getByPlaceholder('e.g. "Teamstatus"', { exact: true })
		.fill(`Project A`)
	await page.getByRole('main').getByRole('button').click()
	await expect(page.getByText(`Project A`)).toBeVisible()

	await page.getByTestId('create-status').click()
	await page
		.getByPlaceholder('e.g. "Implemented the validation for the UI"', {
			exact: true,
		})
		.fill(`First status from e2e-tests`)
	await page.getByRole('main').getByRole('button').click()
	await expect(page.getByText(`First status from e2e-tests`)).toBeVisible()
})
