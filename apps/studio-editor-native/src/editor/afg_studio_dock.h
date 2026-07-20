#ifndef AFG_STUDIO_DOCK_H
#define AFG_STUDIO_DOCK_H

#include <godot_cpp/classes/editor_plugin.hpp>

namespace godot {

/**
 * Point d'entree de l'editeur AFG dans Godot : ajoute le dock principal (onglets
 * Generateurs IA / Marketplace / Certification / Collaboration, cf. classes soeurs) et
 * l'inspecteur de proprietes AFG (AfgProjectResource, AfgRuleResource, ...).
 */
class AfgStudioDock : public EditorPlugin {
    GDCLASS(AfgStudioDock, EditorPlugin)

protected:
    static void _bind_methods();

public:
    AfgStudioDock();
    ~AfgStudioDock() override;

    void _enter_tree() override;
    void _exit_tree() override;
};

} // namespace godot

#endif // AFG_STUDIO_DOCK_H
