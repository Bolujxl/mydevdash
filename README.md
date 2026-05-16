# myDen

**The high-performance command center for your digital life.**

`myDen` is a personal developer dashboard built for focus and aesthetic pleasure. It aggregates your GitHub activity, task lists, and local environment data into a single, high-fidelity "Bento Box" interface. No clutter, no distractions—just your data, beautifully rendered.

![myDen Preview](https://github.com/Bolujxl/mydevdash/raw/main/preview.png) *(Placeholder for your actual preview image)*

---

## ⚡ Core Modules

### 🏛️ The Bento Dashboard
The heart of your Den. A responsive grid that gives you an instant snapshot of who you are and what you're building today.
- **Interactive Hero:** A terminal-style profile card with a built-in profile switcher.
- **Real-time Stats:** Automatic tracking of stars, repo counts, and language diversity.
- **Activity Feed:** A live stream of your recent GitHub events.
- **Live Weather:** Minimalist weather tracking via `wttr.in`, persisted to your local city.

### 📈 Commit Pulse
A professional-grade activity heatmap inspired by GitHub's profile page, but tuned for your dashboard.
- **Variable Ranges:** Toggle between 30 days, 3 months, 6 months, or a full year of activity.
- **Data Intensity:** Visualizes your "grind" with color-coded intensity buckets.
- **Deep Dive:** Hover any day to see exact commit counts and dates.

### 📝 Task Management
A zero-friction todo list designed to keep you moving.
- **Persistence:** Everything is saved to `localStorage`—your list is always there when you return.
- **Filterable:** Quickly toggle between All, Active, and Completed tasks.
- **Progress Tracking:** Real-time progress bar to visualize your daily "done" rate.

---

## 🎨 Design Philosophy

`myDen` isn't just a tool; it's a workspace.
- **Premium Aesthetics:** Built with a "Bento-grid" layout, vibrant HSL color palettes, and glassmorphism.
- **Silk Background:** Features a high-performance, low-opacity animated Three.js background for a subtle, living feel.
- **Pure CSS:** No bulky frameworks like Tailwind or Bootstrap. Just 100% hand-crafted, modular CSS for maximum performance and flexibility.
- **Adaptive UI:** A fully responsive system that shifts from a fixed desktop sidebar to a sleek mobile drawer.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Visuals:** [Three.js](https://threejs.org/) (via @react-three/fiber), [Lucide React](https://lucide.dev/)
- **API Layers:** GitHub REST API, wttr.in
- **Styling:** Vanilla CSS (CSS Variables + Flex/Grid)

---

## 🧠 How it Works

The app is driven by a custom-built hook architecture that prioritizes efficiency:
- **`useFetch`**: A robust data hook with `AbortController` cleanup and automatic GitHub token integration.
- **`useTheme`**: A centralized context that manages the switch between Dark and Light modes.
- **Localized State**: We use `localStorage` for everything you'd want to persist without a database (Tasks, City preference, GitHub handle, and Theme).

---

## 🚀 Getting Started

1. **Clone the den:**
   ```bash
   git clone https://github.com/Bolujxl/mydevdash.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set your handle:**
   Open the dashboard and use the profile switcher to load your own GitHub data.
4. **Live Development:**
   ```bash
   npm run dev
   ```

---

*Built by a developer, for developers. Welcome to your Den.*