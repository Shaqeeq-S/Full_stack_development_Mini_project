# BloodConnect

## Overview
BloodConnect is a full‑stack web application that connects blood donors with patients in need. Users can:
- **Create** blood requests (hospital, location, units needed, priority, etc.).
- **View** and **manage** their own requests.
- **Donate** by responding to open requests.
- **Edit** their personal profile (name, email, phone).
- Receive real‑time **toast notifications** for success, error and informational messages.

The project is built with a **React** frontend (Vite, Tailwind CSS) and a **Node/Express** backend (MongoDB). Authentication is handled via JWT and a context provider.

---

## Technology Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React‑Router, Lucide‑React | Modern, fast dev server, utility‑first styling, icon library |
| **State Management** | React Context (`AuthContext`, `NotificationContext`) | Simple global state without Redux |
| **Notifications** | Custom `NotificationContext` rendering toast container | Provides `notifySuccess`, `notifyError`, `notifyInfo` helpers used throughout the UI |
| **Backend** | Node.js, Express, MongoDB, Mongoose | Popular stack for REST APIs |
| **Auth** | JWT stored in HttpOnly cookie | Secure stateless authentication |
| **Testing** | React Testing Library (optional) | Component unit tests |
| **Package Manager** | npm (v10) | Standard for JavaScript projects |

---

## Project Structure
```
BloodConnect/                     # Root folder
├─ backend/                      # Express API (not shown here)
│   ├─ src/
│   └─ package.json
├─ frontend/                     # Vite React app
│   ├─ src/
│   │   ├─ assets/               # Images, icons
│   │   ├─ components/           # Re‑usable UI components
│   │   │   ├─ layout/            # DashboardLayout, Navbar, etc.
│   │   │   └─ RequestCard.jsx
│   │   ├─ context/              # AuthContext, NotificationContext
│   │   ├─ pages/                # Route pages (Home, Login, Profile, MyRequests, ...)
│   │   ├─ services/             # API wrappers (requestService, authService)
│   │   ├─ utils/                # Helper functions (date formatting, badge classes)
│   │   ├─ App.jsx                # Route definitions
│   │   ├─ main.jsx               # Root render with providers
│   │   └─ index.css              # Tailwind entry point
│   ├─ public/                    # Static assets
│   ├─ vite.config.ts             # Vite configuration
│   └─ package.json               # Frontend dependencies
├─ .gitignore
└─ README.md                     # This file
```

---

