# 🔒 Sécuriser l'accès à Foxling sans base de données externe

Foxling est 100 % local (aucune donnée ne quitte l'appareil). Le verrouillage se fait donc **en deux couches complémentaires**, sans aucun serveur de comptes :

## Couche 1 (recommandée) — Basic Auth au niveau de la plateforme, gratuit

Protège **tout le site avant même le chargement de l'app** (le navigateur demande user/mot de passe).

### Netlify (fonctionne en gratuit)
1. Générez le hash du mot de passe :
   ```bash
   printf "foxling:VotreMotDePasse" | openssl passwd -apr1 -stdin
   # → $apr1$...  (ne le commitez pas en clair dans un message, c'est un hash)
   ```
2. Éditez `public/_headers` (déjà présent, commenté) :
   ```
   /*
     WWW-Authenticate: Basic realm="Foxling"
     Authorization: Basic $apr1$...
   ```
   → en fait Netlify utilise le mécanisme « Password protection » du site (Site settings → Password protection), encore plus simple : un seul mot de passe, zéro fichier à éditer. Le fichier `_headers` documente la variante avancée.
3. Redéployez. Toute visite demandera le mot de passe.

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
| Basic Auth plateforme | Netlify (Site settings → Password protection) | gratuit | ⭐⭐⭐ forte (réseau) |
| Écran code dans l'app | `src/store/lock.ts` + espace parent | gratuit, local | ⭐⭐ moyenne (par appareil) |
| Les deux ensemble | déployé | gratuit | ⭐⭐⭐ recommandé |
