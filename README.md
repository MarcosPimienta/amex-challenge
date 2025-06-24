# 🚀 Challenge Project

## 📝 Project Description
This project is a full-stack web application designed to demonstrate a mock server setup using Fastify and React. It includes server-side and client-side builds using **esbuild** to bundle and minify the code for production.

## 🌟 Features
- **SSR** (Server-Side Rendering) for faster initial load
- **Caching** for API data to reduce redundant requests
- **Preloading** of data on the server side
- **Error Handling** and state management

## Setup

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### 🛠️ Installation
Clone the repository and install dependencies:

```bash
cd challenge
npm install
```
### Core Dependencies 📦

* react: A JavaScript library for building user interfaces.
* react-dom: The entry point for the DOM rendering of React applications.
* fastify: A fast, low-overhead web framework for Node.js.
* msw: Mock Service Worker for mocking APIs in the development environment.
* valibot: A runtime validation library for JavaScript/TypeScript.

### ▶️ Running the Project
To start the project in development mode:
```bash
npm start
```
This will:

 1. Build the server and client code.

 2. Start the server using Node.js.

### 🗂️ Project Structure
```
.
├── application/                  # React components and UI logic
│   ├── App.tsx                   # Root component
│   ├── Name.tsx                  # Displays a name (uses caching)
│   ├── Person.tsx                # Displays a person (uses caching)
│   ├── data.d.ts                 # Type definitions for the data
│   └── validation.ts             # Input validation logic
│
├── caching-fetch-library/       # Custom hook for caching fetch requests
│   └── cachingFetch.ts          # Main hook implementation + SSR support
│
├── dist/                        # Output folder for compiled assets (after build)
│   ├── client.js
│   ├── server.js
│   └── mockServiceWorker.js
│
├── framework/                   # Core logic for client and server rendering
│   ├── client/                  # Client bootstrap logic
│   │   ├── index.tsx
│   │   └── window.d.ts
│   ├── mock-server/             # MSW handlers and setup for mock API
│   │   ├── client.ts
│   │   ├── handler.ts
│   │   └── mockServiceWorker.js
│   └── server/                  # Server-side rendering and build logic
│       ├── buildHtmlDoc.ts
│       ├── index.ts
│       └── renderApp.tsx
│
├── mockServer/                  # Copy of the mockServiceWorker (used in build)
│   └── mockServiceWorker.js
│
├── .vscode/                     # VS Code settings (if any)
├── .idea/                       # JetBrains project settings (optional)
├── node_modules/                # Node.js dependencies
├── DevTask.md                   # Developer challenge/task instructions
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project metadata and scripts
├── package-lock.json            # Exact versions of dependencies
└── README.md                    # 📖 You are here
```

### 🧠 Implementation Notes

This project required implementing a caching layer and supporting functionality to enable both client-side and server-side data fetching with proper reuse across renders. Below is a summary of the key functions and their roles:

## 🔁 ```useCachingFetch(url)```:
A custom React hook that fetches data from a given URL with caching.
It returns:

* ```isLoading```: boolean indicating the fetch status
* ```data```: fetched data or null
* ```error```: fetch error if any, or null

### 🔑 Key Behavior:

* Caches the response in a shared object to prevent duplicate requests.
* If data is already cached for a URL, it returns immediately without making a network request.
* Helps ensure that only one network request is made, even if the hook is called multiple times with the same URL.

## ⏳ ```preloadCachingFetch(url)```:
A function designed to be used only on the server during SSR.

### 🚀 Purpose:

* Fetches and caches data before rendering begins.
* Ensures that when useCachingFetch runs on the client, the data is already available.
* Enables full SSR hydration with no loading states or redundant fetches.

## 💾 ```serializeCache()```:
Converts the in-memory cache object into a JSON string.

### 🖧 Used on the Server:
* Injects the serialized cache into the HTML so it can be transferred to the browser during SSR.

## 📥 ```initializeCache(serializedCache)```:
Takes the serialized JSON string from the server and rehydrates the cache on the client.

### 💻 Used on the Client:
* Makes the preloaded SSR data available to useCachingFetch on first render, preventing network requests.

## 🗑️ ```wipeCache()```:
Clears the in-memory cache.

### 🚀 Purpose:

* Helpful for tests or scenarios where a fresh fetch is required.
* Prevents stale data reuse across navigations or sessions.

## ✅ Results
With this system in place:

* Visiting /appWithoutSSRData shows data with one network request.
* Visiting /appWithSSRData shows data immediately (even with JavaScript disabled).
* Repeated use of the same data in multiple components doesn't cause repeated fetches.
