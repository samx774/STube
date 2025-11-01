# 🎬 STube

A modern, feature-rich video sharing platform built with **Next.js 16**, featuring advanced video processing, AI-powered content generation, and a comprehensive creator studio.

---

## ✨ Key Features

### 🎥 Video Experience
- **Advanced Video Player** – Smooth playback with quality controls and adaptive streaming.  
- **Real-time Video Processing** – Powered by Mux for optimal video delivery.  
- **Multiple Content Feeds** – Discover content through personalized recommendations.  
- **Watch History Tracking** – Keep track of your viewing journey.  

### 🤖 AI-Powered Tools
- **Automatic Video Transcription** – Generate accurate transcripts automatically.  
- **AI Title & Description Generation** – Create engaging content with AI assistance.  

### 📊 Creator Studio
- **Comprehensive Analytics** – Track your content performance with detailed metrics.  
- **Content Management** – Easy-to-use interface for managing your videos.  
- **Custom Playlist Management** – Organize content into curated playlists.  

### 💬 Community Features
- **Interactive Comment System** – Engage with your audience.  
- **Like & Subscription System** – Build and grow your community.  
- **User Profiles** – Personalized user experiences.  

### 🔐 Technical Highlights
- **Authentication System** – Secure user authentication and authorization.  
- **Module-based Architecture** – Clean, maintainable codebase.  
- **Type-safe APIs** – Built with tRPC for end-to-end type safety.  
- **Responsive Design** – Optimized for all devices and screen sizes.  

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Framework** | Next.js 16 & React 19 |
| **Database** | PostgreSQL with DrizzleORM |
| **API** | tRPC for type-safe API development |
| **Styling** | TailwindCSS & ShadcnUI |
| **Video Processing** | Mux |
| **Architecture** | Modular and scalable design |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+  
- PostgreSQL database  
- Clerk account for authentication  
- Mux account for video processing  

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/samx774/STube.git
cd STube
```

**2. Install dependencies**
```bash
npm install
# or
pnpm install
# or
yarn install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```
Configure your environment variables including:
- Database connection  
- Mux API credentials  
- Authentication secrets  

**4. Run database migrations**
```bash
npx drizzle-kit-studio push
```

**5. Start the development server**
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) to view the application.

---



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository  
2. Create your feature branch  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request  

---



## 👨‍💻 Author

**Samx**  
GitHub: [@samx774](https://github.com/samx774)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)  
- Video processing by [Mux](https://mux.com)  
- UI components from [ShadcnUI](https://ui.shadcn.com)  
- Styled with [TailwindCSS](https://tailwindcss.com)  

---

⭐ **Star this repository if you find it helpful!**
