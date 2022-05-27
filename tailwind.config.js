const colors = require('tailwindcss/colors');

module.exports = {
	purge: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./public/index.html'
	],
	theme: {
		extend: {
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '4rem',
					xl: '5rem',
					'2xl': '6rem',
				},
			},
			colors: {
				gray: colors.gray,
				blue: colors.blue,
				green: colors.green,
				yellow: colors.yellow,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		function({addComponents}){
			addComponents({
				'.container': {
					maxWidth: '100%',
					'@screen sm': { //640
						maxWidth: '640px',
					},
					'@screen md': { //768
						maxWidth: '900px',
					},
					'@screen lg': { //1024
						maxWidth: '1280px',
					},
					'@screen xl': { //1280
						maxWidth: '1400px',
					},
				}
			})
		}
	]
};