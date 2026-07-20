#include "afg_scene_resource.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgSceneResource::_bind_methods() {
    ClassDB::bind_method(D_METHOD("set_project_id", "id"), &AfgSceneResource::set_project_id);
    ClassDB::bind_method(D_METHOD("get_project_id"), &AfgSceneResource::get_project_id);
    ClassDB::bind_method(D_METHOD("set_scene_type", "type"), &AfgSceneResource::set_scene_type);
    ClassDB::bind_method(D_METHOD("get_scene_type"), &AfgSceneResource::get_scene_type);
    ClassDB::bind_method(D_METHOD("set_order", "order"), &AfgSceneResource::set_order);
    ClassDB::bind_method(D_METHOD("get_order"), &AfgSceneResource::get_order);

    ADD_PROPERTY(PropertyInfo(Variant::STRING, "project_id"), "set_project_id", "get_project_id");
    ADD_PROPERTY(PropertyInfo(Variant::STRING, "scene_type"), "set_scene_type", "get_scene_type");
    ADD_PROPERTY(PropertyInfo(Variant::INT, "order"), "set_order", "get_order");
}

void AfgSceneResource::set_project_id(const String &p_id) { project_id = p_id; }
String AfgSceneResource::get_project_id() const { return project_id; }
void AfgSceneResource::set_scene_type(const String &p_type) { scene_type = p_type; }
String AfgSceneResource::get_scene_type() const { return scene_type; }
void AfgSceneResource::set_order(int p_order) { order = p_order; }
int AfgSceneResource::get_order() const { return order; }
