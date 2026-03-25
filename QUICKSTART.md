# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start the Development Server

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

## Step 3: Login

Use these demo credentials:
- **Email:** admin@example.com
- **Password:** admin123

## Step 4: Manage Scores

1. You'll see a list of teams in the dashboard
2. Click the "Edit" button in any Round column
3. Fill in the scores (0-100 for each criterion):
   - Understanding
   - Approach
   - Result
   - Presentation
4. Check the real-time average score calculation
5. Click "Save" to submit

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```
admin-portal/
├── src/
│   ├── components/        # Reusable components
│   │   └── ScoreForm.jsx
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind styles
├── index.html
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json
```

## Environment Variables

Create a `.env` file (optional, for custom API URLs):

```
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

## API Integration

The app currently uses demo data. To connect to your backend API, uncomment and update the API calls in:

1. **Login** - `src/pages/LoginPage.jsx`
2. **Fetch Teams** - `src/pages/Dashboard.jsx`
3. **Save Scores** - `src/components/ScoreForm.jsx`

Look for `TODO` comments marked in these files.

## Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## Troubleshooting

### Port already in use
Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change this to another port
}
```

### Styles not loading
Ensure Tailwind CSS is properly installed:
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Dependencies installation fails
```bash
# Delete node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Demo Data

The app comes with 3 sample teams:
1. Vision Coders
2. Data Warriors
3. AI Innovators

All scores start at 0 and can be edited through the UI.

## Next Steps

1. Replace demo data with your actual backend API
2. Update API endpoints in the TODO comments
3. Customize the team data as needed
4. Deploy to your hosting platform
