# MongoDB Setup Guide

## ✅ MongoDB is Now Installed!

MongoDB has been installed on your Mac using Homebrew. Here's what you need to know:

## 🚀 Starting MongoDB

MongoDB should now be running automatically. To verify or manage it:

**Check if MongoDB is running:**
```bash
brew services list
```

**Start MongoDB (if not running):**
```bash
brew services start mongodb/brew/mongodb-community@8.0
```

**Stop MongoDB:**
```bash
brew services stop mongodb/brew/mongodb-community@8.0
```

**Restart MongoDB:**
```bash
brew services restart mongodb/brew/mongodb-community@8.0
```

## 📝 Your Environment Setup

You've already added this to your `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/doc-app
```

This is correct! It connects to:
- **Host**: `localhost` (your local machine)
- **Port**: `27017` (MongoDB default port)
- **Database**: `doc-app` (will be created automatically)

## 🎯 Next Steps

### 1. Verify MongoDB is Running

Open a new terminal and run:
```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB: 8.0.16
```

Type `exit` to leave mongosh.

### 2. Seed Your Database

Once your Next.js app is running, seed the database with dummy data:

**Option A: Using the provided script (easiest)**
```bash
# Make sure Next.js is running first: yarn dev
./scripts/seed-db.sh
```

**Option B: Using curl (in terminal)**
```bash
curl -X POST http://localhost:3000/api/seed
```

**Option C: Using your browser**
1. Start your Next.js app: `yarn dev`
2. Use a tool like Postman/Insomnia to make a POST request to `http://localhost:3000/api/seed`

### 3. Verify Data Was Seeded

Connect to MongoDB and check:
```bash
mongosh
use doc-app
db.patients.countDocuments()
db.consultations.countDocuments()
```

You should see 10 patients and multiple consultations.

## 📚 Understanding MongoDB Basics

### What is MongoDB?
- **NoSQL Database**: Stores data as documents (like JSON objects)
- **Collections**: Like tables in SQL (e.g., `patients`, `consultations`)
- **Documents**: Individual records (like rows in SQL)

### Your Database Structure

**Collection: `patients`**
```json
{
  "_id": "auto-generated-id",
  "name": "João Silva",
  "age": 45,
  "email": "joao.silva@email.com",
  "phone": "(11) 98765-4321",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Collection: `consultations`**
```json
{
  "_id": "auto-generated-id",
  "patientId": "patient-_id-here",
  "date": "2024-01-15",
  "doctor": "Dr. Ana Silva",
  "diagnosis": "Hipertensão",
  "notes": "Pressão arterial controlada...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🔧 Troubleshooting

### MongoDB won't start
```bash
# Check if port 27017 is in use
lsof -i :27017

# Check MongoDB logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### Connection errors in your app
1. Make sure MongoDB is running: `brew services list`
2. Check your `.env.local` file has the correct URI
3. Restart your Next.js dev server after changing `.env.local`

### Can't find .env.local
- Create it in the root of your project (same level as `package.json`)
- Make sure it's named `.env.local` (not `.env`)

## 🌐 Alternative: MongoDB Atlas (Cloud)

If you prefer a cloud solution (easier, no local setup):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doc-app?retryWrites=true&w=majority
   ```

## 📖 Useful MongoDB Commands

**Connect to MongoDB shell:**
```bash
mongosh
```

**List databases:**
```javascript
show dbs
```

**Use a database:**
```javascript
use doc-app
```

**List collections:**
```javascript
show collections
```

**View all patients:**
```javascript
db.patients.find().pretty()
```

**Count documents:**
```javascript
db.patients.countDocuments()
```

**Find a specific patient:**
```javascript
db.patients.findOne({ name: "João Silva" })
```

**Delete all data (careful!):**
```javascript
db.patients.deleteMany({})
db.consultations.deleteMany({})
```

## ✅ You're All Set!

Your MongoDB is installed and ready. Your Next.js app will automatically:
- Connect to MongoDB when you start it
- Create the `doc-app` database if it doesn't exist
- Create collections as needed
- Store and retrieve patient data

Just make sure MongoDB is running before starting your Next.js app!

