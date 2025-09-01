# Client Module Backend (Express + MongoDB)

## Setup
1. Create `.env` and set values.
2. Install dependencies and run dev server.

```bash
npm install
npm run dev
```

## Environment
- PORT: default 4000
- MONGO_URI: MongoDB connection string

## API
Base URL: `/api/clients`

- GET `/` list clients (query: `page`, `limit`, `status`, `q`)
- POST `/` create client `{ name, email?, phone?, status? }`
- GET `/:id` get by id
- PUT `/:id` update `{ name?, email?, phone?, status? }`
- DELETE `/:id` delete
- PATCH `/:id/status` set status `{ status: 'active' | 'inactive' }`

## Notes
- `status` defaults to `inactive`.
- Validations enforced via `express-validator`.
