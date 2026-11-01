# 🦊 Foxling

Application web ludique et pédagogique pour apprendre l'anglais à deux enfants de **4 et 6 ans**, guidée par **Foxy**, un petit renard qui « parle anglais ».

- **PWA** React + Vite + TypeScript, installable sur tablette, 100 % offline après le premier chargement.
- **Interface enfant 100 % anglaise** (images + audio, zéro texte à lire pour le profil 4 ans), **espace parent en français**.
- **Ergonomie enfant (4-6 ans)** : police ronde `Baloo 2` embarquée hors ligne, Web Audio SFX instantanés (carillons, pops doux, fanfares), bouton de réécoute audio universel (🔊), layout paysage tablette zéro-scroll, et micro-animations de Foxy (yeux, oreilles, respiration).
- **Moteur SRS** (répétition espacée) : machine à états `New → D1 → D3 → D7 → D14 → D30 → Acquired`, planification J+1 → J+30, plafond de 8 révisions et 3–5 nouveaux mots par session.
- **7 mini-jeux interactifs** : Show me, Simon says (avec Foxy qui mime les actions), Hide & seek (Foxy coucou derrière les objets), Feed Foxy (nourriture animée volant dans la bouche), Say it! (ASR tolérant + fallback « écoute magique »), Karaoké, histoire interactive (« Touch-to-speak »).
- **Histoires à lexique contrôlé** : validateur programmatique (liste blanche stricte), une histoire n'utilise que des mots acquis ou du jour. Quizz vérifiés avec alternance des réponses et grammaire naturelle (articles `a`/`an` corrects, pas d'article sur les indénombrables et pluriels).
- **Deux profils enfants** créables (4 ans / 6 ans) avec passions, durées et tailles de session adaptées, stockés en local (aucune donnée ne quitte l'appareil).
- **Espace parent complet** : tableau de bord, album visuel d'autocollants (Sticker Album), export/import de sauvegarde JSON et pavé numérique tactile sécurisé.
- **Anti-nagging** : pas de streaks, pas de classements, Foxy dort après la session ; verrou de session optionnel.

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm test         # tests unitaires du moteur SRS + validateur de lexique + quizz (52 tests)
npm run build    # build de production (dist/)
node scripts/check-quizzes.mjs  # audit automatisé des quizz et illustrations
```

## Architecture

```
src/
├── engine/    moteur SRS pur + planification + validateur de lexique (testé, zéro dépendance UI)
├── content/   curriculum (137 mots, chunks, histoires) + illustrations SVG enfantines (Foxy & objets)
├── games/     les 7 mini-jeux + histoire interactive
├── speech/    SpeechProvider : TTS/ASR navigateur + bruitages Web Audio synthétisés (sfx.ts)
├── store/     état local (profils, wordStates, historique) — localStorage
├── parent/    tableau de bord parent (français) + album stickers + backup JSON
└── ui/        écrans : sélection de profil, accueil, session, audio prompt, pavé numérique
```

La pédagogie vit dans des JSON et des règles (`src/engine`, `src/content`) : le code n'est qu'un exécuteur.
