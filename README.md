# Throu

## Decentralizing Real Estate Investment

**Throu** aims to revolutionize the real estate market by providing easy, fast, and secure access to all the benefits of real estate investment. Using Web 3.0 technologies, we break traditional barriers and create exclusive projects with affordable investments.

Our goal is to offer an innovative and reliable experience that invites users to dive into a universe of infinite possibilities.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Overview

Throu is a platform designed to decentralize real estate investment, using blockchain technology to ensure transparency, security, and accessibility. Through our solution, we democratize access to exclusive real estate projects, enabling investments from anywhere in the world.

## Features

- Access to exclusive real estate projects.
- Affordable investments powered by Web 3.0 technology.
- Transparency and security through blockchain.
- Immersive and futuristic experience via innovative systems.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- Clerk Publishable Key and Clerk Secret Key ([Clerk](https://clerk.com/))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Kayeddy/throu-v2-web.git
   ```

2. Navigate to the project directory:

   ```bash
   cd throu-v2-web
   ```

3. Install dependencies:

   ```bash
   npm install
   ```
4. Update .env.local file with Clerk keys (comments indicate which part of the file to modify)

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and go to:

   ```
   http://localhost:3000
   ```

   By default, the application runs on port 3000. If that port is in use, you will be prompted to change it.

## Project Structure

```
├── src/               # Source files
│   ├── actions/       # API actions and handlers
│   │   └── project.action.ts
│   ├── app/           # Application-level configuration and assets
│   │   ├── [locale]/  # Localization files
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/    # Reusable UI components
│   │   ├── dashboard/ # Dashboard-specific components
│   │   ├── home/      # Home page components
│   │   ├── marketplace/ # Marketplace-specific components
│   │   ├── modals/    # Modal components
│   │   ├── shared/    # Shared components across the app
│   │   └── ui/        # UI-specific components
│   ├── i18n/          # Internationalization utilities
│   ├── lib/           # Utility libraries
│   │   ├── utils.ts
│   │   └── wagmi.ts
│   ├── sections/      # Organized sections for pages
│   │   ├── dashboard/ # Dashboard-specific sections
│   │   ├── home/      # Home-specific sections
│   │   └── marketplace/ # Marketplace-specific sections
│   ├── stores/        # State management
│   │   └── useLoadingStore.ts
│   ├── utils/         # Additional utilities
│   │   ├── abis/      # ABI files for blockchain integration
│   │   ├── helpers/   # Helper functions
│   │   ├── hooks/     # Custom React hooks
│   │   ├── styles/    # Shared styles
│   │   ├── types/     # TypeScript types
│   │   └── constants.ts # Global constants
├── public/            # Static assets (images, icons, etc.)
├── .env.local         # Environment variables
├── .gitignore         # Git ignore file
├── middleware.ts      # Middleware configuration
├── next-env.d.ts      # TypeScript environment definitions for Next.js
├── next.config.mjs    # Next.js configuration file
├── package.json       # npm configuration and dependencies
├── package-lock.json  # Exact versions of npm dependencies
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Technologies Used

Throu leverages a wide range of technologies and libraries to deliver a seamless and innovative experience. Here's an organized breakdown:

### Core Frameworks and Libraries

- **[Next.js](https://nextjs.org/):** React-based framework for server-side rendering and static site generation.
- **[React](https://reactjs.org/):** Frontend library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/):** Type-safe development environment.

### Blockchain and Web3

- **[Wagmi](https://wagmi.sh/):** Simplifies Web3 React hooks.
- **[Viem](https://viem.sh/):** Blockchain interaction for Ethereum-compatible environments.
- **[Ethers.js](https://docs.ethers.io/):** Ethereum interaction library for managing wallets and contracts.
- **[RainbowKit](https://www.rainbowkit.com/):** Wallet connection and management.

### UI and Styling

- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid UI development.
- **[NextUI](https://nextui.org/):** Pre-built custom components for React.
- **[Framer Motion](https://www.framer.com/motion/):** Animation library for React.
- **[React Slick](https://react-slick.neostack.com/):** Carousel/slider animations.
- **[Next Themes](https://github.com/pacocoursey/next-themes):** Theme management for dark/light mode support.

### Internationalization and Localization

- **[Next Intl](https://next-intl.vercel.app/):** Internationalization for Next.js projects.
- **[i18n](https://www.i18next.com/):** Framework for translating and managing localized content.

### State Management and Utilities

- **[Zustand](https://zustand-demo.pmnd.rs/):** Lightweight state management library.
- **[Clsx](https://github.com/lukeed/clsx):** Utility for conditionally applying class names.

### Authentication

- **[Clerk](https://clerk.dev/):** User authentication and management.
- **Clerk Components:** Custom authentication flow with pre-built components.

### Design and Prototyping

- **[Figma](https://figma.com/):** Design tool for pre-development visual organization.

## License

## License

This project is proprietary software. Unauthorized copying, modification, or distribution of the software is strictly prohibited. All rights reserved.

---

For inquiries or issues, feel free to contact us at (+57) 300 2087124 via WhatsApp or voice call.
