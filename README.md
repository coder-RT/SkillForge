# SkillForge
Online Consultation Service
SOLID-oriented Backend (FastAPI × SQLAlchemy × Redis × Stripe)

### ✅ Test drive
```bash
# REST
curl -X POST http://localhost:8000/users \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"secret123","roles":["STUDENT","TEACHER"]}'

# GraphQL
curl http://localhost:8000/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"mutation { registerUser(input:{email:\"bob@example.com\",password:\"secret123\",roles:[TEACHER]}){id email profiles{role isDefault}} }"}'
```

Everything respects SOLID: services depend on repo interface; REST & GraphQL are thin adapters.  Extend similarly for login, JWT, or role‑based auth.

### Commands:
```
npm install --save-dev @apollo/server@4.12.2

npx prisma generate
npx prisma migrate dev --name init

npx prisma migrate reset

node --loader ts-node/esm src/schema.ts
npm run generate
npm run dev

Database:
brew services start postgresql@15

psql -d postgres
psql -U postgres -d postgres

CREATE ROLE postgres SUPERUSER LOGIN PASSWORD 'postgres';
ALTER ROLE postgres WITH SUPERUSER LOGIN;

\conninfo
\du
\dt
SHOW PORT

SELECT * FROM "USER";
```
