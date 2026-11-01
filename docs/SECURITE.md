# 🔒 Sécuriser l'accès à Foxling sans base de données externe

Foxling est 100 % local (aucune donnée ne quitte l'appareil). Le verrouillage se fait donc **en deux couches complémentaires**, sans aucun serveur de comptes :

## Couche 1 (recommandée) — Basic Auth au niveau de la plateforme, gratuit

Protège **tout le site avant même le chargement de l'app** (le navigateur demande user/mot de passe).

### Netlify — Edge Function d'accès (GRATUIT, recommandé depuis 2026)

> ⚠️ Depuis 2026, sur les comptes récents (credit-based), le « Password Protection » du
> dashboard **et** le Basic Auth via `_headers` sont réservés aux plans Pro/Enterprise.
> Sur le plan gratuit, la solution est une **Edge Function** (gratuite) déjà codée dans le dépôt.

L'app contient `netlify/edge-functions/auth.ts` : tant qu'un visiteur n'a pas saisi le bon
mot de passe, **aucun contenu de l'app n'est servi** (page de saisie 401). Le cookie de session
est signé HMAC-SHA256, valable 7 jours.

**Configuration (console Netlify, 2 variables d'environnement)** :
1. Projet `foxling` → **Project configuration → Environment variables** :
   - `SITE_PASSWORD` = le mot de passe visiteur (ex. généré par un gestionnaire)
   - `AUTH_SECRET` = chaîne aléatoire 32+ caractères (ex. `openssl rand -hex 32`)
2. **Trigger deploy** pour re-déployer l'edge function.
3. Teste : ouvrir https://foxling.netlify.app en navigation privée → page 🔒 → mot de passe.

**Variante sans edge function** (si tu passes en Pro un jour) : `Project configuration → Access & security
→ Visitor access → Password Protection`, ou Basic Auth via `public/_headers`
(`BASIC_AUTH_PASSWORD=... node scripts/enable-basic-auth.mjs` puis commit/push).

### Vercel
- Vercel **ne propose pas** de Basic Auth intégré sur le plan gratuit. Options : Vercel Edge Middleware avec un hash en env var (code à ajouter si besoin), ou choisir Netlify pour cette couche.

## Couche 2 — écran de verrouillage dans l'app (déjà implémenté)

- Le parent définit un **code à 4+ chiffres** dans l'espace parent → Réglages → 🔒 Verrou d'accès.
- L'app stocke uniquement un **hash SHA-256 salé (20 000 itérations)** dans `localStorage` (`src/store/lock.ts`) — **jamais le code en clair**.
- Au lancement suivant (nouvel onglet), l'écran 🔒 demande le code ; la vérification est 100 % locale (WebCrypto).
- L'accès reste déverrouillé pour la session en cours (`sessionStorage`), donc pas de code à chaque écran.

## Limites honnêtes

- Sans BDD, le verrou est **par appareil** (le hash vit dans le localStorage de la tablette) : quelqu'un qui a la tablette peut vider le stockage navigateur pour retirer le verrou — d'où l'intérêt de la couche 1 (Basic Auth) qui protège avant le navigateur.
- C'est un verrou « anti-enfant / anti-accès casual », pas une authentification forte multi-utilisateurs. Pour un produit commercial multi-comptes, il faudra un backend (Supabase/Firebase Auth) — hors périmètre familial du CDC §9.

## Récapitulatif

| Couche | Où | Coût | Force |
|---|---|---|---|
| Gate plateforme (edge function) | Netlify — `netlify/edge-functions/auth.ts` + env `SITE_PASSWORD`/`AUTH_SECRET` | **gratuit** | ⭐⭐⭐ forte (réseau, avant l'app) |
| Écran code dans l'app | `src/store/lock.ts` + espace parent | gratuit, local | ⭐⭐ moyenne (par appareil) |
| Les deux ensemble | déployé | gratuit | ⭐⭐⭐ recommandé |
