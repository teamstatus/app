import fs from 'node:fs'
import path from 'node:path'

const { version: defaultVersion, homepage: hp } = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)
export const version = process.env.VERSION ?? defaultVersion ?? Date.now()
export const homepage = hp
