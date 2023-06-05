/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{vue,ts}'
	],
	theme: {
		extend: {},
		colors: {
			black: '#000000',
			white: '#FFFFFF',
			brown: '#968D7D',
			beige: '#FBF3E6',
			green: '#056760',
			red: '#E75854',
			yellow: '#FFD274'
		},
		fontSize: {
			default: '17px',
			small: '15px',
			big: '18px',
			title: '28px'
		}
	},
	plugins: [],
}

