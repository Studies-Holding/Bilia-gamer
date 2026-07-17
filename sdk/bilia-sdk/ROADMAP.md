# Roadmap — bilia-sdk

(cf. docs/modules/shared-and-sdk.md §B)

1. **Fait (Lot 0/amorce) :** client (auth/transport) + modules `player`/`session`/`save`/`payment`/`notifications`
   — wrappers HTTP typés vers le `gateway`, contrat posé avant l'implémentation serveur.
2. Abstraction rendu Babylon + réseau (socket + geckos) + snapshot interpolation, pour les jeux qui en ont besoin
   (avec `realtime-service`, Lot 3, cf. AFG-DT-005).
3. (P2) Abstraction physique (Havok/Rapier) + prédiction/réconciliation ; succès, classements, amis, chat,
   tournois, analytics, localisation.
4. (P3) IA, Égaliseur, Griot, IDC, traduction, assistant de conception.
