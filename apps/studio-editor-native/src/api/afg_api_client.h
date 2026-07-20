#ifndef AFG_API_CLIENT_H
#define AFG_API_CLIENT_H

#include <godot_cpp/classes/ref_counted.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/dictionary.hpp>

namespace godot {

/**
 * Client HTTP vers les services AFG consommes par l'editeur natif :
 *   - studio-service   (projets, composants, templates, assets, sandbox, tests, publication)
 *   - publishing-service (soumission finale)
 *   - catalog-service  (marketplace, recherche de composants publies)
 *   - ai-service       (6 generateurs IA + copilote, cf. docs/modules/studio-service.md §6)
 *   - governance-service (evaluation des 7 badges AFG, cf. docs/modules/governance-service.md §2bis)
 *
 * Implementation de reference : cpp-httplib (MIT) pour le transport, nlohmann::json pour le payload.
 * Le contrat REST est celui documente dans contracts/openapi (source de verite partagee avec le
 * Studio web) — aucune divergence d'API entre les deux clients (web/natif).
 */
class AfgApiClient : public RefCounted {
    GDCLASS(AfgApiClient, RefCounted)

protected:
    static void _bind_methods();

public:
    AfgApiClient();
    ~AfgApiClient() override;

    void set_base_url(const String &p_base_url);
    String get_base_url() const;

    void set_access_token(const String &p_token);

    // Retourne un Dictionary { "status": int, "body": Variant } — stub, a cabler sur cpp-httplib.
    Dictionary get(const String &p_path);
    Dictionary post(const String &p_path, const Dictionary &p_body);

private:
    String base_url;
    String access_token;
};

} // namespace godot

#endif // AFG_API_CLIENT_H
