#include "afg_variable_resource.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgVariableResource::_bind_methods() {
    ClassDB::bind_method(D_METHOD("set_variable_name", "name"), &AfgVariableResource::set_variable_name);
    ClassDB::bind_method(D_METHOD("get_variable_name"), &AfgVariableResource::get_variable_name);
    ClassDB::bind_method(D_METHOD("set_default_value", "value"), &AfgVariableResource::set_default_value);
    ClassDB::bind_method(D_METHOD("get_default_value"), &AfgVariableResource::get_default_value);
    ClassDB::bind_method(D_METHOD("set_bound_to_service", "bound"), &AfgVariableResource::set_bound_to_service);
    ClassDB::bind_method(D_METHOD("is_bound_to_service"), &AfgVariableResource::is_bound_to_service);

    ADD_PROPERTY(PropertyInfo(Variant::STRING, "variable_name"), "set_variable_name", "get_variable_name");
    ADD_PROPERTY(PropertyInfo(Variant::NIL, "default_value"), "set_default_value", "get_default_value");
    ADD_PROPERTY(PropertyInfo(Variant::BOOL, "bound_to_service"), "set_bound_to_service", "is_bound_to_service");
}

void AfgVariableResource::set_variable_name(const String &p_name) { variable_name = p_name; }
String AfgVariableResource::get_variable_name() const { return variable_name; }
void AfgVariableResource::set_default_value(const Variant &p_value) { default_value = p_value; }
Variant AfgVariableResource::get_default_value() const { return default_value; }
void AfgVariableResource::set_bound_to_service(bool p_bound) { bound_to_service = p_bound; }
bool AfgVariableResource::is_bound_to_service() const { return bound_to_service; }
