#ifndef AFG_RULE_RESOURCE_H
#define AFG_RULE_RESOURCE_H

#include <godot_cpp/classes/resource.hpp>
#include <godot_cpp/variant/string.hpp>

namespace godot {

/**
 * Mirroir de `Rule` (docs/modules/studio-service.md §10) : regle visuelle du Moteur de regles
 * (AFG-005 ch.13, "si <condition> -> <action>"). `to_rules_engine_json()` produit EXACTEMENT le
 * format consomme par `services/game-service/src/rules-engine/` (cf. contracts/) : la meme regle
 * editee ici ou dans le Studio web s'execute a l'identique cote serveur, sans reimplementation.
 */
class AfgRuleResource : public Resource {
    GDCLASS(AfgRuleResource, Resource)

protected:
    static void _bind_methods();

public:
    void set_condition(const String &p_condition); // ex: "score >= 100"
    String get_condition() const;
    void set_action(const String &p_action); // ex: "unlock_level(next)"
    String get_action() const;

    // Stub : serialise vers le schema JSON partage avec game-service/rules-engine (contracts/).
    String to_rules_engine_json() const;

private:
    String condition;
    String action;
};

} // namespace godot

#endif // AFG_RULE_RESOURCE_H
