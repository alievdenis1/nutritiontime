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
			base: ['17px', '20px'],
			sm: ['15px', '18px'],
			xs: ['12px', '14px'],
			lg: ['18px', '21px'],
			title: ['28px', '32px']
		}
	},
	plugins: [],
}

