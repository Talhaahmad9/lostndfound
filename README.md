# LostNFound

A modern Lost & Found web app for reporting, searching, and managing lost or found items. Built with Next.js, MongoDB, and Tailwind CSS.

**Live:** [https://lostndfound.site](https://lostndfound.site)

## Features
- Report lost or found items with details and contact info
- Search and filter items in real time
- View all items in a responsive dashboard
- Item detail pages for more information
- SEO-friendly with sitemap, robots.txt, and favicon

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Talhaahmad9/lostndfound.git
   cd lostndfound
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file and add your MongoDB connection string:
     ```env
     MONGODB_URI=your-mongodb-uri
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment
- Deploy easily on [Vercel](https://vercel.com/)
- Set your environment variables in the Vercel dashboard
- Link your custom domain (e.g., https://lostndfound.site)

## SEO & Best Practices
- `public/favicon.ico` for site icon
- `public/robots.txt` and `public/sitemap.xml` for search engines

## License
MIT
