# Expense Tracker

A full-stack expense tracking application built with Node.js, Express, and React Native.

## Features

- Track daily expenses
- Categorize expenses
- View expense history
- Real-time updates
- Mobile-friendly interface

## Tech Stack

- Backend: Node.js, Express
- Database: Neon (PostgreSQL)
- Rate Limiting: Upstash Redis
- Mobile: React Native

## Setup

1. Clone the repository
```bash
git clone [your-repository-url]
cd expense-tracker
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

4. Run the application
```bash
# Start backend server
cd backend
npm run dev

# Start mobile app
cd ../mobile
npm start
```

## Contributing

Feel free to submit issues and pull requests.

## License

MIT 