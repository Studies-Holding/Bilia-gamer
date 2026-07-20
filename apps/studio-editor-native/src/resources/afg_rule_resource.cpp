#include "afg_rule_resource.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgRuleResource::_bind_methods() {
    ClassDB::bind_method(D_METHOD("set_condition", "condition"), &AfgRuleResource::set_condition);
    ClassDB::bind_method(D_METHOD("get_condition"), &AfgRuleResource::get_condition);
    ClassDB::bind_method(D_METHOD("set_action", "action"), &AfgRuleResource::set_action);
    ClassDB::bind_method(D_METHOD("get_action"), &AfgRuleResource::get_action);
    ClassDB::bind_method(D_METHOD("to_rules_engine_json"), &AfgRuleResource::to_rules_engine_json);

    ADD_PROPERTY(PropertyInfo(Variant::STRING, "condition"), "set_condition", "get_condition");
    ADD_PROPERTY(PropertyInfo(Variant::STRING, "action"), "set_action", "get_action");
}

void AfgRuleResource::set_condition(const String &p_condition) { condition = p_condition; }
String AfgRuleResource::get_condition() const { return condition; }
void AfgRuleResource::set_action(const String &p_action) { action = p_action; }
String AfgRuleResource::get_action() const { return action; }

String AfgRuleResource::to_rules_engine_json() const {
    // TODO(Lot Studio natif #2) : brancher nlohmann::json + le schema reel de contracts/events.
    // Format cible (a synchroniser avec services/game-service/src/rules-engine/rules.types.ts) :
    //   { "condition": "...", "action": "..." }
    String json = "{\"condition\":\"" + condition + "\",\"action\":\"" + action + "\"}";
    return json;
}
