import { PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactScopedCssPlugin } from 'rollup-plugin-react-scoped-css'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import vitePluginImp from 'vite-plugin-imp'
import AntdResolver from 'unplugin-auto-import-antd'

const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		reactScopedCssPlugin() as PluginOption,
		AutoImport({
			dts: './src/types/atuo-imports.d.ts',
			imports: ['react', 'react-router-dom'],
			resolvers: [AntdResolver({ prefix: 'A' })]
		}),
		vitePluginImp({
			libList: [
				{
					libName: 'antd',
					style(component) {
						return `antd/es/${component}/style/index.js`
					}
				}
			]
		})
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
	},
	build: {
		sourcemap: false,
		assetsDir: 'static',
		rollupOptions: {
			input: {
				index: 'index.html'
			},
			output: {
				chunkFileNames: 'static/js/[name]-[hash].js',
				entryFileNames: 'static/js/[name]-[hash].js',
				assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
				sanitizeFileName(name) {
					const match = DRIVE_LETTER_REGEX.exec(name)
					const driveLetter = match ? match[0] : ''
					// substr 是被淘汰語法，因此要改 slice
					return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
				},
				manualChunks: {
					react: ['react', 'react-router-dom', 'antd']
				}
			}
		}
	}
})
