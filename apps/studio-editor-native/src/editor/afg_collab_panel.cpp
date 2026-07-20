#include "afg_collab_panel.h"

#include <godot_cpp/core/class_db.hpp>

using namespace godot;

void AfgCollabPanel::_bind_methods() {
    ClassDB::bind_method(D_METHOD("post_comment", "project_id", "target_ref", "text"), &AfgCollabPanel::post_comment);
    ClassDB::bind_method(D_METHOD("create_version", "project_id"), &AfgCollabPanel::create_version);
    ClassDB::bind_method(D_METHOD("create_branch", "project_id", "branch_name"), &AfgCollabPanel::create_branch);
}

// TODO(Lot Studio natif #5) : POST studio-service /projects/:id/comments, /versions, /branches.
void AfgCollabPanel::post_comment(const String &p_project_id, const String &p_target_ref, const String &p_text) {}
void AfgCollabPanel::create_version(const String &p_project_id) {}
void AfgCollabPanel::create_branch(const String &p_project_id, const String &p_branch_name) {}
