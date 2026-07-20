#include "afg_marketplace_panel.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgMarketplacePanel::_bind_methods() {
    ClassDB::bind_method(D_METHOD("refresh_listings", "category"), &AfgMarketplacePanel::refresh_listings);
    ClassDB::bind_method(D_METHOD("import_into_project", "project_id", "listing_id"), &AfgMarketplacePanel::import_into_project);
}

// TODO(Lot Studio natif #4) : GET catalog-service (assets/templates/marketplace), import local.
void AfgMarketplacePanel::refresh_listings(const String &p_category) {}
void AfgMarketplacePanel::import_into_project(const String &p_project_id, const String &p_listing_id) {}
