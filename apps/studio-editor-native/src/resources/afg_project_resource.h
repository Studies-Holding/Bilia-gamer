#ifndef AFG_PROJECT_RESOURCE_H
#define AFG_PROJECT_RESOURCE_H

#include <godot_cpp/classes/resource.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/string.hpp>

namespace godot {

/**
 * Mirroir typé de l'entite `Project` (docs/modules/studio-service.md §10).
 * Serialisable en `.tres` Godot ET synchronisable via AfgApiClient vers `studio-service`
 * (POST/PUT /projects) — meme id, meme forme de donnees des deux cotes (web/natif).
 */
class AfgProjectResource : public Resource {
    GDCLASS(AfgProjectResource, Resource)

protected:
    static void _bind_methods();

public:
    AfgProjectResource();

    void set_project_id(const String &p_id);
    String get_project_id() const;

    void set_creator_id(const String &p_creator_id);
    String get_creator_id() const;

    // Niveau createur (1-4, cf. docs/modules/studio-service.md §2) — determine les panneaux disponibles.
    void set_creator_level(int p_level);
    int get_creator_level() const;

    void set_scene_ids(const Array &p_scene_ids);
    Array get_scene_ids() const;

private:
    String project_id;
    String creator_id;
    int creator_level = 1;
    Array scene_ids;
};

} // namespace godot

#endif // AFG_PROJECT_RESOURCE_H