## Core Features
| Feature | Description | Key Files |
|---------|-------------|-----------|
| **User Authentication** | Sign‑up, login, JWT verification, protected routes. | `src/context/AuthContext.jsx`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/App.jsx` |
| **Profile Management** | View and edit user name, email, phone; updates persisted via API. | `src/pages/Profile.jsx`, `src/services/api.js` |
| **Create Blood Request** | Form to submit a new request with hospital, location, blood group, priority, notes. | `src/pages/CreateRequest.jsx`, `src/components/RequestForm.jsx` |
| **My Requests Dashboard** | List, filter (All / Pending / Accepted / Fulfilled / Cancelled), view details, cancel, mark fulfilled. | `src/pages/MyRequests.jsx`, `src/components/RequestCard.jsx` |
| **Donor Response Management** | Volunteers can accept/reject a request; request owner sees donor info. | `src/pages/MyRequests.jsx` (modal section) |
| **Global Notification System** | Toasts for success, error, info; invoked via `useNotification`. | `src/context/NotificationContext.jsx`, `src/main.jsx` |
| **Responsive UI** | Tailwind‑CSS based layout works on mobile, tablet, desktop. | All component JSX files |
| **Routing** | Public routes (`/login`, `/register`), protected routes (`/profile`, `/my-requests`, `/create-request`). | `src/App.jsx`, `src/components/ProtectedRoute.jsx` |
| **API Service Layer** | Centralised wrapper around fetch/axios for consistent error handling. | `src/services/api.js` |
| **Utility Helpers** | Date formatting, badge class helpers for priority/status colors. | `src/utils/compatibility.js` |

---

## How It Works – End‑to‑End Flow
1. **User visits the app** – `main.jsx` mounts the React tree inside `<NotificationProvider>` → `<AuthProvider>` → `<BrowserRouter>`.
2. **Authentication** – On load, `AuthProvider` reads the JWT cookie, validates it against `/api/auth/me`, and populates `user` state. Protected routes check this state and redirect to `/login` if missing.
3. **Navigation** – `App.jsx` defines routes using `react-router-dom`. `ProtectedRoute` wraps pages that require a logged‑in user.
4. **Creating a Request** – The user fills the form on `/create-request`. On submit, `requestService.createRequest` posts to `POST /api/requests`. On success, `notifySuccess` shows a toast and the user is redirected to `/my-requests`.
5. **Viewing & Managing Requests** – `MyRequests.jsx` fetches the user's requests via `requestService.getAllRequests({ myRequests: true })`. The UI provides filter buttons, a grid of `RequestCard` components, and a modal for request details.
6. **Donor Interaction** – Other logged‑in users can view open requests (outside the scope of this repo) and respond. Responses appear in the request detail modal.
7. **Profile Editing** – `Profile.jsx` loads the current user profile, allows editing, and calls `requestService.updateProfile`. Toasts communicate outcome.
8. **Notifications** – Any async operation calls `notifySuccess` or `notifyError`. The `NotificationContext` holds a queue; a `<ToastContainer>` component renders each toast, which auto‑dismisses after a few seconds.
9. **Backend** – The Express server provides REST endpoints (`/api/auth/*`, `/api/users/*`, `/api/requests/*`). Mongoose models define `User`, `Request`, `DonorResponse` schemas.
10. **Deployment** – Frontend `npm run build` outputs a static bundle in `dist/`. The backend can serve this bundle with `express.static` or deploy to platforms like Vercel/Netlify with serverless functions for the API.

---

## Detailed Component Overview
### Layout Components
- **DashboardLayout** – Provides a consistent sidebar, header, and content area for authenticated pages.
- **Navbar** – Top navigation with logo, profile avatar, and logout button.
- **Sidebar** – Links to Dashboard, My Requests, Profile, etc.

### Page Components
- **Login.jsx / Register.jsx** – Forms with validation, error handling, and `notifyError` on failure.
- **Profile.jsx** – Controlled form using `useState`; on submit calls `updateProfile` and shows toasts.
- **CreateRequest.jsx** – Uses `RequestForm` component; includes priority selector, date picker, etc.
- **MyRequests.jsx** – Central hub for request management; includes filters, modal details, and action buttons (Cancel, Mark Fulfilled).

### Service Layer (`src/services/api.js`)
```js
export const requestService = {
  getAllRequests: (params) => fetchJson('/api/requests', { params }),
  createRequest: (data) => postJson('/api/requests', data),
  cancelRequest: (id) => postJson(`/api/requests/${id}/cancel`),
  updateStatus: (id, status) => postJson(`/api/requests/${id}/status`, { status }),
  updateProfile: (data) => putJson('/api/users/profile', data),
};
```
All functions return `{ success: boolean, data?: any, message?: string }` which the UI consumes.

### Notification Context (`src/context/NotificationContext.jsx`)
```tsx
const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  const notifySuccess = (msg) => addToast('success', msg);
  const notifyError = (msg) => addToast('error', msg);
  const notifyInfo = (msg) => addToast('info', msg);
  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyInfo }}>
      {children}
      <ToastContainer toasts={toasts} />
    </NotificationContext.Provider>
  );
};
```
The UI components simply import `useNotification`.

---

## Data Models (Backend – Overview)
- **User**: `{ _id, name, email, phone, passwordHash, role, createdAt }`
- **Request**: `{ _id, patientName, bloodGroup, hospitalName, city, state, unitsRequired, priority, status, additionalNotes, donorResponses[], createdBy, createdAt }`
- **DonorResponse**: `{ donorUserId (ref User), response ('Accepted'|'Rejected'), message, respondedAt }`

These models are stored in MongoDB via Mongoose schemas.

---

## Development Workflow
1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd BloodConnectApp/BloodConnect/frontend
   ```
2. **Install dependencies** (`npm install`).
3. **Start backend** (assumed running on `localhost:5000`).
4. **Run dev server** (`npm run dev`).
5. **Hot‑module reloading** – changes to JSX/TSX or Tailwind classes refresh automatically.
6. **Testing** – `npm test` runs React Testing Library suites (if present).
7. **Linting/Formatting** – `npm run lint` and `npm run format` use ESLint & Prettier.

---

## Building & Deployment
```bash
# Production bundle
npm run build   # outputs to ./dist
# Serve with a static server (example)
npx serve -s dist
```
For cloud deployment:
- **Vercel** – link the repo, set `outputDirectory` to `frontend/dist`.
- **Netlify** – configure build command `npm run build` and publish directory `frontend/dist`.
- **Docker** – optional Dockerfile can copy the `dist` folder into an Nginx image.

---

## Presentation Slides – Suggested Outline
1. **Title & Problem Statement** – Why blood donation coordination matters.
2. **Solution Overview** – What BloodConnect does.
3. **Architecture Diagram** – Frontend ↔ Backend ↔ Database.
4. **Key Features** – List with screenshots (Login, Profile, Create Request, My Requests, Notifications).
5. **Technical Stack** – Highlight React, Vite, Tailwind, Node/Express, MongoDB, JWT.
6. **Component Breakdown** – Show DashboardLayout, NotificationContext, AuthContext.
7. **Data Flow** – Example of creating a request → API → DB → toast.
8. **Demo** – Live walkthrough (or recorded GIFs).
9. **Future Enhancements** – Real‑time WebSocket updates, admin panel, analytics.
10. **Q&A**.

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Follow the existing coding style (Prettier, ESLint).
4. Submit a Pull Request with a clear description of changes.

---

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.
