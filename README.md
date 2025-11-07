# Grocery List Frontend

A React + Vite + TypeScript application for managing a family grocery list.  
Users can create, edit, delete, and mark grocery items as purchased.

---

## Features

- Add, edit, delete grocery items
- Mark items as purchased
- Responsive UI (desktop + mobile)
- Error handling for duplicate items
- State management with React Query
- ESLint + Prettier + TypeScript strict mode

---

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Query](https://tanstack.com/query/latest)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/) for testing

---

## Setup

### Local development

```bash
git clone https://github.com/nageshkatna/grocery-list-frontend.git
cd grocery-list-frontend
npm install
npm run dev
```

### Environment File

- Create a `.env` file and add

```bash
VITE_API_URL=http://localhost:8000
```

### Docker

- Use docker to run the containers

```bash
cd docker
docker-compose up -d
```

### Testing

- Run tests using

```bash
npm run test
```

## Frontend Image

<p align="center"><img src='/src/assets/grocery-frontend.png' alt='Grocery List Frontend Image' /></p>
