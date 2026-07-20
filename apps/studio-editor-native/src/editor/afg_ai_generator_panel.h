#ifndef AFG_AI_GENERATOR_PANEL_H
#define AFG_AI_GENERATOR_PANEL_H

#include <godot_cpp/classes/control.hpp>

namespace godot {

/**
 * Panneau des 6 generateurs IA (AFG-005 ch.20-25) : jeu, niveaux, questions, illustrations,
 * personnages, dialogues — plus le Copilote IA (ch.45). Appelle ai-service via AfgApiClient.
 */
class AfgAiGeneratorPanel : public Control {
    GDCLASS(AfgAiGeneratorPanel, Control)

protected:
    static void _bind_methods();

public:
    // Un signal par generateur, cf. docs/modules/studio-service.md §11 (routes /ai/generate-*).
    void request_generate_game(const String &p_prompt);
    void request_generate_level(const String &p_prompt);
    void request_generate_questions(const String &p_prompt);
    void request_generate_illustration(const String &p_prompt);
    void request_generate_character(const String &p_prompt);
    void request_generate_dialogue(const String &p_prompt);
};

} // namespace godot

#endif // AFG_AI_GENERATOR_PANEL_H
