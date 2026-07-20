# Module : `i18n-service`

**Phase :** P2 · **Port :** 5015 · **Base :** MongoDB `i18n`

## 1. Responsabilité

Localisation de la plateforme et des jeux : gestion des langues (dont **langues africaines**), **traduction communautaire** puis pipeline IA, glossaires et validation. Sert les contenus localisés à tous les services (notamment `notification`, `griot`, `catalog`).

## 2. Périmètre fonctionnel par phase

- **Phase 2 :** catalogue de langues, chaînes localisées (UI + jeux), **traduction communautaire** (proposition → validation), glossaires culturels.
- **Phase 3 :** **traduction IA multilingue** (via ai-service), détection automatique de langue, contrôle qualité assisté.

## 3. Entités / modèles principaux

- `Locale` : langue/région, statut, complétude.
- `TranslationKey` / `Translation` : clé → valeurs par locale.
- `TranslationJob` : tâche de traduction (communautaire ou IA), statut, validation.
- `Glossary` : termes culturels/normalisés.

## 4. API principales

- `GET /locales`, `GET /translations/:namespace/:locale`
- `POST /translations` (contribution communautaire), `POST /translations/:id/validate`
- `POST /jobs` (traduction IA : P3)

## 5. Événements

- **Produits :** `TranslationPublished`, `LocaleAdded`.
- **Consommés :** `GamePublished` (extraction des chaînes à traduire).

## 6. Dépendances

- **S :** `ai` (traduction IA P3), `governance` (validation traducteurs/validateurs culturels).
- Sollicité par : `notification`, `griot`, `catalog`, apps.

## 7. Arborescence

```text
services/i18n-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{locale,translation,job}.routes.ts
│   ├── controllers/
│   ├── services/
│   │   ├── locale.service.ts
│   │   ├── translation.service.ts     # communautaire + validation
│   │   └── job.service.ts             # pipeline IA (P3)
│   ├── models/{locale,translation,translationJob,glossary}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module

1. `Locale` + `Translation` (clés/valeurs) + API de service des chaînes.
2. Contribution communautaire + workflow de validation.
3. Glossaires culturels + langues africaines prioritaires.
4. Extraction des chaînes sur `GamePublished`.
5. (P3) Pipeline de traduction IA + détection de langue + QA assistée.
