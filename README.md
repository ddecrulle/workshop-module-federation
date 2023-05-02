---
marp: true
theme: gaia
paginate: true
author: Dylan Decrulle
---

<!-- _class: lead gaia -->

# Création d'un Microfrontend avec Module Federation

![h:400](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/microfrontend.png)

---

# Microfrontend ?

➡️ Microservices

Définition :

> An architectural style where independently deliverable frontend applications are composed into a greater whole.

_Martin Fowler_

---

![bg 100%](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/MF.gif)

---

<!-- _class: lead gaia -->

![bg h:100%](https://raw.githubusercontent.com/ddecrulle/workshop-module-federation/slides/img/routes.jpg)

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
  - Le code est chargé dynamiquement à l'exécution avec les dépendances si nécessaires.

---

# Ressources

- [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) par Martin Fowler
- [The History of Microfrontends](https://levelup.gitconnected.com/the-history-of-microfrontends-a8e9e5e9a1d4)
