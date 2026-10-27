# Digital Sanctuary
1. `npm install`
2. `cp .env.example .env.local` -> ADMIN_PIN set karo (Turso optional locally; local.db auto banta hai)
3. `npm run dev` -> http://localhost:3000
4. Admin: Ctrl+Shift+A (Mac: Cmd+Shift+A)
Deploy: GitHub push -> Vercel import -> env vars (ADMIN_PIN, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, GOOGLE_API_KEY optional).
Note: Vercel pe local.db kaam nahi karega, Turso URL zaroori hai.
Avatar .glb: public/avatar.glb daalo, Scene3D.jsx ke Avatar() me useGLTF('/avatar.glb') se replace karo.
