#ifndef AFG_RULES_ENGINE_BRIDGE_H
#define AFG_RULES_ENGINE_BRIDGE_H

#include <string>
#include <vector>

namespace afg {

/**
 * Logique PURE (aucune dependance Godot) — testable en isolation via Catch2 (tests/rules_resource.test.cpp).
 * Reproduit en C++ les invariants de services/game-service/src/rules-engine (modules purs TS, cf.
 * docs/modules/game-service.md §7) pour permettre une PREVISUALISATION fidele dans l'editeur natif
 * avant publication — la source de verite pour l'execution reste toujours le serveur (game-service).
 */
struct RuleDefinition {
    std::string condition;
    std::string action;
};

class RulesEngineBridge {
public:
    // Valide qu'une regle est syntaxiquement coherente (stub — grammaire a definir, cf. contracts/).
    static bool validate(const RuleDefinition &rule);

    // Simule l'evaluation d'une regle contre un etat simplifie (previsualisation editeur uniquement).
    static bool evaluate_preview(const RuleDefinition &rule, const std::string &state_json);
};

} // namespace afg

#endif // AFG_RULES_ENGINE_BRIDGE_H
