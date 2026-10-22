
# User Profile Card Generator

A simple web application that allows users to create, preview, edit, and delete profile cards.

## Features

- Create user profile cards
- Preview profile information
- Save profiles in an SQLite database
- View all saved profiles
- Edit existing profiles
- Delete profiles
- Store profile details such as name, bio, skills, GitHub, and LinkedIn links

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite
- better-sqlite3

## Project Structure

```text
user-profile-card-generator/
├── database/
│   └── database.js
├── public/
│   └── index.html
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sanika250107/user-profile-card-generator.git
```

### 2. Open the project folder

```bash
cd user-profile-card-generator
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm run dev
```

### 5. Open in your browser

Visit:

http://localhost:3000

## Database

The application uses SQLite to store user profile information. The database is created locally when the application runs.

## Future Improvements

- Add user authentication
- Improve responsive design
- Add profile picture uploads
- Deploy the application online

## Author

Sanika Vyavahare

## License

This project is created for educational purposes.
