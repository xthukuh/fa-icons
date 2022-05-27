const path = require('path');

module.exports = {
	style: {
		postcssOptions: {
			plugins: [
				require('tailwindcss'),
				require('autoprefixer'),
			],
		},
	},
	webpack: {
		alias: {
			'@': path.join(path.resolve(__dirname, './src')),
		}
	}
};