# Screenshot checklist

Please capture real outputs from your machine and optionally copy the screenshots into this folder.

1. `npm run typecheck` with all workspaces passing.
2. `node scripts/migration-demo.mjs` showing intentional TypeScript diagnostics and the counted number.
3. Browser at `http://localhost:5173` with the task board loaded.
4. Browser after adding a task or toggling a task to completed.
5. Optional API output from `curl http://localhost:4000/api/tasks`.

These screenshots will be used in the report after you upload them. The compiler diagnostic count must come from your own run.
