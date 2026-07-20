#include <catch2/catch_test_macros.hpp>

#include "rules/afg_rules_engine_bridge.h"

TEST_CASE("RulesEngineBridge::validate rejette une regle incomplete", "[rules]") {
    afg::RuleDefinition incomplete{"", "unlock_level(next)"};
    REQUIRE_FALSE(afg::RulesEngineBridge::validate(incomplete));
}

TEST_CASE("RulesEngineBridge::validate accepte une regle complete", "[rules]") {
    afg::RuleDefinition complete{"score >= 100", "unlock_level(next)"};
    REQUIRE(afg::RulesEngineBridge::validate(complete));
}
