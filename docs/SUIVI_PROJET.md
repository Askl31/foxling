# 🦊 Foxling — Document de suivi du projet

Référence : cahier des charges « Foxling — Spécification produit & pédagogique » (fourni en entrée).
Dernière mise à jour : commit de mise en conformité + doc. Branche : `main`.

## Légende

- ✅ fait et vérifié · 🟡 fait mais à valider sur tablette réelle · ⬜ non fait

---

## 1. Vision & règles de conception (§1, §3)

| Critère | Statut | Où / commentaire |
|---|---|---|
| Interface enfant 100 % anglais, immersion totale | ✅ | Tous les textes enfant sont en anglais (`src/ui`, `src/games`) |
| Zéro texte à lire pour le profil 4 ans | ✅ | `showWrittenWords=false` pour 4 ans, mot écrit affiché seulement pour 6 ans (`Home`, `ShowMe`, intro) |
| ≤ 5 mots nouveaux / session (3 à 4 ans) | ✅ | `profileDefaults` + `pickNewWords` dans `Session.tsx` |
| ≤ 8 cartes de révision / session | ✅ | `MAX_REVIEW_PER_SESSION=8` + test unitaire |
| Feedback immédiat, positif, sans punition ; erreur → Foxy montre la réponse, l'enfant la touche | ✅ | `ShowMe`/`HideSeek`/`FeedFoxy` : état `revealed`, l'enfant doit toucher la bonne carte, puis le mot descend d'un cran (`recordResult` failure) |
| Une session = une boucle complète (révision → nouveau → contexte) | ✅ | `buildSession` §5.3 + écran d'ouverture chanson et clôture sticker |
| Pas de streaks / classements / nagging | ✅ | Clôture = Foxy dort ; aucun compteur de jours affiché à l'enfant |
| Un seul élément actif à l'écran | ✅ | Un mini-jeu à la fois, pas d'animations décoratives pendant la question |
| Cibles tactiles ≥ 2 cm | ✅ | `.option-card` ≥ 110–150 px, `.big-btn` ≥ 64 px de haut |
| 3 clics au hasard d'affilée → Foxy « réexplique » | ✅ | `streakFails >= 3` dans `Session.tsx` → « Watch Foxy! » + réexplication vocale |
| Interférence sémantique évitée | ✅ | `similarTo` (black/brown, sheep/goat) + `pickNewWords` bloque les voisins |

## 2. Programme & moteur SRS (§4, §5)

| Critère | Statut | Où / commentaire |
|---|---|---|
| Machine à états New→D1→D3→D7→D14→D30→Acquired | ✅ | `src/engine/srs.ts`, **chaque transition testée** (29 tests verts) |
| Planification D1→D3→D7→D14→D30 (J+1, J+3, J+7, J+14, J+30) | ✅ | `schedule.ts` `dueAtFor`, test des écarts cumulés 1/3/7/14/30 |
| Format de rappel dépend du stade (reconnaissance → production) | ✅ | `formatForStage` §5.2 + test |
| Mot acquis = rappel réussi à J+30, puis exposition passive | ✅ | `Acquired` sort des files actives, reste autorisé dans les histoires |
| Algorithme de session §5.3 (ordre, plafonds, révision intra-session) | ✅ | `buildSession` + tests d'ordre et de tri |
| Modèle de données JSON local | ✅ | `store/store.ts` (localStorage), profils + wordStates + chunks + history |
| Curriculum complet Niveaux 1–3 (~133 mots, 15 thèmes) | ✅ | `WORDS` + `WORDS_LEVEL2` + `WORDS_LEVEL3` dans `src/content/curriculum.ts` (~300 mots prévus sur 12 mois, base prête) |

## 3. Session quotidienne (§6)

