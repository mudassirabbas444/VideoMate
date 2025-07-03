# Videomate

A full-stack video sharing platform built with React (frontend) and Node.js/Express (backend). Users can upload, view, and manage videos, as well as interact with other users.

## Features
- User authentication (login/register)
- Video upload, playback, and deletion
- User profile with video management
- Responsive, modern UI with Material-UI
- RESTful API backend

## Project Structure

```
videomate/
  ├── assets/
  ├── Backend/               # Node.js/Express backend
  │   ├── controller/        # Controllers for auth, video
  │   ├── middleware/        # Auth middleware
  │   ├── models/            # Mongoose models (User, Video, Comment)
  │   ├── routes/            # API routes
  │   ├── uploads/           # Uploaded video/image files
  │   └── index.js           # Backend entry point
  ├── public/                # React public assets
  ├── src/                   # React frontend source
  │   ├── Components/        # React components
  │   ├── App.js             # Main app component
  │   └── index.js           # React entry point
  └── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Backend Setup
1. `cd Backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend runs on `http://localhost:5000` by default.

### Frontend Setup
1. In the project root:
   ```bash
   npm install
   npm start
   ```
   The frontend runs on `http://localhost:3000` by default.

## Usage
- Register or log in to your account.
- Upload videos from the upload page.
- Manage your videos and profile from the profile page.
- Delete videos you own.

## API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user profile
- `GET /api/videos` — List videos (optionally by uploader)
- `POST /api/videos` — Upload a video
- `DELETE /api/videos/:id` — Delete a video


#Images
![App Screenshot](image1.png)
![App Screenshot](image2.png)
![App Screenshot](image3.png)
![App Screenshot](image4.png)
![App Screenshot](image5.png)
![App Screenshot](image6.png)
![App Screenshot](image7.png)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



## License
[MIT](LICENSE)

