# LeafTally — Deployment guide

## Option 1: GitHub Pages (recommended for demos)
1. Fork / push to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. Every push to `main` auto-deploys via `.github/workflows/deploy.yml`

## Option 2: Hostinger
1. `npm run build:standalone`
2. Log in to hPanel → File Manager → public_html
3. Delete existing `index.html`
4. Upload `dist/LeafTally_ERP.html`, rename to `index.html`
5. Hard-refresh (Ctrl+Shift+R) to bypass cache

## Option 3: Netlify (drag and drop)
1. `npm run build:standalone`
2. Go to app.netlify.com → drag `dist/` folder
3. Or connect your GitHub repo — `netlify.toml` handles the rest

## Option 4: Vercel
```bash
npm i -g vercel
vercel --prod
```

## Option 5: Local development
```bash
npm run dev        # Vite dev server at http://localhost:5173
# or
npm run preview    # Preview the built output
# or
python3 -m http.server 8080  # Serve dist/ directly
```

## Custom domain
Set your domain's DNS CNAME to your deployment URL.
Update `gh-pages/CNAME` in `deploy.yml` to your domain.
