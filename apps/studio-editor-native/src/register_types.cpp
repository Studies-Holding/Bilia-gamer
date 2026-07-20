#include "register_types.h"

#include "api/afg_api_client.h"
#include "editor/afg_ai_generator_panel.h"
#include "editor/afg_certification_panel.h"
#include "editor/afg_collab_panel.h"
#include "editor/afg_marketplace_panel.h"
#include "editor/afg_studio_dock.h"
#include "resources/afg_project_resource.h"
#include "resources/afg_rule_resource.h"
#include "resources/afg_scene_resource.h"
#include "resources/afg_variable_resource.h"

#include <godot_cpp/core/defs.hpp>
#include <godot_cpp/godot.hpp>

using namespace godot;

void initialize_afg_studio_module(ModuleInitializationLevel p_level) {
    if (p_level != MODULE_INITIALIZATION_LEVEL_SCENE) {
        return;
    }

    // Ressources AFG (mapping des entites studio-service, cf. docs/modules/studio-service.md §10).
    ClassDB::register_class<AfgProjectResource>();
    ClassDB::register_class<AfgSceneResource>();
    ClassDB::register_class<AfgRuleResource>();
    ClassDB::register_class<AfgVariableResource>();

    // Client API vers les services AFG (studio/publishing/catalog/ai/governance).
    ClassDB::register_class<AfgApiClient>();

    // Panneaux d'editeur (EditorPlugin), inities uniquement en contexte editeur.
    if (p_level == MODULE_INITIALIZATION_LEVEL_EDITOR) {
        ClassDB::register_class<AfgStudioDock>();
        ClassDB::register_class<AfgAiGeneratorPanel>();
        ClassDB::register_class<AfgMarketplacePanel>();
        ClassDB::register_class<AfgCertificationPanel>();
        ClassDB::register_class<AfgCollabPanel>();
        EditorPlugins::add_by_type<AfgStudioDock>();
    }
}

void uninitialize_afg_studio_module(ModuleInitializationLevel p_level) {
    if (p_level != MODULE_INITIALIZATION_LEVEL_SCENE) {
        return;
    }
}

extern "C" {
// Symbole d'entree declare dans afg_studio.gdextension.
GDExtensionBool GDE_EXPORT afg_studio_library_init(
    GDExtensionInterfaceGetProcAddress p_get_proc_address,
    GDExtensionClassLibraryPtr p_library,
    GDExtensionInitialization *r_initialization) {
    godot::GDExtensionBinding::InitObject init_obj(p_get_proc_address, p_library, r_initialization);

    init_obj.register_initializer(initialize_afg_studio_module);
    init_obj.register_terminator(uninitialize_afg_studio_module);
    init_obj.set_minimum_library_initialization_level(MODULE_INITIALIZATION_LEVEL_SCENE);

    return init_obj.init();
}
}
