#include "afg_api_client.h"

#include <godot_cpp/core/class_db.hpp>

// TODO(Lot Studio natif #1) : cabler cpp-httplib + nlohmann::json ici.
// #include <httplib.h>
// #include <nlohmann/json.hpp>

using namespace godot;

void AfgApiClient::_bind_methods() {
    ClassDB::bind_method(D_METHOD("set_base_url", "base_url"), &AfgApiClient::set_base_url);
    ClassDB::bind_method(D_METHOD("get_base_url"), &AfgApiClient::get_base_url);
    ClassDB::bind_method(D_METHOD("set_access_token", "token"), &AfgApiClient::set_access_token);
    ClassDB::bind_method(D_METHOD("get", "path"), &AfgApiClient::get);
    ClassDB::bind_method(D_METHOD("post", "path", "body"), &AfgApiClient::post);

    ADD_PROPERTY(PropertyInfo(Variant::STRING, "base_url"), "set_base_url", "get_base_url");
}

AfgApiClient::AfgApiClient() {
    // Par defaut, gateway local (cf. docker-compose.yml, port 5000).
    base_url = "http://localhost:5000";
}

AfgApiClient::~AfgApiClient() {}

void AfgApiClient::set_base_url(const String &p_base_url) {
    base_url = p_base_url;
}

String AfgApiClient::get_base_url() const {
    return base_url;
}

void AfgApiClient::set_access_token(const String &p_token) {
    access_token = p_token;
}

Dictionary AfgApiClient::get(const String &p_path) {
    // Stub : brancher cpp-httplib::Client sur base_url + p_path, header Authorization: Bearer access_token.
    Dictionary result;
    result["status"] = 501;
    result["body"] = Dictionary();
    return result;
}

Dictionary AfgApiClient::post(const String &p_path, const Dictionary &p_body) {
    Dictionary result;
    result["status"] = 501;
    result["body"] = Dictionary();
    return result;
}
