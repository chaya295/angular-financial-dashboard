# Enterprise Financial Dashboard

A large-scale Angular enterprise application simulating a financial management system.

## Tech Stack
- Angular 17+ (Standalone Components)
- TypeScript (strict mode)
- Angular Material
- RxJS
- Angular Signals
- Lazy Loading & Guards
- RESTful API integration

## Features
- 🔐 Authentication with Auth Guard
- 📊 Dashboard with live data charts
- 📋 Transaction management table
- 👥 User management (CRUD)
- 🌙 Dark / Light theme toggle
- 📱 Fully responsive

## Getting Started
```bash
npm install
ng serve
```

## Architecture
```
src/
├── app/
│   ├── core/          # Guards, interceptors, services
│   ├── shared/        # Reusable components, pipes, models
│   └── features/      # Lazy-loaded feature modules
│       ├── auth/
│       ├── dashboard/
│       ├── transactions/
│       └── users/
```
