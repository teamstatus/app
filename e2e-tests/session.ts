import { writeFile, mkdir, stat, readFile } from 'node:fs/promises'
import path from 'node:path'

const dataDir = path.join(process.cwd(), 'e2e-test-data')

export const storeUser = async (email: string, username: string) => {
	try {
		await stat(dataDir)
	} catch {
		console.debug(`${dataDir} does not exist`)
		await mkdir(dataDir)
	}
	await writeFile(
		path.join(dataDir, 'user.json'),
		JSON.stringify({
			email,
			username,
		}),
		'utf-8',
	)
}

export const loadUser = async (): Promise<{
	email: string
	username: string
}> => JSON.parse(await readFile(path.join(dataDir, 'user.json'), 'utf-8'))
