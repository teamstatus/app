import { fromEnv } from '@nordicsemiconductor/from-env'
import preact from '@preact/preset-vite'
import Handlebars from 'handlebars'
import { defineConfig } from 'vite'
import { homepage, version } from './siteInfo.js'

const { apiEndpoint } = fromEnv({
	apiEndpoint: 'API_ENDPOINT',
})(process.env)

const replaceInIndex = (data: Record<string, string>) => ({
	name: 'replace-in-index',
	transformIndexHtml: (source: string): string => {
		const template = Handlebars.compile(source)
		return template(data)
	},
})

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		replaceInIndex({
			version,
		}),
	],
	base: `${(process.env.BASE_URL ?? '').replace(/\/+$/, '')}/`,
	preview: {
		host: 'localhost',
		port: 8080,
	},
	server: {
		host: 'localhost',
		port: 8080,
	},
	build: {
		outDir: './build',
		sourcemap: true,
	},
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
	},
	// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
	define: {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		API_ENDPOINT: JSON.stringify(apiEndpoint.replace(/\/$/g, '')),
	},
})
