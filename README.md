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
