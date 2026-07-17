# bilia-sdk

SDK client des jeux : identité joueur, parties, sauvegardes, paiement, notifications — amorce MVP (Lot 3, cf.
AFG-DT-003). Les briques moteur optionnelles (rendu Babylon.js, réseau geckos.io/Socket.io, cf. AFG-DT-005) et les
modules P2/P3 arrivent plus tard, voir [ROADMAP.md](./ROADMAP.md).

```ts
import { createBiliaSdk } from 'bilia-sdk'

const sdk = createBiliaSdk({ baseUrl: 'http://localhost:5000', getAccessToken: () => myToken })
await sdk.session.create(gameId)
```

Voir `docs/modules/shared-and-sdk.md` §B.
