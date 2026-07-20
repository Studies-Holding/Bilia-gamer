#ifndef AFG_CERTIFICATION_PANEL_H
#define AFG_CERTIFICATION_PANEL_H

#include <godot_cpp/classes/control.hpp>

namespace godot {

// Panneau des 7 badges AFG (AFG-004 ch.43, cf. docs/modules/governance-service.md §2bis) :
// Compatible / Gold / Education / Family / Heritage / Inclusive / Enterprise.
// Affiche l'eligibilite courante (POST /badges/:gameId/evaluate sur governance-service).
class AfgCertificationPanel : public Control {
    GDCLASS(AfgCertificationPanel, Control)

protected:
    static void _bind_methods();

public:
    void evaluate_badges(const String &p_project_id);
};

} // namespace godot

#endif // AFG_CERTIFICATION_PANEL_H
