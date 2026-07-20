# Roadmap — `studio-editor-native`

Complète la roadmap de `docs/modules/studio-service.md` §15 côté outil natif. Ne démarre qu'après que
`studio-service` (backend) et le Studio web exposent un pipeline projet/publication stable (Lot 11,
`docs/AFG-DT-003_roadmap-conception.md`) — l'éditeur natif est un **second client** de la même API,
jamais un chemin de données parallèle.

- [x] Squelette GDExtension (`register_types`, ressources `AfgProject/Scene/Rule/Variable`, panneaux
      dock vides, build CMake, tests Catch2 sur `RulesEngineBridge`).
- [ ] **Lot Studio natif #1** : `AfgApiClient` réellement câblé (cpp-httplib + nlohmann::json),
      authentification (`identity-service`), dock principal fonctionnel (liste/ouverture de projets).
- [ ] **Lot Studio natif #2** : édition de scènes/règles/variables avec prévisualisation locale
      (`RulesEngineBridge`), export au format JSON consommé par `game-service/rules-engine` —
      vérifier par un test croisé (le JSON produit ici doit être accepté tel quel côté serveur).
- [ ] **Lot Studio natif #3** : panneau générateurs IA (6 générateurs + copilote) branché sur
      `ai-service`.
- [ ] **Lot Studio natif #4** : marketplace (import de templates/assets) + panneau certification
      (7 badges AFG) branchés sur `catalog-service`/`governance-service`.
- [ ] **Lot Studio natif #5** : collaboration (commentaires/tâches), versioning/branches, publication
      via `publishing-service` (même pipeline que le Studio web).
- [ ] (P3+) Empaquetage installeurs (Windows/macOS/Linux), mise à jour automatique, télémétrie
      d'usage anonymisée (opt-in) pour prioriser les prochains panneaux.

Voir aussi `docs/AFG-DT-001_architecture-globale.md` ADR-11 pour la décision et ses alternatives.
