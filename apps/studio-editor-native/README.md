# `studio-editor-native` — Éditeur AFG Game Studio (C++)

Éditeur **desktop natif en C++**, destiné aux créateurs de Niveau 3-4 (développeurs, studios professionnels — cf. `docs/modules/studio-service.md` §2). Distinct du **Studio web** (React, no-code/low-code, créateurs Niveau 1-2), qui reste la porte d'entrée accessible sans installation. Les deux consomment la **même API** `studio-service` (backend Node, cf. `docs/modules/studio-service.md`) : un projet créé dans l'un est visible/éditable dans l'autre.

> Décision architecturale : ADR-11 (`docs/AFG-DT-001_architecture-globale.md` §8). Justification, alternatives évaluées et arbitrage utilisateur : `docs/AFG-DT-004_decisions-ouvertes.md` §7.

## Pourquoi Godot Engine (GDExtension) plutôt qu'un moteur/éditeur from scratch

Construire les six moteurs d'AFG-005 (§11-19 : scènes, règles, événements, variables, UI, animations/audio/vidéo) et un éditeur graphique complet from scratch en C++ représenterait des années-personnes. **Godot Engine** (MIT, C++, https://github.com/godotengine/godot) fournit déjà, en open source, un équivalent direct de chacun de ces moteurs :

| Moteur AFG-005 | Équivalent Godot | Ce qu'on garde tel quel | Ce qu'on ajoute (spécifique AFG) |
|---|---|---|---|
| Moteur de scènes | Scene tree / `.tscn` | Éditeur de scène complet | Mapping vers `Scene` (studio-service), templates AFG |
| Moteur de règles | `Node`/signaux + GDScript ou **rules visuelles custom** | Système de signaux | Panneau de règles déclaratif (si/alors) qui **exporte vers le même format JSON** que `game-service` (rules-engine, cf. `contracts/`) — pas de logique dupliquée entre l'éditeur et le runtime serveur |
| Moteur d'événements | Signaux Godot natifs | Bus de signaux | Pont vers les événements standards AFG (`contracts/events`) |
| Moteur de variables | `Resource`/`ExportVariable` | Système d'export de propriétés | Bibliothèque de variables AFG (Score, Wallet Balance, IDC…) exposées comme types Godot |
| Moteur d'interfaces | Control nodes + Theme | Éditeur d'UI, thèmes | Thème AFG généré depuis `THEMES_REGISTRY` (`@shared/core`) |
| Moteur d'animations/audio/vidéo | AnimationPlayer, AudioStreamPlayer, VideoStreamPlayer | Moteurs complets | Intégration Mode Griot (narration/voix) |

**Aucun fork de Godot.** On utilise **GDExtension** (mécanisme stable depuis Godot 4.1+ pour charger du C++ natif comme plugin dans l'éditeur stock, sans recompiler le moteur) : le binaire Godot officiel reste inchangé, notre code C++ compile en bibliothèque partagée (`.so`/`.dll`/`.dylib`) chargée au démarrage de l'éditeur via `addon/afg_studio/afg_studio.gdextension`. Conséquence directe : les mises à jour de Godot (sécurité, perfs, nouvelles fonctionnalités) se récupèrent en changeant une version, pas en re-portant un fork.

## Ce que le C++ AFG ajoute par-dessus Godot

- **Client API** (`src/afg_api_client.*`) vers `studio-service`/`publishing-service`/`catalog-service`/`ai-service`/`governance-service` (HTTP/JSON, cf. `contracts/openapi`).
- **Ressources AFG** (`src/afg_project_resource.*`, etc.) : mapping typé des entités documentées dans `docs/modules/studio-service.md` §10 (`Project`, `Scene`, `Rule`, `Variable`, `Component`, `Template`, `AssetRef`…) vers des `Resource` Godot sérialisables.
- **Panneaux d'éditeur dédiés** (dock plugins) : générateurs IA (6, AFG-005 ch.20-25), marketplace (assets/mécaniques/IA/packs culturels), certification/badges (7 badges AFG-004 ch.43), collaboration/versioning (AFG-005 ch.26-29).
- **Export vers le pipeline de publication existant** : un projet exporté (`.pck`/web export Godot ou format AFG interchangeable) est soumis à `publishing-service` exactement comme un jeu créé au Studio web — un seul pipeline de validation/certification pour toute la plateforme (cf. `docs/modules/studio-service.md` §9).

## Arborescence

```text
apps/studio-editor-native/
├── CMakeLists.txt                  # build top-level (wrappe godot-cpp)
├── .gitmodules                     # vendored: godot-cpp (submodule officiel)
├── vcpkg.json                      # dependances C++ (cpp-httplib, nlohmann-json, Catch2)
├── third_party/
│   └── godot-cpp/                  # submodule git — bindings C++ officiels de Godot (MIT)
├── src/
│   ├── register_types.h/.cpp       # point d'entree GDExtension
│   ├── api/
│   │   ├── afg_api_client.h/.cpp   # client HTTP vers les services AFG (cf. contracts/openapi)
│   │   └── afg_auth.h/.cpp         # session/token (identity-service)
│   ├── resources/
│   │   ├── afg_project_resource.h/.cpp
│   │   ├── afg_scene_resource.h/.cpp
│   │   ├── afg_rule_resource.h/.cpp      # exporte au meme format JSON que game-service/rules-engine
│   │   └── afg_variable_resource.h/.cpp
│   ├── editor/
│   │   ├── afg_studio_dock.h/.cpp        # dock principal (EditorPlugin)
│   │   ├── afg_ai_generator_panel.h/.cpp # 6 generateurs IA (proxy ai-service)
│   │   ├── afg_marketplace_panel.h/.cpp  # assets/templates/mecaniques/IA/packs
│   │   ├── afg_certification_panel.h/.cpp # 7 badges AFG (proxy governance-service)
│   │   └── afg_collab_panel.h/.cpp       # commentaires/taches/versioning
│   └── rules/
│       └── afg_rules_engine_bridge.h/.cpp # logique pure, testee, partagee en intention avec game-service
├── addon/
│   └── afg_studio/
│       ├── plugin.cfg
│       └── afg_studio.gdextension
├── project/                        # projet Godot minimal (shell de l'editeur, branding AFG)
│   └── project.godot
├── tests/                          # Catch2 — logique pure (parsing regles, mapping ressources)
│   └── rules_resource.test.cpp
└── ROADMAP.md
```

## Build (une fois les submodules/dépendances récupérés)

```bash
git submodule update --init --recursive third_party/godot-cpp
cmake -B build -S .
cmake --build build --config Release
# copier build/libafg_studio.<ext> vers project/addon/afg_studio/bin/, cf. afg_studio.gdextension
```

Le projet `project/` s'ouvre ensuite avec l'éditeur **Godot officiel** (téléchargé depuis godotengine.org, non vendored ici) ; le GDExtension AFG se charge automatiquement.

## Dépendances open source (toutes permissives : MIT/Apache-2.0/zlib)

- **godot-cpp** (MIT) — bindings C++ officiels pour GDExtension.
- **cpp-httplib** (MIT) — client HTTP léger, header-only, pour `afg_api_client`.
- **nlohmann/json** (MIT) — sérialisation JSON, cohérent avec les contrats REST déjà en JSON côté backend.
- **Catch2** (BSL-1.0) — tests unitaires C++.

Voir la réponse "recommandations open source" pour la justification détaillée de ces choix et des alternatives.
