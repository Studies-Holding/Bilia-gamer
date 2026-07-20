#include "afg_certification_panel.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgCertificationPanel::_bind_methods() {
    ClassDB::bind_method(D_METHOD("evaluate_badges", "project_id"), &AfgCertificationPanel::evaluate_badges);
}

// TODO(Lot Studio natif #4) : POST governance-service /badges/:gameId/evaluate, afficher le resultat.
void AfgCertificationPanel::evaluate_badges(const String &p_project_id) {}
