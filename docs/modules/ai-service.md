# Module — `ai-service`

**Phase :** P2 · **Port :** 5012 · **Base :** MongoDB `ai` (contexte/traces, pas de vérité métier)

## 1. Responsabilité
Orchestrateur **IA transverse** : assistance aux joueurs, familles, créateurs, Griot, traduction, modération et compétences. Principe directeur : **l'IA assiste sans remplacer** ; les décisions importantes restent sous contrôle humain (validation, modération). Abstraction du fournisseur de modèles.

## 2. Périmètre fonctionnel par phase
- **Phase 2 :** IA joueur (suggestions, recherche intelligente, coach, analyse des habitudes), IA famille (compositions de jeu adaptées), IA créateur (analyse de performances, conseils), **IA modération** (fraude, haine, violence, spam, plagiat, contenus inappropriés), IA compétences (affinage IDC niveaux 3-4), assistance traduction.
- **Phase 3 :** assistant conversationnel, défis personnalisés, Griot IA (narration dynamique), IA de **création de jeux** (assistant de conception, équilibrage), traduction IA multilingue, détection auto de compétences mobilisées.

## 3. Entités / modèles principaux
- `AITask` : requête d'assistance (type, contexte, statut, garde-fous appliqués).
- `ModerationCase` : verdict IA + escalade humaine.
- `RecommendationContext`, `PromptTemplate` (versionnés).
- Traces/journaux pour auditabilité.

## 4. API principales
- `POST /ai/recommend`, `POST /ai/coach`
- `POST /ai/creator/analyze`, `POST /ai/moderate`
- `POST /ai/skills/analyze` (→ IDC), `POST /ai/griot/narrate` (P3)
- `POST /ai/translate` (assistance i18n)

## 5. Événements
- **Produits :** `AICheckResult`, `AISkillAnalysis`, `ModerationDecision` (avec flag escalade humaine).
- **Consommés :** `SessionEnded`, `ContentSubmitted`, `ChatMessage` (modération), `GameSubmitted`.

## 6. Dépendances
- **S :** quasiment tous (assistance transverse), notamment `skills-idc`, `catalog`, `publishing`, `griot`, `social`.
- Externes : fournisseurs de modèles (LLM + spécialisés) via abstraction.

## 7. Arborescence
```
services/ai-service/
├── src/
│   ├── app.ts · index.ts · logger.ts
│   ├── routes/{recommend,coach,creator,moderation,skills,translate}.routes.ts
│   ├── controllers/
│   ├── orchestrator/
│   │   ├── task.service.ts            # dispatch + garde-fous
│   │   ├── guardrails.ts              # limites, contrôle humain
│   │   └── humanReview.ts             # escalade
│   ├── agents/                        # un module par capacité
│   │   ├── player.agent.ts · family.agent.ts · creator.agent.ts
│   │   ├── moderation.agent.ts · skills.agent.ts · griot.agent.ts
│   ├── providers/                     # abstraction fournisseur
│   │   ├── llm.interface.ts
│   ├── models/{aiTask,moderationCase,promptTemplate}.model.ts
│   ├── events/
│   └── utils/
├── tests/
├── jest.config.js · Dockerfile · package.json · README.md · ROADMAP.md
```

## 8. Roadmap de conception du module
1. Orchestrateur + abstraction fournisseur + garde-fous + traces d'audit.
2. IA joueur/famille (reco, coach) branchée sur skills-idc/catalog.
3. **IA modération** + escalade humaine (governance).
4. IA créateur (analyse de performances) + IA compétences (IDC niv.3-4).
5. Assistance traduction (i18n).
6. (P3) Assistant conversationnel, Griot IA, IA de création de jeux, traduction IA.
