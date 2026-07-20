#include "afg_studio_dock.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgStudioDock::_bind_methods() {}

AfgStudioDock::AfgStudioDock() {}
AfgStudioDock::~AfgStudioDock() {}

void AfgStudioDock::_enter_tree() {
    // TODO(Lot Studio natif #1) : add_control_to_dock(DOCK_SLOT_RIGHT_UL, ...) pour chaque panneau
    // (AfgAiGeneratorPanel, AfgMarketplacePanel, AfgCertificationPanel, AfgCollabPanel).
}

void AfgStudioDock::_exit_tree() {
    // TODO : remove_control_from_docks(...) symetrique.
}
