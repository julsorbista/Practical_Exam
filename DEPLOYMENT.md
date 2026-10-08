# Vercel deployment

Import the repository root with the Services application preset. The root
`vercel.json` builds `orbistaclient/client` as the `client` Vite service and
`server` as the `server` Express service.

Public requests under `/api/` reach Express with the original path preserved.
All other requests reach the frontend. React calls `/api/students` on the same
domain. There are no server-to-server calls and no internal service bindings.
The static browser app cannot read runtime binding variables.

Set `MONGO_URI` in Vercel for Production and Preview using the current MongoDB
Atlas connection string. Keep it out of Git and the browser. If a password has
been exposed, replace it in Atlas and update Vercel. Allow the deployment to
connect in Atlas Network Access.

For local development, run `npm ci` and `npm start` in `server`, and `npm ci`
and `npm run dev` in `orbistaclient/client`. Vite proxies `/api` to port 5001.
Keep the local connection string in `server/.env`.

To test the Vercel service router, install the Vercel CLI and run `vercel dev`
from the repository root. Check `/`, `/api/`, and the student CRUD operations.

Before publishing, confirm the service names and public paths with the owner.