| Critère | Statut | Où / commentaire |
|---|---|---|
| Ouverture 1 min (chanson ritualisée) | ✅ | Phase `open` : « Hello, hello! Let's play with Foxy! » |
| Boucle révision → nouveaux → intra-session → histoire → clôture | ✅ | `Session.tsx` |
| Clôture : sticker + au revoir, Foxy dort | ✅ | Phase `end`, 1–5 ⭐ selon les réussites |
| Verrou de session 1/jour (désactivable) | ✅ | `sessionLock` par profil + `sessionLockEnabled` global, `Home.tsx` bloque le bouton |
| Défi hors-écran pour le parent (affiché en français, jamais à l'enfant) | ✅ | `.parent-tip` en fin de session + section dédiée dans l'espace parent |
| Co-usage encouragé | ✅ | Idem |

## 4. Mini-jeux (§7)

| Jeu | Statut | Commentaire |
|---|---|---|
| Show me (2–4 choix) | ✅ | Reconnaissance, stades New→D3 |
| Simon says (TPR) | ✅ | Bouton « Done! » (caméra = v2 hors MVP) |
| Hide & seek | ✅ | Foxy caché derrière l'objet nommé |
| Feed Foxy | ✅ | Désormais utilisé pour les mots du thème `food` |
| Say it! (ASR tolérant + fallback « écoute magique ») | ✅ | `asrAccepts` valide le phonème initial ; si pas d'ASR (iPad), validation après écoute, **jamais de refus dur** |
| Karaoké | ✅ | Mots à trous chantés |
| Histoire interactive (5–8 pages, question cliquable) | ✅ | 3 histoires figées + **générateur contraint** (`storyGen.ts`) dès 4 mots appris |

## 5. Contenu IA sous contraintes (§8)

| Critère | Statut | Où / commentaire |
|---|---|---|
| Validateur programmatique liste blanche (Acquired/D30/D14 + mots du jour) | ✅ | `src/engine/lexicon.ts`, testé : un mot hors liste = histoire rejetée |
| Histoires 5–8 pages, structure répétitive, phrase ≤ 6 mots | ✅ | Générateur local déterministe, 5 tests de conformité (liste blanche sur 20+ seeds) |
| Prénom de l'enfant + passions dans les histoires | ✅ | Prénom dans texte + audio ; passions utilisées pour choisir les personnages de l'histoire |
| 1 chanson par thème, figée | ✅ | 7 chansons (`SONGS`), karaoké ligne par ligne avec les mots du thème |
| TTS navigateur MVP derrière `SpeechProvider` | ✅ | `BrowserSpeechProvider`, permutable (V2 voix LLM prête à brancher) |
| Audio pré-généré + cache offline complet | 🟡 | Offline ✅ (service worker) ; audio = TTS à la volée, pas de fichiers pré-générés ⬜ |

## 6. Espace parent en français (§9)

| Critère | Statut | Où / commentaire |
|---|---|---|
| Tableau de bord : mots en cours, stades, taux de réussite, progression | ✅ | `ParentDashboard.tsx` |
| Réglages : verrou, volume, voix, passions, mots personnalisés | ✅ | Mots personnalisés parent (texte + pictogramme), intégrés au curriculum de l'enfant (sessions + histoires) |
| Défis quotidiens hors-écran | ✅ | Section dédiée + carte en fin de session enfant |
| Aucune donnée ne quitte l'appareil | ✅ | 100 % localStorage |

## 7. Architecture & PWA (§10)

| Critère | Statut | Où / commentaire |
|---|---|---|
| PWA React + Vite + TypeScript | ✅ | `package.json`, build OK (61 kB gzip) |
| Structure `/engine /games /content /speech /parent /store` | ✅ | Respectée |
| Installable tablette, offline complet | ✅ | `manifest.webmanifest`, `sw.js`, icônes (any/maskable/apple-touch) |
| Déployable gratuitement (Netlify/Vercel) | ✅ | `netlify.toml` + `vercel.json` prêts (fallback SPA, no-cache SW, cache immutable) — voir `docs/DEPLOIEMENT.md` |
| Assets SVG cohérents, 1 couleur par thème | ✅ | 83 SVG validés, `THEME_COLORS` |
| Évolutif vers Capacitor | ✅ | PWA pure, aucun code natif |

## 8. Jalons du plan de construction (§11)

| Jalon | Statut | Critère d'acceptation | État |
|---|---|---|---|
| **M0** Socle PWA, profils 4/6 ans, navigation, sons, accueil | ✅ | Un enfant démarre une session en autonomie | OK (testé par l'utilisateur) |
| **M1** Moteur SRS + tests + « Show me » | ✅ | JSON d'état suit la machine à états, 100 % tests verts | 29/29 ✅ |
| **M2** Nouveaux mots + Simon says + Feed Foxy | ✅ | Session complète sans texte à lire | OK |
| **M3** Histoires interactives + validateur de lexique + cache offline | ✅ | Histoire = uniquement mots autorisés (test automatisé) | OK |
| **M4** Say it! (ASR + fallback), karaoké, Hide & seek | 🟡 | Production orale testée **sur tablette réelle** | Code prêt, **validation terrain à faire** |
| **M5** Espace parent, stats, réglages, verrou | ✅ | Parent lit la progression en français | OK |

## 9. Risques & garde-fous (§12)

| Risque | Garde-fou | Statut |
|---|---|---|
| Temps d'écran excessif | Sessions courtes + verrou + pas de boucle infinie | ✅ |
| ASR frustrant | Validation tolérante, jamais de refus dur, fallback écoute magique | ✅ |
| Contenu IA dérivant | Liste blanche programmatique, échec = régénération | ✅ (validateur) / ⬜ (pipeline de régénération LLM) |
| Clics au hasard (4 ans) | 2 choix au début, réponse suivie de l'audio, réexplication après 3 échecs | ✅ |
| Perte d'envie | Foxy attachant, zéro pression, histoires personnalisées hebdo | 🟡 (personnalisation ⬜) |

---

## Ce qu'il reste à faire (par ordre de priorité)

1. **Validation terrain M4** : tester « Say it! » (ASR) et le karaoké sur la tablette réelle des enfants (iPad Safari = fallback à vérifier, Android/Chrome = ASR à vérifier).
2. **Génération d'histoires par LLM externe** : brancher un appel LLM derrière `generateStory` (même contrat : JSON → `validateStory` → régénération automatique), le générateur local servant de fallback offline.
4. **Audio pré-généré en cache** (§10) : fichiers audio pour mots/histoires/chansons mis en cache par le service worker (offline garanti même sans voix système) ; option V2 voix LLM premium derrière `SpeechProvider`.
5. **Tests E2E** (Playwright) du parcours complet : créer profil → session → fin → verrou du lendemain.
6. **Validation par les enfants eux-mêmes** (§11) : l'enfant demande-t-il à rejouer ? Pointe-t-il le chat dans un livre anglais hors écran à la fin du mois ?

## Commandes utiles

```bash
npm install
npm run dev     # développement
npm test        # 34 tests : moteur SRS + lexique + générateur d'histoires
npm run build   # production → dist/
```
