#ifndef AFG_SCENE_RESOURCE_H
#define AFG_SCENE_RESOURCE_H

#include <godot_cpp/classes/resource.hpp>
#include <godot_cpp/variant/string.hpp>

namespace godot {

// Mirroir de `Scene` (docs/modules/studio-service.md §10) : ecran/etape du jeu (moteur de scenes, AFG-005 ch.12).
class AfgSceneResource : public Resource {
    GDCLASS(AfgSceneResource, Resource)

protected:
    static void _bind_methods();

public:
    void set_project_id(const String &p_id);
    String get_project_id() const;
    void set_scene_type(const String &p_type); // accueil | menu | tutoriel | niveau | boutique | ...
    String get_scene_type() const;
    void set_order(int p_order);
    int get_order() const;

private:
    String project_id;
    String scene_type;
    int order = 0;
};

} // namespace godot

#endif // AFG_SCENE_RESOURCE_H
