# CarStage AI Frontend

Frontend for CarStage AI, a SaaS platform that generates professional automotive stage images from raw car photos.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main routes

- `/login` mock login (accepts any credentials)
- `/dashboard` overview and recent jobs
- `/jobs/new` car upload, background selection, logo upload, and submit
- `/jobs/history` job history list
- `/jobs/[jobId]` job detail with progress and output gallery

## Notes

- Data is mocked and persisted in `localStorage`.
- The service layer in `src/lib/api` is typed so it can be replaced with real backend APIs later.
