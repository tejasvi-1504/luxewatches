# LuxeWatches — How To Run

## Prerequisites
- Node.js 18+
- MongoDB running locally (or update MONGO_URI in server/.env)

## 1. Start MongoDB
Make sure MongoDB is running on localhost:27017

## 2. Seed the Database (first time only)
```
cd server
npm run seed
```
This creates:
- Admin: admin@luxewatches.com / admin123
- 15+ products (watches + bags)
- 6 categories

## 3. Start Backend
```
cd server
npm run dev
```
Runs on http://localhost:5000

## 4. Start Frontend (new terminal)
```
cd client
npm run dev
```
Runs on http://localhost:5173

## URLs
- Website: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- API: http://localhost:5000/api
