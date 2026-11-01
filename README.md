# 🦊 Foxling

Application web ludique et pédagogique pour apprendre l'anglais à deux enfants de **4 et 6 ans**, guidée par **Foxy**, un petit renard qui « parle anglais ».

- **PWA** React + Vite + TypeScript, installable sur tablette, 100 % offline après le premier chargement.
- **Interface enfant 100 % anglaise** (images + audio, zéro texte à lire pour le profil 4 ans), **espace parent en français**.
- **Moteur SRS** (répétition espacée) : machine à états `New → D1 → D3 → D7 → D14 → D30 → Acquired`, planification J+1 → J+30, plafond de 8 révisions et 3–5 nouveaux mots par session.
- **7 mini-jeux** : Show me, Simon says (TPR), Hide & seek, Feed Foxy, Say it! (ASR tolérant + fallback « écoute magique »), Karaoké, histoire interactive.
- **Histoires à lexique contrôlé** : validateur programmatique (liste blanche stricte), une histoire n'utilise que des mots acquis ou du jour.
- **Deux profils enfants** créables (4 ans / 6 ans) avec passions, durées et tailles de session adaptées, stockés en local (aucune donnée ne quitte l'appareil).
- **Anti-nagging** : pas de streaks, pas de classements, Foxy dort après la session ; verrou de session optionnel.

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm test         # tests unitaires du moteur SRS + validateur de lexique
npm run build    # build de production (dist/)
```

## Architecture

```
src/
├── engine/    moteur SRS pur + planification + validateur de lexique (testé, zéro dépendance UI)
├── content/   curriculum (mots, chunks, histoires) + illustrations SVG générées (Foxy & objets)
├── games/     les 7 mini-jeux + histoire interactive
├── speech/    SpeechProvider : TTS/ASR navigateur + fallbacks
├── store/     état local (profils, wordStates, historique) — localStorage
├── parent/    tableau de bord parent (français)
└── ui/        écrans : sélection de profil, accueil, session
```

La pédagogie vit dans des JSON et des règles (`src/engine`, `src/content`) : le code n'est qu'un exécuteur.
