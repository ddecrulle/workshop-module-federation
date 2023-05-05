---
marp: true
theme: gaia
paginate: true
author: Dylan Decrulle
---

<!--
_class: lead gaia
_footer: "https://ddecrulle.github.io/workshop-module-federation"
-->

# Création d'un Microfrontend avec Module Federation

![h:400](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/microfrontend.png)

---

# Microfrontend ?

➡️ Microservices

Définition :

> An architectural style where independently deliverable frontend applications are composed into a greater whole.
>
> _[Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)_

<!--
2011 Arrivée de l'architecture Microservices

Grand succès, sauf que cette architecture traite principalement d'aspect back-end.

2016 Première apparition du mot Microfrontend

Définition
-->

---

![bg 100%](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/MF.gif)

<!--
Avec le microfrontend il est possible d'avoir un écran découpé en plusieurs applications (de techno différentes ou non) qui discutent avec différents microfrontend (ou non)
-->

---

<!-- _class: lead gaia -->

![bg h:100%](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/routes.jpg)

<!--

On peut aussi imaginer un microfrontend ou c'est pas "l’écran" qui est découpé mais les différentes routes.

Web4g ?
-->

---

<!-- _class: lead -->

# Comment faire ?

- Avec Module Federation
- Avec des Web Components
- Avec des IFrames

---

<!-- _class: lead invert -->

# Webpack

![100%](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/webpack.gif)

---

# Module Federation

- Plugin Webpack (Webpack 5)
- Chargement asynchrone de modules distants (pas dans le code de l'application).
  - Le code est chargé dynamiquement à l'exécution, avec les **dépendances** si nécessaire.
- Plus large que le Microfrontend, peut aussi être utilisé côté backend

---

# Comment faire avec React ?

**Tout dépend de la façon dont on souhaite construire notre application !**

- En utilisant Webpack directement
- Create React App
- Create React App Rewired
- Vite
- Next

La documentation officielle fournie des [exemples](https://github.com/module-federation/module-federation-examples)

---

# Vite

<!-- _class: lead invert -->

Outil front-end JS pour améliorer la rapidité de développement avec une compilation optimisée pour la production.

|                                                      Webpack                                                       |                                                      Vite                                                       |
| :----------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
| ![width:500](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/webpack-bundle.png) | ![width:500](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/vite-bundle.png) |

<!--

La difference est essentiellement pour le dev. Il y a donc un changement de paradigme sur les serveurs de développements. Le temps de démarrage est très très rapide.


Pour le build en production, Vite utilise rollup (un module bundler comme webpack). Webpack est basé sur CommonJS quand rollup réfère à ES Module.
-->

---

# On commence ?

Toutes les ressources sont disponibles sur le dépôt github [ddecrulle/workshop-module-federation](https://github.com/ddecrulle/workshop-module-federation).

**Vous pouvez commencer par forker le dépôt.**

Le starter est très simple et contient essentiellement de la CI et des outils pour faire du monorepo.

---

# Création des projets

Créons 2 projets vite

```bash
yarn create vite
  # Project Name : host
  # Framework React/Typescript
```

```bash
yarn create vite
  # Project Name : remote
  # Framework React/Typescript
```

---

# Lancement des applications

```bash
npx lerna boostrap #Télécharge les dépendances
yarn dev #Lance les 2 applications
yarn build #Build les 2 applications
```

Fixons les ports de lancement, host : 5000, remote 5001.

```json
"scripts": {
   "dev": "vite --port 5000 --strictPort",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview --port 5000 --strictPort"
}
```

---

# Modification du Remote

Je vous propose de customiser le bouton du remote.

Pour ce faire créons un composant Button dans `components/Button.tsx` et importons le dans notre `App.tsx`.

---

Button.tsx

```tsx
import "./Button.css";

import { useState } from "react";

export const Button = () => {
  const [state, setState] = useState(0);
  return (
    <div>
      <button
        id="click-btn"
        className="shared-btn"
        onClick={() => setState((s) => s + 1)}
      >
        Click me: {state}
      </button>
    </div>
  );
};
```

---

Button.css

```css
.shared-btn {
  background-color: skyblue;
  border: 1px solid white;
  color: white;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  font-size: 18px;
}
```

---

Dans App.tsx remplaçons le bouton par celui que nous venons de créer

```tsx
import { Button } from "./components/Button"

...
{/* remplacer */}

<button onClick={() => setCount((count) => count + 1)}>
          count is {count}
</button>
{/* par */}

<Button />
```

Le code jusqu'à [cette étape](https://github.com/ddecrulle/workshop-module-federation/tree/step1).

---

# Configuration de Module Federation

Le plugin Vite : [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)

On ajoute la dépendance dans le projet racine car elle est commune à toutes les apps.

```bash
yarn add -D @originjs/vite-plugin-federation -W
```

---

# Configuration du build

Dans le vite.config.ts (des deux app)

```ts
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

---

# (Optionnel) TsconfigPath

```bash
yarn add -D vite-tsconfig-paths -W
```

```ts
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    ...,
    tsconfigPaths()
    ],
});

