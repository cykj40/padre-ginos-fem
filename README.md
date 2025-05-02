# Papa Giorgio's Pizza

A modern pizza ordering website built with Next.js and React Query.

## Features

- Responsive design
- Menu browsing
- Cart functionality
- Contact form
- Modern UI/UX

## Tech Stack

- Next.js 14
- React 18
- React Query
- Turso (SQLite) for database
- CSS Modules for styling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   TURSO_DB_URL=your_turso_db_url
   TURSO_DB_AUTH_TOKEN=your_turso_auth_token
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js app directory
  - `components/` - Reusable React components
  - `lib/` - Utility functions and database setup
  - `api/` - API routes
  - `styles/` - Global styles
- `public/` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
