#ifndef AFG_VARIABLE_RESOURCE_H
#define AFG_VARIABLE_RESOURCE_H

#include <godot_cpp/classes/resource.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/variant.hpp>

namespace godot {

// Mirroir de `Variable` (docs/modules/studio-service.md §10) : Moteur de variables (AFG-005 ch.15).
// Bibliotheque prete a l'emploi : score, vie, temps, Jetons (Wallet Balance), IDC, etc.
class AfgVariableResource : public Resource {
    GDCLASS(AfgVariableResource, Resource)

protected:
    static void _bind_methods();

public:
    void set_variable_name(const String &p_name);
    String get_variable_name() const;
    void set_default_value(const Variant &p_value);
    Variant get_default_value() const;
    // true si branchee sur un service AFG (ex. "Wallet Balance" -> wallet-service) plutot que locale au projet.
    void set_bound_to_service(bool p_bound);
    bool is_bound_to_service() const;

private:
    String variable_name;
    Variant default_value;
    bool bound_to_service = false;
};

} // namespace godot

#endif // AFG_VARIABLE_RESOURCE_H
