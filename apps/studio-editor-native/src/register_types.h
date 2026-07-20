#ifndef AFG_STUDIO_REGISTER_TYPES_H
#define AFG_STUDIO_REGISTER_TYPES_H

#include <godot_cpp/core/class_db.hpp>

// Point d'entree GDExtension (charge par project/addon/afg_studio/afg_studio.gdextension).
// cf. https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/gdextension_cpp_example.html
void initialize_afg_studio_module(godot::ModuleInitializationLevel p_level);
void uninitialize_afg_studio_module(godot::ModuleInitializationLevel p_level);

#endif // AFG_STUDIO_REGISTER_TYPES_H
