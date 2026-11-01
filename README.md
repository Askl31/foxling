# 🦊 Foxling

Application web ludique et pédagogique pour apprendre l'anglais à deux enfants de **4 et 6 ans**, guidée par **Foxy**, un petit renard bienveillant qui « parle anglais ».

- **PWA** React + Vite + TypeScript, installable sur tablette, 100 % offline après le premier chargement.
- **Interface enfant 100 % anglaise** (illustrations SVG immersives + voix studio Voxtral, zéro texte à lire pour le profil 4 ans), **espace parent en français**.
- **Voix studio IA & zéro fallback robotique** : 831 fichiers audio MP3 haute fidélité pré-générés avec **Mistral Voxtral Mini TTS 3.0** (voix Sky UK, douce et naturelle).
- **Curriculum complet de 152 mots** (Niveaux 1, 2 et 3) avec 100 % d'illustrations SVG frontales et chaleureuses adaptées aux 4–6 ans.
- **Rituel du dodo / berceuse (Anti-addiction)** : en fin de session quotidienne, Foxy enfile son bonnet de nuit avec « Zzz » animés, une berceuse boîte à musique retentit et il s'endort avec le bouton « 🌙 Good night, Foxy! » pour arrêter l'écran sans frustration.
- **Ergonomie enfant** : police ronde `Baloo 2` embarquée hors ligne, Web Audio SFX instantanés (carillons, pops doux, croques mignons), bouton de réécoute audio universel (🔊), layout paysage tablette zéro-scroll, et micro-animations de Foxy (yeux, oreilles, respiration).
- **Moteur SRS** (répétition espacée) : machine à états `New → D1 → D3 → D7 → D14 → D30 → Acquired`, planification J+1 → J+30, plafond de 8 révisions et 3–5 nouveaux mots par session, révision intra-session du mot le plus fragile.
- **7 mini-jeux interactifs** : Show me, Simon says (avec Foxy qui mime les actions), Hide & seek (Foxy coucou derrière les objets), Feed Foxy (nourriture animée volant dans la bouche), Say it! (ASR tolérant + fallback « écoute magique »), Karaoké, histoire interactive (« Touch-to-speak »).
- **Histoires à lexique contrôlé** : validateur programmatique (liste blanche stricte), une histoire n'utilise que des mots acquis ou du jour. Quizz vérifiés avec alternance des réponses et grammaire naturelle (articles `a`/`an` corrects, pas d'article sur les indénombrables et pluriels).
- **Espace parent moderne & ergonomique** : navigation par onglets segmentés, album visuel d'autocollants (Sticker Album), test direct de la voix de Foxy, export/import de sauvegarde JSON et pavé numérique tactile sécurisé (sans clavier virtuel OS).
- **Vie privée absolue** : zéro traceur, 100 % localStorage, verrou par hachage salé SHA-256.

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm test         # 57 tests unitaires + simulation E2E de session + moteur SRS + quizz
npm run build    # build de production (dist/)
node scripts/check-quizzes.mjs  # audit automatisé des quizz et illustrations (152/152 mots)
```

## Architecture

```
src/
├── engine/    moteur SRS pur + planification + validateur de lexique + simulation E2E
├── content/   curriculum (152 mots, chunks, histoires) + illustrations SVG enfantines (Foxy & objets)
├── games/     les 7 mini-jeux + histoire interactive
├── speech/    SpeechProvider : audioCache (831 MP3 Voxtral) + Web Audio SFX synthétisés (sfx.ts)
├── store/     état local (profils, wordStates, historique, sauvegarde JSON) — localStorage
├── parent/    tableau de bord parent (français) + album stickers + test voix Foxy
└── ui/        écrans : sélection de profil, accueil, session avec rituel dodo, pavé numérique
```

La pédagogie vit dans des JSON et des règles (`src/engine`, `src/content`) : le code n'est qu'un exécuteur.
