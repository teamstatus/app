import { expect, test } from "@playwright/test";
import Chance from "chance";

const chance = new Chance();

test("register", async ({ page }) => {
	const email = chance.email({ domain: "test.teamstatus.space" });
	const name = chance.name();
	const username = email.split("@")[0] as string;
	await page.goto("http://localhost:8080/");
	await page.getByTestId("show-menu").click();
	await page.getByRole("link", { name: "Log in" }).click();
	await page.getByPlaceholder('e.g. "alex@example.com"').fill(email);
	await page.getByRole("button", { name: "Request PIN" }).click();
	await page.getByPlaceholder('e.g. "12345678"').fill("12345678");
	await page.getByRole("button", { name: "Sign in" }).click();
	await page.getByPlaceholder('e.g. "alex"').fill(username);
	await page.getByPlaceholder('e.g. "Alex Doe"').fill(name);
	await page.getByPlaceholder('e.g. "they/them"').fill("they/them");
	await page.getByRole("complementary").getByRole("button").click();
	await expect(
		page.getByRole("heading", { name: `Welcome @${username}!` }),
	).toBeVisible();
});
