# Module — `griot-service`

**Phase :** P2 · **Port :** 5011 · **Base :** MongoDB `griot` (+ object storage audio/images)

## 1. Responsabilité
Porter la **couche culturelle (Mode Griot)** : contenus culturels, fiches, proverbes, histoires, narration vocale — pour transformer chaque partie en expérience de transmission du patrimoine africain.

## 2. Périmètre fonctionnel par phase
- **MVP (léger) :** fiches culturelles, illustrations, descriptions attachées aux jeux.
- **Phase 2 :** narrateur vocal, proverbes, histoires, contenus en langues africaines ; API Griot pour les jeux/SDK.
- **Phase 3 :** **Griot IA** : narration dynamique, adaptation au joueur et au contexte, transmission contextuelle (délégué à `ai`, orchestré ici).

## 3. Entités / modèles principaux
- `CulturalCard` : fiche (pays, culture, thème, média).
- `Proverb`, `Story` : contenus narratifs (localisés).
- `NarrationTrigger` : règle « quand/quoi raconter » selon le contexte de partie.

## 4. API principales
- `GET /griot/cards?game=&culture=&country=`
- `GET /griot/narration?context=…` (anecdote/tour)
- `GET /griot/proverbs`, `GET /griot/stories/:id`
- (API publique via gateway : API Griot)

## 5. Événements
- **Produits :** `CulturalContentPublished`.
- **Consommés :** `SessionStarted` (contexte de partie), `CulturalDeclaration` (publishing).

## 6. Dépendances
- **S :** `catalog` (contexte jeu), `ai` (Griot IA P3), `governance` (validation culturelle).
- Sollicité par `game`/`realtime` (anecdotes par tour) et le SDK.

## 7. Arborescence
```
services/griot-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{card,narration,proverb,story}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── content.service.ts
│   │   ├── narration.service.ts       # sélection contextuelle
│   │   └── tts.service.ts             # narrateur vocal (P2)
│   ├── models/{culturalCard,proverb,story,narrationTrigger}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. `CulturalCard` + rattachement aux jeux (déclaration culturelle).
2. API de contenus culturels (cards/proverbs/stories).
3. Sélection contextuelle de narration (par tour/thème).
4. Narrateur vocal (TTS) + langues africaines.
5. Validation culturelle (hooks governance).
6. (P3) Griot IA dynamique (via ai-service).
