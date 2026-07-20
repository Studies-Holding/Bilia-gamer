#include "afg_project_resource.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgProjectResource::_bind_methods() {
    ClassDB::bind_method(D_METHOD("set_project_id", "id"), &AfgProjectResource::set_project_id);
    ClassDB::bind_method(D_METHOD("get_project_id"), &AfgProjectResource::get_project_id);
    ClassDB::bind_method(D_METHOD("set_creator_id", "id"), &AfgProjectResource::set_creator_id);
    ClassDB::bind_method(D_METHOD("get_creator_id"), &AfgProjectResource::get_creator_id);
    ClassDB::bind_method(D_METHOD("set_creator_level", "level"), &AfgProjectResource::set_creator_level);
    ClassDB::bind_method(D_METHOD("get_creator_level"), &AfgProjectResource::get_creator_level);
    ClassDB::bind_method(D_METHOD("set_scene_ids", "ids"), &AfgProjectResource::set_scene_ids);
    ClassDB::bind_method(D_METHOD("get_scene_ids"), &AfgProjectResource::get_scene_ids);

    ADD_PROPERTY(PropertyInfo(Variant::STRING, "project_id"), "set_project_id", "get_project_id");
    ADD_PROPERTY(PropertyInfo(Variant::STRING, "creator_id"), "set_creator_id", "get_creator_id");
    ADD_PROPERTY(PropertyInfo(Variant::INT, "creator_level"), "set_creator_level", "get_creator_level");
    ADD_PROPERTY(PropertyInfo(Variant::ARRAY, "scene_ids"), "set_scene_ids", "get_scene_ids");
}

AfgProjectResource::AfgProjectResource() {}

void AfgProjectResource::set_project_id(const String &p_id) { project_id = p_id; }
String AfgProjectResource::get_project_id() const { return project_id; }

void AfgProjectResource::set_creator_id(const String &p_creator_id) { creator_id = p_creator_id; }
String AfgProjectResource::get_creator_id() const { return creator_id; }

void AfgProjectResource::set_creator_level(int p_level) { creator_level = p_level; }
int AfgProjectResource::get_creator_level() const { return creator_level; }

void AfgProjectResource::set_scene_ids(const Array &p_scene_ids) { scene_ids = p_scene_ids; }
Array AfgProjectResource::get_scene_ids() const { return scene_ids; }
