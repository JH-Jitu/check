# Project Management Dashboard

This is a project management dashboard application built with Next.js, React, Zustand, React Query, Ant Design, and Tailwind CSS. The application allows users to manage tasks, projects, and team members.

## Features

- Authentication Page: Login form with validation using Ant Design.
- Projects Overview Page: List of projects with options to view, edit, or delete. Data is fetched using React Query from a mock API.
- Project Details Page: Detailed information about a project, including tasks, team members, and recent activities. Users can add new tasks and assign team members.
- Task Management: Tasks can be added, edited, or marked as completed. Each task has a detailed view with descriptions, deadlines, and assigned members.
- Drag-and-Drop: Tasks can be dragged and dropped to change their status (e.g., To Do, In Progress, Done) using the `@dnd-kit` library. State is managed using Zustand.
- Task Filters and Search: Users can filter tasks by status, due date, or assignee, and search for tasks using a search bar.
- Interactive Dashboard: Modals, dropdowns, and tooltips are implemented using Ant Design for enhanced interactivity.
- Responsive Design: The application is responsive and optimized for different screen sizes using Tailwind CSS.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JH-Jitu/dashboard-task-practice.git
```

2. Navigate to the project directory:

```bash
cd dashboard-task-practice
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows the structure:

```
src
├── app
│   ├── api
│   ├── mock-api
│   └── projects
├── components
├── mock-api
└── store
```

- `app`: Contains the Next.js application router and pages.
- `app/api`: API routes for the application.
- `app/mock-api`: Mock API files for projects, tasks, teams, and API helpers.
- `app/projects`: Components and pages related to project management.
- `components`: Reusable components used throughout the application.
- `mock-api`: Helper functions for the mock API.
- `store`: Zustand store for global state management.

## Dependencies

The project uses the following dependencies:

- `@ant-design/nextjs-registry`: Ant Design integration for Next.js.
- `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`: Libraries for implementing drag-and-drop functionality.
- `@tanstack/react-query`: Library for data fetching, state management, and cache management.
- `antd`: Ant Design UI library for React components.
- `axios`: Promise-based HTTP client for making API requests.
- `next`: Next.js framework for building React applications.
- `react`, `react-dom`: React library for building user interfaces.
- `zustand`: State management library for React applications.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you find any bugs or have improvements to suggest.
