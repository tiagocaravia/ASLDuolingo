do not interact with git ever. anything that you do that could be important in the future should be added to this file.

# ASL Duolingo - Project Documentation

## Overview
ASL learning platform inspired by Duolingo's gamification approach. Built with React/Vite frontend and Node.js/Express backend with PostgreSQL database.

## Tech Stack
- Frontend: React 18, Vite, React Router, Axios
- Backend: Express, PostgreSQL, Sequelize ORM, JWT, bcrypt
- Database: PostgreSQL

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file (use `.env.example` as template)
4. Update DATABASE_URL in `.env` with your PostgreSQL credentials
5. Seed the database: `npm run seed` (this will create tables and initial data)
6. Start server: `npm run dev` (runs on port 3000)

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Update `.env` if needed (default: http://localhost:3000)
4. Start dev server: `npm run dev` (runs on port 5173)

## Database Schema

### Users Table
- Stores user authentication info, XP, level, and streaks
- Fields: id, username, email, password_hash, total_xp, current_level, current_streak, longest_streak, last_practice_date

### Lessons Table
- Contains lesson information ordered by learning path
- Fields: id, title, description, category, order_index, required_xp, xp_reward
- Categories: alphabet, numbers, greetings, family, colors

### Exercises Table
- Exercise data with 3 types: multiple_choice, matching, sign_recognition
- Fields: id, lesson_id, type, question_text, image_url, correct_answer, options (JSONB), order_index

### Progress Table
- Tracks user progress per lesson
- Fields: id, user_id, lesson_id, status (locked/available/in_progress/completed), completion_percentage, attempts
- Unique constraint on (user_id, lesson_id)

### Achievements Table
- Achievement definitions
- Fields: id, name, description, icon, requirement_type, requirement_value
- Types: lessons_completed, streak_days, total_xp, category_complete

### UserAchievements Table
- Tracks which achievements users have earned
- Fields: id, user_id, achievement_id, earned_at
- Unique constraint on (user_id, achievement_id)

## Gamification System

### XP Values
- Exercise correct first try: 10 XP
- Exercise correct second try: 7 XP
- Exercise correct third+ try: 5 XP
- Lesson completion bonus: 50 XP
- Daily streak bonus: 20 XP
- Perfect lesson bonus: 30 XP

### Level Thresholds
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 250 XP
- Level 4: 500 XP
- Level 5: 1000 XP
- Level 6: 2000 XP
- Continues scaling...

### Streak Logic
- Increments if user practices today AND practiced yesterday
- Resets to 1 if gap > 1 day
- Updates longest_streak if current exceeds it
- Tracked via last_practice_date

## API Endpoints

### Auth
- POST /api/auth/register - Create new account
- POST /api/auth/login - Login (returns JWT)
- GET /api/auth/me - Get current user (requires auth)

### Lessons
- GET /api/lessons - Get all lessons with unlock status
- GET /api/lessons/:id - Get lesson details
- GET /api/lessons/:id/exercises - Get exercises for lesson

### Progress
- GET /api/progress - Get user's progress for all lessons
- GET /api/progress/:lessonId - Get progress for specific lesson
- POST /api/progress/:lessonId/start - Start a lesson
- PUT /api/progress/:lessonId/complete - Complete lesson
- POST /api/progress/exercise - Submit exercise answer
  Body: { exerciseId, answer, attemptCount }
  Returns: { correct, xpEarned, newTotalXp, levelUp }

### Achievements
- GET /api/achievements - Get all achievements
- GET /api/achievements/user - Get user's earned achievements

## Asset Structure
ASL content stored in `/frontend/public/assets/asl/{category}/{sign-name}.svg`

Categories:
- alphabet/ - Letter signs (a.svg through z.svg) - REAL ASL SVGs
- numbers/ - Number signs (1.svg through 9.svg) - REAL ASL SVGs
- greetings/ - Greeting signs (hello.svg, goodbye.svg, etc.) - Text placeholders
- family/ - Family member signs - Text placeholders
- colors/ - Color signs - Text placeholders

Alphabet and number SVGs are actual ASL sign illustrations. Word categories use text-based placeholder SVGs.

## Seeded Content
Initial database includes:
- 10 lessons (5 alphabet, 2 numbers, 3 common words)
- 60+ exercises across all lessons
- 7 achievements

## Key Files

### Backend
- `src/models/` - Sequelize models for all database tables
- `src/controllers/` - Request handlers for all routes
- `src/routes/` - API route definitions
- `src/services/xpService.js` - XP and level calculation
- `src/services/streakService.js` - Streak tracking logic
- `src/services/achievementService.js` - Achievement checking
- `src/seeds/initialData.js` - Database seed script
- `src/middleware/auth.js` - JWT authentication middleware

### Frontend
- `src/context/AuthContext.jsx` - Authentication state management
- `src/context/ProgressContext.jsx` - Lesson/progress state
- `src/pages/` - Main page components
- `src/components/exercises/ExerciseContainer.jsx` - Exercise flow manager
- `src/components/lessons/LessonPath.jsx` - Learning path display
- `src/services/api.js` - Axios client with JWT interceptor

## Adding New Content

### To add a new lesson:
1. Add to database via seed script or manual SQL
2. Set order_index, required_xp, category
3. Create exercises linked to lesson_id

### To add new exercises:
1. Create exercise with lesson_id
2. Set type (multiple_choice, matching, sign_recognition)
3. Add question_text, image_url (if needed), correct_answer
4. For multiple choice: set options as JSON array
5. Set order_index within lesson

### To add achievements:
1. Add to achievements table
2. Set requirement_type and requirement_value
3. Achievement service will auto-check and award

## Environment Variables

### Backend (.env)
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Secret key for JWT signing
- PORT - Server port (default 3000)
- NODE_ENV - development/production

### Frontend (.env)
- VITE_API_URL - Backend API URL (default http://localhost:3000)

## Notes
- Code style: Human-written, minimal comments, no emojis in code
- Database uses UUID primary keys
- All timestamps managed by Sequelize
- CORS enabled for development

## Authentication Removed
The application no longer requires user authentication. A default user is automatically used:
- Default User ID: `00000000-0000-0000-0000-000000000001`
- Created automatically during seed
- All requests use this default user via `injectDefaultUser` middleware
- No login/register pages - app goes directly to learning path
- Progress is saved for the default user in the database

### Backend Changes
- `src/middleware/defaultUser.js` - Injects default user into all requests
- All routes use `injectDefaultUser` instead of `authenticateToken`
- Auth routes still exist but are not used by frontend
- Seed script creates default user automatically

### Frontend Changes
- Removed AuthContext dependency
- ProgressContext now manages user state internally
- Removed Login, Register, Home pages
- App routes directly to /learn on load
- Navbar shows current XP/level from ProgressContext
- No token handling in API service

## Full Screen Optimizations
UI optimized for laptop full-screen display:
- Increased font sizes (headings 2.5rem, body text 1.1rem)
- Larger component padding (2-3rem)
- Wider max-widths (800-1400px)
- Bigger interactive elements (buttons, cards)
- Enhanced shadows and hover effects
- Full viewport height layouts (min-height: calc(100vh - 80px))
- Sticky navbar with larger touch targets
- Spacious grid layouts with better gaps

## UI Fixes
Recent fixes applied:
- Centered continue button on lesson completion screen using flexbox
- Added explicit text color (#3c3c3c) to exercise option buttons for visibility
- Fixed black background issue by updating index.css to use light theme (#f7f7f7)
- Removed dark mode styles and color-scheme from root element
- Added text color to select dropdowns in matching exercises
- Centered Check Answer button in all exercise types using flexbox
- Randomized answer options order in MultipleChoice and SignRecognition exercises
- Fixed selected state persisting between questions by adding useEffect reset hooks in all exercise components

## SVG Assets
Real ASL sign SVGs now integrated:
- Copied alphabet SVGs (a-z) from /assets/ to frontend/public/assets/asl/alphabet/
- Copied number SVGs (1-9) from /assets/ to frontend/public/assets/asl/numbers/
- Updated seed script to use .svg extension instead of .gif
- Changed number lessons from "0-5, 6-10" to "1-5, 6-9" to match available assets
- Created text-based placeholder SVGs for word categories (greetings, family, colors)
- All exercises now display actual ASL sign illustrations for alphabet and numbers

## React Strict Mode Race Condition Fix
Fixed issue where clicking a lesson for the first time caused "Failed to load lesson" error:
- Root cause: React 18 Strict Mode runs effects twice in development
- Both effect runs tried to create the same Progress record simultaneously
- Unique constraint on (user_id, lesson_id) caused second create to fail with database error
- Solution: Added cleanup functions to useEffect hooks with `cancelled` flag
- Prevents state updates after component unmount/re-run
- Applied to: Lesson.jsx, Learn.jsx, Profile.jsx
- All async useEffect hooks now properly handle cancellation

## Static Build (GitHub Pages Deployment)

The application has been converted to a static frontend-only build for GitHub Pages deployment, removing all backend/database dependencies.

### Architecture Changes
**Previous**: Full-stack with Express backend + PostgreSQL database
**Current**: Static React app with localStorage persistence

- Removed backend dependency - no Express server or database needed
- All lesson/exercise/achievement data stored in static JSON files
- User progress persists in browser localStorage
- Business logic (XP, streaks, achievements) runs client-side

### localStorage Schema
Three keys used for data persistence:

**`asl_user`** - User statistics:
```json
{
  "total_xp": 150,
  "current_level": 2,
  "current_streak": 3,
  "longest_streak": 5,
  "last_practice_date": "2026-01-29T00:00:00.000Z"
}
```

**`asl_progress`** - Lesson completion tracking:
```json
{
  "lesson-1": {
    "status": "completed",
    "completion_percentage": 100,
    "attempts": 2,
    "completed_at": "2026-01-29T10:30:00Z",
    "last_attempted": "2026-01-29T10:30:00Z"
  }
}
```

**`asl_achievements`** - Earned achievements:
```json
{
  "achievement-1": {
    "earned_at": "2026-01-29T10:30:00Z"
  }
}
```

### Data Files
Static data files located in `/frontend/src/data/` (as JavaScript modules for better compatibility):
- **lessons.js** - 10 lessons with categories and XP requirements
- **exercises.js** - 55 exercises linked to lessons by lesson_id
- **achievements.js** - 7 achievement definitions
- **constants.js** - XP values (10/7/5 for attempts) and level thresholds (1-15)

Generated from backend seed data using: `node backend/scripts/exportFromSeeds.js`

**Note**: Originally exported as JSON files but converted to JS modules to avoid JSON parsing issues in production builds.

### Frontend Services
Migrated backend business logic to frontend services in `/frontend/src/services/`:

**dataService.js** - Core data layer, replaces all API endpoints:
- getUserData(), getProgressData(), getEarnedAchievements()
- getAllLessons(), getLessonById(), getLessonExercises()
- startLesson(), submitExercise(), completeLesson()
- getAllAchievements(), getUserAchievements()
- Reads from JSON files + localStorage, writes to localStorage

**xpService.js** - XP and level management (ported from backend):
- calculateLevel(totalXp) - Determines level from LEVEL_THRESHOLDS
- addXp(userData, xpAmount) - Awards XP and updates level
- getXpForNextLevel(currentXp) - Calculates XP needed for next level

**streakService.js** - Daily streak tracking (ported from backend):
- updateStreak(userData) - Updates streak based on last_practice_date
- Awards 20 XP bonus when streak increments
- Resets to 1 if gap > 1 day

**achievementService.js** - Achievement checking (ported from backend):
- checkAndAwardAchievements() - Returns newly earned achievements
- Checks 4 requirement types: total_xp, streak_days, lessons_completed, category_complete

### Modified Files
**ProgressContext.jsx** - Replaced all `api.get/post/put` calls with `dataService` equivalents
**Profile.jsx** - Updated achievement loading to use `dataService.getUserAchievements()`
**xpCalculator.js** - Now imports LEVEL_THRESHOLDS from constants.json
**App.jsx** - Added `basename="/ASLDuolingo"` to BrowserRouter for GitHub Pages routing
**index.html** - Added redirect handling script for SPA routing on GitHub Pages
**public/404.html** - Created to handle direct navigation and page refreshes

### Build Configuration
**vite.config.js** settings:
```javascript
{
  base: '/ASLDuolingo/',  // GitHub repo name
  build: {
    outDir: '../docs',     // Build to /docs folder
    emptyOutDir: true
  }
}
```

### Building for Production
```bash
cd frontend
npm install
npm run build
```
Output: `/docs` directory at repo root (260KB bundle + assets)

### GitHub Pages Deployment
1. Build the app: `npm run build` in `/frontend`
2. Commit `/docs` folder to repository
3. GitHub Settings → Pages → Source: Deploy from branch
4. Branch: main, Folder: /docs
5. App available at: `https://[username].github.io/ASLDuolingo/`

**Important**: Ensure `base` in vite.config.js matches repo name exactly (case-sensitive)

### GitHub Pages Routing Fix
Since GitHub Pages doesn't natively support client-side routing, the following solution is implemented:

1. **BrowserRouter basename**: Set to `/ASLDuolingo` to match the deployment path
2. **404.html**: Captures 404 errors and redirects to index.html, storing the original URL in sessionStorage
3. **index.html script**: Reads sessionStorage and uses `history.replaceState` to restore the correct URL

This allows:
- Direct navigation to any route (e.g., `/ASLDuolingo/lesson/1`)
- Page refreshes without 404 errors
- Browser back/forward buttons to work correctly

### Clearing Progress
No UI reset button. Users can manually clear localStorage:
- Open browser DevTools → Console
- Run: `localStorage.clear()`
- Or individually: `localStorage.removeItem('asl_user')`

### Backend Folder
The `/backend` directory remains in the repository for reference but is not used in production. It contains:
- Original database schema and models
- Seed scripts with lesson/exercise generation logic
- Business logic services that were ported to frontend
- Data export scripts used for migration

### Trade-offs
**Benefits**:
- Zero-cost hosting on GitHub Pages
- No backend maintenance or database management
- Faster load times (no API calls)
- Works offline after initial load

**Limitations**:
- Progress tied to single browser (cleared if user clears browser data)
- No cross-device synchronization
- No multi-user support
- No analytics or usage tracking

### Asset Path Fix for GitHub Pages
Fixed 404 errors for SVG images when deployed to GitHub Pages:
- Created `src/utils/assetPath.js` utility with `getAssetPath()` function
- Function prepends `import.meta.env.BASE_URL` to asset paths
- Automatically handles development (BASE_URL = '/') and production (BASE_URL = '/ASLDuolingo/')
- Updated all exercise components (MultipleChoice, SignRecognition, Matching) to use `getAssetPath()` for image URLs
- Image paths in data files remain as `/assets/asl/...` - utility adds correct base path at runtime
