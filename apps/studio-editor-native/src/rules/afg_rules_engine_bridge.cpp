#include "afg_rules_engine_bridge.h"

namespace afg {

bool RulesEngineBridge::validate(const RuleDefinition &rule) {
    // Stub minimal : une regle est valide si condition et action sont non vides.
    // TODO(Lot Studio natif #2) : grammaire partagee avec rules-engine/rules.types.ts (contracts/).
    return !rule.condition.empty() && !rule.action.empty();
}

bool RulesEngineBridge::evaluate_preview(const RuleDefinition &rule, const std::string &state_json) {
    // Stub : previsualisation uniquement, jamais utilise pour l'execution reelle (server-authoritative).
    (void)state_json;
    return validate(rule);
}

} // namespace afg
