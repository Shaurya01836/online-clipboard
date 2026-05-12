# 🌐 Online Clipboard

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Shaurya01836/online-clipboard?style=social)
![GitHub forks](https://img.shields.io/github/forks/Shaurya01836/online-clipboard?style=social)
![GitHub issues](https://img.shields.io/github/issues/Shaurya01836/online-clipboard)
![License](https://img.shields.io/github/license/Shaurya01836/online-clipboard)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A modern web app to store, access, and share clipboard text across all your devices.**

[Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#️-tech-stack) • [Setup](#-installation--setup) • [Contributing](#-contributing) • [Roadmap](#-roadmap)

</div>

---

## 🧭 What is Online Clipboard?

Online Clipboard lets you copy text on one device and instantly access it on another — no sign-in required to get started. Just create a clip, get a short shareable code, and paste it anywhere.

Think of it as a lightweight, cross-device clipboard that lives in the cloud.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔗 Short Codes | Save clips and retrieve them with simple shareable codes |
| 🔒 Public & Private | Choose who can see your clips |
| 📱 Cross-Device | Access your clips from any browser, any device |
| 🧠 Offline Sync | Clips saved offline sync automatically when you reconnect |
| 📜 History | Browse your personal clip history and community clips |
| ✏️ Edit & Delete | Full control over your saved clips |
| ⚡ Health Check | Backend health monitoring for smooth startup |
| 💀 Skeleton Loaders | Smooth loading states for a polished UX |

---

## 📸 Screenshots

### 🏠 Home Page
<img src="https://raw.githubusercontent.com/niyatisharma100307-crypto/New-online-clipboard/main/assets/home.png.png" alt="Home Page" width="100%"/>

### 🔄 Offline Sync
<img src="https://raw.githubusercontent.com/niyatisharma100307-crypto/New-online-clipboard/main/assets/offline-sync.png.png" alt="Offline Sync" width="100%"/>

### 🌍 Community Clips
<img src="https://raw.githubusercontent.com/niyatisharma100307-crypto/New-online-clipboard/main/assets/community.png.png" alt="Community Clips" width="100%"/>

---

## 📊 Flows

### App Workflow
<img src="https://raw.githubusercontent.com/niyatisharma100307-crypto/New-online-clipboard/main/assets/workflow.svg" alt="App Workflow" width="100%"/>

### User Flow
<img src="https://raw.githubusercontent.com/niyatisharma100307-crypto/New-online-clipboard/main/assets/user-flow.svg" alt="User Flow" width="100%"/>

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React + Vite
- 🛣️ React Router
- 🎞️ Framer Motion
- 🎨 Tailwind CSS

**Backend**
- ☕ Java 21
- 🍃 Spring Boot
- 🔐 Spring Security
- 🗄️ Spring Data JPA

**Database & Services**
- 🐘 PostgreSQL
- ⚡ Redis (caching & offline sync)
- ☁️ Cloudinary (asset handling)

**Tooling**
- 🔧 Maven
- 🧹 ESLint

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, make sure you have:

- **Node.js** v18+ and **npm** installed → [Download](https://nodejs.org/)
- **Java 21** installed → [Download](https://adoptium.net/)
- **PostgreSQL** running locally
- **Redis** running locally
- A free **Cloudinary** account → [Sign up](https://cloudinary.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shaurya01836/online-clipboard.git
cd online-clipboard
```

---

### 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd online-clipboard-backend
```

Set the following environment variables:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/online_clipboard
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> 💡 **Tip:** Never commit real secrets. Add `.env` to your `.gitignore`.

Start the backend:

```bash
# Linux / macOS
./mvnw clean install
./mvnw spring-boot:run

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

The backend starts at **http://localhost:8080** by default.

---

### 3️⃣ Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd online-clipboard-frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173** by default (Vite).

---

### 4️⃣ Connect Frontend to Backend

Create a `.env` file inside `online-clipboard-frontend/`:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## ▶️ Quick Usage Guide

1. Start the **backend** server
2. Start the **frontend** dev server
3. Open your browser at `http://localhost:5173`
4. Type or paste text → click **Create Clip**
5. Copy the short code → open on any device → enter code → get your clip ✅

---

## 📁 Project Structure

```
online-clipboard/
├── online-clipboard-backend/     # Spring Boot API
│   ├── src/
│   └── pom.xml
├── online-clipboard-frontend/    # React + Vite app
│   ├── src/
│   ├── public/
│   └── package.json
├── assets/
│   ├── home.png.png
│   ├── offline-sync.png.png
│   ├── community.png.png
│   ├── workflow.svg
│   └── user-flow.svg
└── README.md
```

---

## 🤝 Contributing

Contributions of all levels are welcome! Whether it's fixing a typo or adding a new feature, every bit helps.

### 🟢 Good First Issues

- 🎨 UI improvements
- 🐛 Small bug fixes
- 📄 Documentation updates
- 🧪 Adding test cases

### 🛠️ How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or: fix/bug-name | docs/update-name
   ```
4. **Make your changes** — keep them small and focused
5. **Test locally**
6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add dark mode toggle"
   ```
7. **Push** and open a Pull Request

For full contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🤝 Contributors

Thanks to these amazing people:

<a href="https://github.com/Shaurya01836/online-clipboard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Shaurya01836/online-clipboard" />
</a>

---

## 📌 Roadmap

- [ ] 🔄 Real-time sync across devices (WebSockets)
- [ ] 🔐 Authentication system (JWT / OAuth)
- [ ] 🛡️ End-to-end encryption for private clips
- [ ] 📡 Improved offline-first support
- [ ] 🚀 CI/CD pipeline & deployment automation
- [ ] 📋 Clip expiration / auto-delete settings

---

## 🐛 Reporting Issues

Found a bug or have an idea? [Open an issue](https://github.com/Shaurya01836/online-clipboard/issues) and include:

- ✅ Steps to reproduce the bug
- ✅ What you expected to happen
- ✅ What actually happened
- ✅ Screenshots or error logs (if available)
- ✅ Whether it's a **frontend** or **backend** issue

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Shaurya01836">Shaurya</a> and contributors
</div>
