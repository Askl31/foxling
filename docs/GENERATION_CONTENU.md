# 📦 Procédure pas à pas — génération de tout le contenu (histoires + voix)

Objectif : que **tout le contenu soit pré-généré et commité**, pour que l'app fonctionne **100 % offline, sans aucun appel API pendant l'usage** par les enfants. La clé Mistral sert uniquement à ces étapes de génération, jamais à l'usage.

> 🔒 **Règle de sécurité** : ne collez jamais votre clé dans le chat, un fichier du dépôt ou un log. Elle se passe uniquement en **variable d'environnement** (`MISTRAL_API_KEY=...` devant la commande) ou en **variable d'environnement du site** (Netlify/Vercel).

---

## Étape 0 — prérequis

```bash
cd foxling
git pull
npm install
npm test        # doit afficher 47 tests verts
```

Créez votre clé sur [console.mistral.ai](https://console.mistral.ai) (API keys).

---

## Étape 1 — banque d'histoires pré-générées (gratuit, local, aucune clé)

```bash
node scripts/build-story-bank.mjs --count 60
# → réécrit src/content/generated-stories.json (60 histoires validées liste blanche)
node scripts/build-tts-manifest.mjs
# → réécrit public/audio/manifest.json (332 entrées audio : mots, prompts, chansons, phrases)
git add -A && git commit -m "contenu régénéré" && git push
```

Chaque histoire générée passe le **validateur liste blanche** (`validateStory`) : un mot non prévu = régénération automatique (max 3) puis rejet. Les tests vitest re-valident tout le JSON à chaque `npm test`.

## Étape 2 — histoires LLM avec votre clé (optionnel, ~0,01 $ pour 40 histoires)

⚠️ **Ne collez JAMAIS votre clé en clair dans un terminal partagé, un chat ou un log** (elle apparaît dans l'historique shell et les logs). Préférez un fichier env local non commité :

```bash
echo 'MISTRAL_API_KEY=sk-...' > .env.local   # .env.local est ignoré par git
set -a; source .env.local; set +a            # charge la clé dans l'environnement seulement
node scripts/generate-content.mjs stories --count 40 --name Foxy
```

Si une clé a fuité (chat, logs, historique shell) : **révoquez-la immédiatement** sur [console.mistral.ai](https://console.mistral.ai) → API keys → Revoke, puis créez-en une nouvelle.

```bash
MISTRAL_API_KEY=sk-... node scripts/generate-content.mjs stories --count 40 --name Foxy
# → écrit src/content/generated-stories.json (histoires LLM validées puis commitées)
git add -A && git commit -m "histoires LLM pré-générées" && git push
```

Modèle : `mistral-small-latest` (~0,15 $/M tokens entrée). Une histoire ≈ 1 000 tokens ≈ **0,0002 $**.

## Étape 3 — voix pré-générées Voxtral (TTS) pour TOUS les textes (~0,0001 $ une fois)

```bash
# 3a. le manifeste est déjà généré (étape 1) : public/audio/manifest.json
# 3b. génère un MP3 par entrée :
MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs
# test partiel d'abord si vous voulez :
MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs --limit 20
# autre voix (preset Mistral) :
MISTRAL_TTS_VOICE=gb_jane_neutral MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs
# → public/audio/<slug>.mp3  (un par mot / prompt / ligne de chanson / phrase fixe)
git add public/audio && git commit -m "voix Voxtral pré-générées" && git push
```

**Erreur `HTTP 403` sur certaines entrées TTS** : la voix `MISTRAL_TTS_VOICE` (défaut `gb_jane_neutral`) n'est pas autorisée pour votre tier/clé. Relancez **sans** cette variable (voix par défaut du compte) :

```bash
MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs     # sans MISTRAL_TTS_VOICE
```

Le script ignore les MP3 déjà présents : seules les entrées en 403 seront regénérées.

Modèle : `voxtral-mini-tts-3-0`, **13 $ / 1M caractères**. Les 332 entrées ≈ 7 000 caractères ≈ **0,0001 $ au total, une seule fois**. Ensuite : zéro appel, zéro coût, 100 % offline (les MP3 sont servis tels quels et mis en cache par le service worker).

> Les MP3 sont des binaires : si le dépôt devient lourd, vous pouvez les exclure du git (`.gitignore`) et les générer dans le CI Netlify/Vercel à chaque build (voir étape 5).

## Étape 4 — déploiement + clé côté serveur (Netlify ou Vercel)

1. Importez le dépôt sur la plateforme (voir `docs/DEPLOIEMENT.md`).
2. **Variables d'environnement du site** (jamais dans le code) :
   - `MISTRAL_API_KEY` = votre clé
   - optionnel : `MISTRAL_TTS_VOICE` = `gb_jane_neutral`
3. Cela active automatiquement :
   - `POST /api/generate-story` → génération d'histoires **à la demande** depuis l'espace parent (proxy serveur, la clé n'atteint jamais le navigateur)
   - `POST /api/tts` → voix des phrases dynamiques (histoires avec le prénom) générées à la volée puis **mises en cache côté tablette** (CacheStorage) : première lecture en ligne, suivantes offline.

## Étape 5 — (option) génération dans le CI au build

Pour ne pas commiter les MP3, ajoutez dans `netlify.toml` / build Vercel :

```bash
node scripts/build-tts-manifest.mjs && MISTRAL_API_KEY=$MISTRAL_API_KEY node scripts/generate-audio.mjs
```

La clé est injectée par le CI depuis les secrets de la plateforme, jamais écrite dans les logs du dépôt.

---

## Récapitulatif des coûts (2 enfants, usage familial)

| Poste | Quand | Coût |
|---|---|---|
| Banque d'histoires locale (étape 1) | une fois | **0 $** |
| 40 histoires LLM (étape 2) | une fois | **≈ 0,01 $** |
| 332 voix Voxtral (étape 3) | une fois | **≈ 0,0001 $** |
| Histoires à la demande via proxy | à chaque clic parent | ~0,0002 $/histoire |
| Voix des histoires dynamiques | première lecture de chaque histoire | ~0,0001 $/histoire |
| **Usage quotidien des enfants** | **toujours** | **0 appel, 0 $, 100 % offline** |

## Ordre de lecture dans l'app (audio)

`src/speech/audioCache.ts` : MP3 pré-généré → MP3 généré à la volée puis caché → TTS navigateur (dernier recours).

## Vérification

```bash
npm test                 # 47 tests : moteur SRS, lexique, banques d'histoires, SVG
npm run build            # build PWA
# puis : couper le Wi-Fi après 1er chargement → l'app marche encore
```
