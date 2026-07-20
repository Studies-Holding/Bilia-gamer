#ifndef AFG_COLLAB_PANEL_H
#define AFG_COLLAB_PANEL_H

#include <godot_cpp/classes/control.hpp>

namespace godot {

// Panneau collaboration & versioning (AFG-005 ch.26-29) : commentaires contextuels, taches,
// versions/branches. Cf. docs/modules/studio-service.md §7 et §10 (Comment, Task, ProjectVersion).
class AfgCollabPanel : public Control {
    GDCLASS(AfgCollabPanel, Control)

protected:
    static void _bind_methods();

public:
    void post_comment(const String &p_project_id, const String &p_target_ref, const String &p_text);
    void create_version(const String &p_project_id);
    void create_branch(const String &p_project_id, const String &p_branch_name);
};

} // namespace godot

#endif // AFG_COLLAB_PANEL_H