```

---

# Pour le remote

Cela se passe dans le fichier `vite.config.ts`

```ts
import federation from "@originjs/vite-plugin-federation";
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: { "./Button": "./src/components/Button.tsx" },
      shared: ["react", "react-dom"],
    }),
  ],
});
```

---

# Pour l'Host

```ts
import federation from "@originjs/vite-plugin-federation";
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
});
```

---

Import du bouton dans l'host

```ts
// Static import
import Button from "remoteApp/Button";
// Lazy import
const App = React.lazy(() => import("remoteApp/Button"));
```

Déclaration du type (pas optimal...)
fichier `custom.d.ts`

```ts
declare module "remoteApp/*";
```

```tsx
// Dans l'App.tsx
<Button />
```

---

# Lancement en local

```
yarn build
yarn serve
```

L'application host devrait inclure le bouton du remote !

http://localhost:5000

Le remote doit **absolument** utiliser le build lancé via `vite preview`. L'host peut être en mode développement `vite dev`

Le code jusqu'à [cette étape](https://github.com/ddecrulle/workshop-module-federation/tree/step2).

---

# Des améliorations

Variabiliser le passage de l'url du remote.

Créer un fichier .env

```
VITE_REMOTE_URL=http://localhost:5001
```

[Documentation officielle](https://vitejs.dev/guide/env-and-mode.html)

---

Dans le vite.config.ts

```ts
federation({
  name: "app",
  remotes: {
    remoteApp: {
      external: `Promise.resolve(import.meta.env["VITE_REMOTE_URL"] + "/assets/remoteEntry.js")`,
      externalType: "promise",
    },
  },
  shared: ["react", "react-dom"],
});
```

Ajouter `"baseUrl": "./src"` pour avoir des imports absolus (nécessite **tsConfigPath**).

---

# IntelliSense pour TypeScript

Pour activer l'IntelliSense sur les variables d'environnements, dans le fichier `vite-env.d.ts` ajouter :

```ts
interface ImportMetaEnv {
  readonly VITE_REMOTE_URL: string;
  // more env variables...
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Le code jusqu'à [cette étape](https://github.com/ddecrulle/workshop-module-federation/tree/step3).

---

# C'est cool mais partager un bouton ...

Autant faire une librairie (ou un système de design) !

Et si on ajoutait l'application remote sur la route `/remote` ?

---

# Créer le router dans l'host

```bash
lerna add react-router-dom --scope=host
```

```tsx
import { createBrowserRouter } from "react-router-dom";
import App from "App";
import RemoteApp from "remoteApp/RemoteApp";
export const router = createBrowserRouter([
  { path: "/remote", element: <RemoteApp /> },
  { path: "/", element: <App /> },
]);
```

---

# Utiliser le rooter

Dans main.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "routes/root";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

---

# Exposer l'app du remote

Dans vite.config.ts

```ts
exposes:
  {
    "./Button": "./src/components/Button.tsx",
    "./App": "./src/App.tsx",
  }
```

---

# On test

Comme tout à l'heure

```bash
yarn build
yarn serve
```

https://localhost:5000

Le code jusqu'à [cette étape](https://github.com/ddecrulle/workshop-module-federation/tree/step4).

---

![bg](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/remoteInHost.png)

---

# Quelques points de vigilances

- L'host importe dynamiquement les modules du remote. Il n'y a pas de contrôle sur ce qui est importé au build time. Par conséquent on peut découvrir des **erreurs au runtime** !
  - Bien définir des contrats d'interface !
- L'architecture monorepo est, je pense, à conseiller dans le cas d'un microfrontend. Il faut cependant un gitflow solide.

---

# Pour aller plus loin

- Nested Routes
  -  🔎 L'host et le remote ont un router
- Partager des états entre applications
- PWA 
  - Offline
- Paramétrage du serveur applicatif pour gérer les CORS
- Déploiement

---

# Ressources

- [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) par Martin Fowler
- Le site [Micro Frontends](https://micro-frontends.org/), tiré du livre [Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb)
- [Webpack 5 Module Federation : A game-changer in JavaScript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669) par Zack Jackson (le créateur de Module Federation)
- [The History of Microfrontends](https://levelup.gitconnected.com/the-history-of-microfrontends-a8e9e5e9a1d4)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Vite plugin Federation](https://github.com/originjs/vite-plugin-federation)
