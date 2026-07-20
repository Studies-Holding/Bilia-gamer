#include "afg_ai_generator_panel.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgAiGeneratorPanel::_bind_methods() {
    ClassDB::bind_method(D_METHOD("request_generate_game", "prompt"), &AfgAiGeneratorPanel::request_generate_game);
    ClassDB::bind_method(D_METHOD("request_generate_level", "prompt"), &AfgAiGeneratorPanel::request_generate_level);
    ClassDB::bind_method(D_METHOD("request_generate_questions", "prompt"), &AfgAiGeneratorPanel::request_generate_questions);
    ClassDB::bind_method(D_METHOD("request_generate_illustration", "prompt"), &AfgAiGeneratorPanel::request_generate_illustration);
    ClassDB::bind_method(D_METHOD("request_generate_character", "prompt"), &AfgAiGeneratorPanel::request_generate_character);
    ClassDB::bind_method(D_METHOD("request_generate_dialogue", "prompt"), &AfgAiGeneratorPanel::request_generate_dialogue);
}

// TODO(Lot Studio natif #3) : chaque methode poste vers ai-service (POST /projects/:id/ai/generate-*,
// cf. docs/modules/studio-service.md §11) via AfgApiClient et applique le resultat au projet ouvert.
void AfgAiGeneratorPanel::request_generate_game(const String &p_prompt) {}
void AfgAiGeneratorPanel::request_generate_level(const String &p_prompt) {}
void AfgAiGeneratorPanel::request_generate_questions(const String &p_prompt) {}
void AfgAiGeneratorPanel::request_generate_illustration(const String &p_prompt) {}
void AfgAiGeneratorPanel::request_generate_character(const String &p_prompt) {}
void AfgAiGeneratorPanel::request_generate_dialogue(const String &p_prompt) {}
