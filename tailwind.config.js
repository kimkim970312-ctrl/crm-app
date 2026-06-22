/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        cta: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  safelist: [
    // 分页按钮尺寸
    'w-[34px]', 'h-[34px]',
    // 分页按钮状态
    'bg-primary-600', 'border-primary-600', 'text-white',
    'text-slate-600',
    'hover:bg-primary-50', 'hover:border-primary-100', 'hover:text-primary-600',
    'hover:bg-primary-700', 'hover:border-primary-700',
    // 通用任意值
    'text-[13px]', 'text-[12px]', 'text-[11px]',
    'h-[38px]', 'w-[160px]', 'w-[180px]', 'w-[18px]', 'h-[18px]',
  ],
  plugins: [],
}
