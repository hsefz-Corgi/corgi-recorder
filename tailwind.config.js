/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'radial-gradient': 'radial-gradient(#e5e7eb, #bae6fd)',
            },
        },
    },
    plugins: [],
}
