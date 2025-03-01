# Contact List Frontend

A modern, responsive web application for managing contacts, built with React and TypeScript. This application provides a clean and intuitive interface for managing contacts with comprehensive CRUD operations and real-time search capabilities.

## Features

- View list of contacts with infinite scroll pagination
- Real-time search contacts by name, phone number and bio
- Create new contacts with avatar upload support
- Edit existing contact information
- Delete contacts with confirmation
- Responsive design optimized for mobile and desktop
- Form validation and error handling

## Technology Stack

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: PrimeReact v10.9
- **File Upload**: React-Dropzone

### Styling
- SCSS for custom styles
- PrimeFlex v4.0 for layout utilities
- CSS Modules for component-scoped styles
- PrimeIcons v7.0 for iconography

### Development & Build Tools
- **Build Tool**: Vite v5.4
- **Package Manager**: pnpm
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint v9.9
- **Type Checking**: TypeScript v5.5
- **Containerization**: Docker

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable React components
├── pages/           # Page components
├── services/        # API service layer
├── styles/          # Global styles and SCSS modules
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── context/         # React Context providers
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js v18+ (for local development)
- pnpm v8+ (recommended)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd contact-list-frontend
```

2. Build and run using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:4000`

### Local Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Build for production:
```bash
pnpm build
```

4. Preview production build:
```bash
pnpm preview
```

## Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## Docker Configuration

The application uses Docker Compose for easy development and deployment.

### Using Docker Compose (Recommended)

1. Start all services:
```bash
docker-compose up
```
