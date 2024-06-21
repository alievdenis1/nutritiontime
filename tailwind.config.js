/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,ts,scss}'],
    theme: {
        extends: {
            fontSize: {
                base: ['16px', '20px'],
                sm: ['14px', '18px'],
                xs: ['12px', '16px'],
                lg: ['18px', '22px'],
                xl: ['20px', '24px'],
                xxl: ['28px', '32px']
            },
            boxShadow: {
                'custom-shadow': '0px 0px 34px 0px #00000014',
            },
            borderColor: {
                custom: '#1C1C1C0D',
            },
        },
        fontFamily: {
            sans: ['Roboto', 'sans-serif']
        },
        colors: {
            transparent: 'transparent',
            black: '#000000',
            white: '#FFFFFF',
            brown: '#968D7D',
            beige: '#FBF3E6',
            green: '#056760',
            red: '#E75854',
            yellow: '#FFD274',
            blue: {
                DEFAULT: '0069A5',
                100: '#019FB5'
            },
            grey: '#808080'
        },
        borderRadius: {
            DEFAULT: '15px',
            none: 'none'
        }
    },
    plugins: []
}

