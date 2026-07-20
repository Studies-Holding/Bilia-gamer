#ifndef AFG_MARKETPLACE_PANEL_H
#define AFG_MARKETPLACE_PANEL_H

#include <godot_cpp/classes/control.hpp>

namespace godot {

// Panneau marketplace creative (AFG-005 ch.34-40) : templates, assets, mecaniques, IA, packs
// culturels, scenarios, questions. Liste/achete via catalog-service, credite via payment/wallet
// (flux asynchrone, cf. docs/modules/studio-service.md §13).
class AfgMarketplacePanel : public Control {
    GDCLASS(AfgMarketplacePanel, Control)

protected:
    static void _bind_methods();

public:
    void refresh_listings(const String &p_category); // template | asset | mechanic | ai | culture-pack | scenario | question
    void import_into_project(const String &p_project_id, const String &p_listing_id);
};

} // namespace godot

#endif // AFG_MARKETPLACE_PANEL_H
