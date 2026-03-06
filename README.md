# Survey Bot Mini App

A React-based Telegram Mini App for conducting surveys and managing user data with admin functionality.

## 🚀 Features

- **Survey Management**: Display and interact with surveys
- **Admin Panel**: User management with search and pagination
- **Telegram Integration**: Built with Telegram Mini Apps SDK
- **Responsive Design**: Mobile-first design using Telegram UI components
- **Dark/Light Theme**: Automatic theme switching based on Telegram settings
- **Error Tracking**: Integrated with Sentry for monitoring
- **Modern Stack**: React 18, TypeScript, Vite, and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Telegram Apps SDK** - Telegram Mini App integration
- **Telegram UI** - Telegram-native UI components

### Tools & Libraries
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Storybook** - Component development
- **Sentry** - Error tracking and monitoring
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants
- **clsx** - Conditional class names

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **GitHub Pages** - Deployment

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (button, card, input)
│   ├── Link/           # Custom link component
│   └── EnvUnsupported.tsx
├── pages/              # Page components
│   ├── SurveyList/     # Main survey listing page
│   ├── AdminPage/      # Admin user management
│   └── Page.tsx        # Base page wrapper
├── navigation/         # Routing configuration
├── lib/               # Utility functions
├── App.tsx            # Main app component
├── env.ts             # Environment configuration
└── init.ts            # App initialization
```

## 🚦 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm (required for this project)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd survey-bot-ma
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `https://localhost:5173`

### Environment Configuration

Set runtime environment variables for container startup:

```bash
API_URL=https://your-backend-api-url
SENTRY_DSN=https://your-sentry-dsn
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run storybook` - Start Storybook
- `npm run deploy` - Deploy to GitHub Pages

## Create Bot and Mini App

Before you start, make sure you have already created a Telegram Bot. Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
on how to do it.

## Run

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development
process.

To run the application in the development mode, use the `dev` script:

```bash
npm run dev
```

After this, you will see a similar message in your terminal:

```bash
VITE v5.2.12  ready in 237 ms

➜  Local:   https://localhost:5173/
➜  Network: https://172.18.16.1:5173/
➜  press h + enter to show help
```

Here, you can see the `Local` link, available locally, and `Network` links
accessible to all devices in the same network with the current device.

It is important to note that some libraries in this template, such as
`@telegram-apps/sdk`, are not intended for use outside of Telegram.

Nevertheless, they appear to function properly. This is because the
`src/mockEnv.ts` file, which is imported in the application's entry point (
`src/index.ts`), employs the `mockTelegramEnv` function to simulate the Telegram
environment. This trick convinces the application that it is running in a
Telegram-based environment. Therefore, be cautious not to use this function in
production mode unless you fully understand its implications.

> [!WARNING]
> Because we are using self-signed SSL certificates, the Android and iOS
> Telegram applications will not be able to display the application. These
> operating systems enforce stricter security measures, preventing the Mini App
> from loading. To address this issue, refer to
> [this guide](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t survey-bot-ma .
```

### Run Container

```bash
docker run -p 3000:3000 survey-bot-ma
```

## ☸️ Kubernetes Deployment

Deploy using the provided Kubernetes manifests:

```bash
kubectl apply -f kubernetes/app.yaml
kubectl apply -f kubernetes/service.yaml
```

## 🔌 API Integration

The app integrates with a backend API for:

- Fetching surveys: `GET /api/surveys`
- Admin user management: `GET /api/admin/users`

Authentication is handled via Telegram Mini App `initDataRaw`.

## 🎨 UI Components

The app uses a combination of:

- **Telegram UI** components for native Telegram look and feel
- **Custom UI components** built with Tailwind CSS and CVA
- **Responsive design** optimized for mobile devices

## 📱 Telegram Mini App Features

- **Platform Detection**: Adapts UI based on iOS/Android
- **Theme Integration**: Respects Telegram's dark/light theme
- **Safe Area Handling**: Proper viewport adjustments
- **Launch Parameters**: Integrates with Telegram's launch context

## 🔧 Development

### Component Development

Use Storybook for isolated component development:

```bash
npm run storybook
```

### Code Quality

- ESLint configuration for TypeScript and React
- Automatic code formatting
- Type checking with TypeScript

### Error Monitoring

Sentry is integrated for error tracking. Configure your Sentry DSN in the initialization files.

## 🌐 Pages

### Survey List (`/`)
- Displays available surveys
- Handles user authentication via Telegram
- Admin button for privileged users

### Admin Page (`/admin-page`)
- User management interface
- Search functionality
- Pagination for large user lists
- Real-time user data display

## 📄 License

This project is private and proprietary.

## 🔗 Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@telegram-apps/sdk-react documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react)
- [Telegram developers community chat](https://t.me/devs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
