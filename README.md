# Financial Tracker

A Next.js application for tracking daily financial data with category and retailer information. The app allows users to visualize their spending patterns through rolling bar charts and export the data as PDF.

## Features

- Add daily financial data with date, price, category, and retailer
- View data in daily, weekly, or monthly rolling charts
- Group data by category or retailer
- Export charts to PDF
- Responsive design using Tailwind CSS and shadcn/ui components

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dependencies

This project uses the following key dependencies:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Zod for form validation
- jsPDF and html2canvas for PDF export

## Project Structure

- `src/app/page.tsx` - Main page component
- `src/components/custom/financial-data-form.tsx` - Form for adding financial data
- `src/components/custom/financial-chart.tsx` - Chart component for visualizing data
- `src/components/ui/` - shadcn/ui components
- `src/lib/utils.ts` - Utility functions

## Usage

1. Add financial data using the form:
   - Date (defaults to today)
   - Price (defaults to 0)
   - Category (defaults to shopping)
   - Retailer (defaults to offline)

2. View data in charts:
   - Switch between daily, weekly, or monthly views
   - Group by category or retailer

3. Export charts to PDF using the export button

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
