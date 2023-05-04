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
  - Le code est chargé dynamiquement à l'exécution, avec les **dépendances** si nécessaires.
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

```bash
yarn add -D @originjs/vite-plugin-federation -W
```

---

---

# Ressources

- [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) par Martin Fowler
- [Webpack 5 Module Federation : A game-changer in JavaScript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669) par Zack Jackson (le créateur de Module Federation)
- [The History of Microfrontends](https://levelup.gitconnected.com/the-history-of-microfrontends-a8e9e5e9a1d4)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Vite plugin Federation](https://github.com/originjs/vite-plugin-federation)
