# JavaScript to TypeScript Migration: React + Node.js

This project demonstrates a staged migration from JavaScript to TypeScript for a small React frontend and Node.js/Express backend. Shared API contracts live in the `shared` workspace and are imported by both sides.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

Check versions:

```bash
node --version
npm --version
```

## Folder structure

```text
typescript-migration-project/
├── README.md
├── package.json
├── tsconfig.base.json
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       └── routes/tasks.ts
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── styles.css
│       ├── types/env.d.ts
│       └── components/TaskForm.tsx
├── scripts/
│   └── migration-demo.mjs
└── evidence/
    └── SCREENSHOTS.md
```

## 1. Install dependencies

From the root folder:

```bash
npm install
```

## 2. Run the strict TypeScript checks

```bash
npm run typecheck
```

Expected result: all three workspaces type-check successfully with strict mode enabled. The output should end with successful completion and no TypeScript errors.

## 3. Build all workspaces

```bash
npm run build
```

This builds the shared package first, then the backend and frontend. The server imports shared types and runtime validation helpers from the compiled shared package.

## 4. Run the backend

In terminal 1, from the root directory:

```bash
npm run dev:server
```

Expected message:

```text
API server listening at http://localhost:4000
```

Test the API in a browser or a second terminal:

```bash
curl http://localhost:4000/api/tasks
```

## 5. Run the React frontend

In terminal 2, from the root directory:

```bash
npm run dev:client
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The React task manager loads task data from the Node API, lets you add tasks, and toggles task completion.

The Vite dev server proxies `/api` requests to `http://localhost:4000`.

## 6. Demonstrate compiler-caught bugs

Run:

```bash
node scripts/migration-demo.mjs
```

The script creates a temporary TypeScript file containing deliberate errors, runs `tsc` against it, prints the diagnostics, and removes the temporary file. The demonstration includes:
- assigning a string to a number,
- passing a missing required property,
- using a possibly undefined value without checking.

The exact diagnostic wording can vary slightly by TypeScript version. Count the distinct errors shown in your terminal and record the actual count in the report. These are demonstration errors, not bugs discovered in the correctly typed application.

## 7. Staged migration approach

1. **Inventory JavaScript:** identify API request/response objects, shared models and high-risk functions.
2. **Add TypeScript tooling:** install TypeScript and type definitions, then create a strict base configuration.
3. **Create shared contracts:** define `Task`, `CreateTaskInput` and `ApiResponse<T>` in `shared/src/index.ts`.
4. **Migrate backend first:** convert the Express route and add runtime validation at the HTTP boundary.
5. **Migrate frontend:** type React state, component props and API responses using the shared contracts.
6. **Enable strict checks:** keep `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` enabled.
7. **Verify:** run `npm run typecheck`, `npm run build`, test the API and interact with the UI.

## Why shared types are useful

The client and server import the same contract definitions. If the task shape changes, TypeScript can identify incompatible code on either side during compilation. TypeScript types are erased at runtime, so the backend also validates incoming JSON values with ordinary runtime checks.

## Screenshots to capture for the assignment

Please capture actual outputs after running the project:

1. Terminal showing `npm run typecheck` completes successfully.
2. Terminal showing `node scripts/migration-demo.mjs` and its compiler diagnostics.
3. Browser showing the React app loaded with tasks.
4. Browser showing a newly added task or a task marked complete.
5. Optional: terminal showing the backend API response using `curl http://localhost:4000/api/tasks`.

Store the screenshots in the `evidence/` folder if you want to keep them together. Do not make up compiler counts; use the diagnostics produced by your local TypeScript version.
