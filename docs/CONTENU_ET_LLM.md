# 🤖 Contenu pré-généré & utilisation de la clé Mistral

## Principe

**Pendant l'utilisation par les enfants, AUCUN appel LLM n'est fait.** Tout le contenu nécessaire est déjà dans l'app (100 % offline) :

- **78 histoires pré-générées** commitées (18 banque + 60 générées et validées dans `src/content/generated-stories.json`) dans `src/content/storyBank.ts`, choisies de façon déterministe (profil + jour) → chaque enfant a une histoire différente chaque jour, sans réseau.
- **~133 mots** avec illustrations SVG embarquées, **10 chansons**.
- Voix : TTS du navigateur (Web Speech API), aucune requête.

## Génération EN AMONT avec votre clé Mistral (coût maîtrisé, batch)

La clé se lit **uniquement** depuis la variable d'environnement, jamais écrite dans le dépôt :

```bash
# 40 histoires validées (liste blanche auto) commitées dans le dépôt :
MISTRAL_API_KEY=sk-... node scripts/generate-content.mjs stories --count 40 --name Foxy

# Audio pré-généré (Voxtral TTS) mis en cache par le service worker :
MISTRAL_API_KEY=sk-... node scripts/generate-content.mjs audio --out public/audio --texts "cat,dog,duck,apple"
```

Modèle utilisé : `mistral-small-latest` (~0,15 $/M tokens entrée). Une histoire ≈ 1 000 tokens ≈ **0,0002 $**. 40 histoires ≈ quelques centimes, une seule fois.

Chaque histoire LLM passe par le **validateur programmatique** (`validateStory`) : lexique hors liste blanche → régénération (max 3) → rejet. Le JSON généré est commité : ensuite, zéro coût.

## Génération À LA DEMANDE depuis l'espace parent (optionnel)

**En production (Netlify/Vercel)** — recommandé : mettez `MISTRAL_API_KEY` dans les **variables d'environnement du site** (jamais dans le code ni le navigateur). L'espace parent appelle alors le proxy serveur :

- Netlify : `netlify/functions/generate-story.mjs` → `POST /api/generate-story`
- Vercel : `api/generate-story.ts` (edge) → `POST /api/generate-story`

**En local** : champ « clé dev » dans l'espace parent → appel direct à `api.mistral.ai`, clé en `sessionStorage` uniquement (mémoire d'onglet, jamais persistée ni loguée).

Dans les deux cas : « Générer une histoire pour {prénom} » envoie la liste des mots **déjà appris** + prénom + passions, et le résultat est **validé localement** (liste blanche) avant affichage — rejet avec la liste des mots non appris sinon.

## Voix pré-générées (Voxtral TTS) — disponibles pour tous les mots, chansons, phrases et histoires

### 1. Générer le manifeste (aucun coût)
```bash
node scripts/build-tts-manifest.mjs
# → public/audio/manifest.json : 332 entrées (135 mots + prompts « Show me the… »,
#   10 chansons ligne par ligne, 22 phrases fixes de l'interface enfant)
```

### 2. Générer tous les MP3 avec votre clé (environnement uniquement, ~0,0001 $ au total)
```bash
MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs            # tout générer
MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs --limit 50  # test partiel
MISTRAL_TTS_VOICE=gb_jane_neutral MISTRAL_API_KEY=... node scripts/generate-audio.mjs  # autre voix
# → public/audio/<slug>.mp3 (servis tels quels, mis en cache par le service worker : 100 % offline)
```

### 3. Phrases dynamiques (histoires avec le prénom de l'enfant)
Le proxy serveur génère à la volée et le client met en cache (CacheStorage) :
- Netlify : `netlify/functions/tts.mjs` → `POST /api/tts` (clé `MISTRAL_API_KEY` en env Netlify)
- Vercel : `api/tts.ts` (edge) → `POST /api/tts` (clé `MISTRAL_API_KEY` en env Vercel)

### 4. Ordre de lecture dans l'app (`src/speech/audioCache.ts`)
MP3 pré-généré → MP3 généré à la volée et caché → TTS navigateur (fallback si aucun des deux).

**Coût total pour 2 enfants : ~0,0001 $ one-shot pour tous les MP3** (les ~7 000 caractères × 13 $/1 M). Ensuite : **0 appel, 0 $, 100 % offline**, qualité Voxtral.
