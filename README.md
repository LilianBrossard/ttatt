# TTATT

Bienvenue sur le dépôt du projet **TTATT**. Ce projet est une application web moderne (type single-page / portfolio) développée avec **Next.js 16 (App Router)** et un backend Headless CMS (**Hygraph**) pour la gestion dynamique du contenu.

## 🚀 Technologies utilisées

- **Framework** : [Next.js 16](https://nextjs.org/) (React 19)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS** : [Hygraph](https://hygraph.com/) (GraphQL)
- **Composants UI** : [Shadcn UI](https://ui.shadcn.com/) / Radix UI
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Cartographie** : [Leaflet](https://leafletjs.com/) & React-Leaflet
- **Carrousel** : [Embla Carousel](https://www.embla-carousel.com/)

## ✨ Fonctionnalités principales

- **Navigation Single-Page** : Navigation fluide entre les différentes sections (Accueil, Projets, Agenda, Contact) avec un effet de défilement personnalisé sur desktop et un menu burger sur mobile.
- **Contenu Dynamique** : Toutes les données (projets, événements de l'agenda, informations de contact, mentions légales) sont administrées depuis l'interface Hygraph et récupérées via l'API GraphQL.
- **Composants Interactifs** : Carrousel d'images pour les projets (design responsive "Flower"), cartes d'événements interactives, et carte géographique avec Leaflet pour la page contact.
- **Responsive Design** : L'interface s'adapte parfaitement à tous les types d'écrans (Mobile, Tablette, Desktop).

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (version 20+ recommandée)
- Un gestionnaire de paquets (`npm`, `yarn`, `pnpm` ou `bun`). Le projet utilise `pnpm` par défaut.

## 📦 Installation et démarrage local

1. **Cloner le dépôt :**
   ```bash
   git clone <url-du-depot>
   cd ttatt
   ```

2. **Installer les dépendances :**
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement :**
   Créez un fichier `.env` ou `.env.local` à la racine du projet et ajoutez-y les variables suivantes (nécessaires pour le CMS et la carte) :
   ```env
   HYGRAPH_TOKEN=votre_token_hygraph
   GEOAPIFY_TOKEN=votre_token_geoapify
   ```

4. **Lancer le serveur de développement :**
   ```bash
   pnpm dev
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🗂️ Structure du projet

- `app/` : Routes et configuration principale (Next.js App Router).
- `components/` : Composants React.
  - `components/section/` : Sections principales du site (Accueil, Projets, Agenda, Contact, Footer).
  - `components/ui/` : Composants UI réutilisables (Shadcn UI).
- `lib/` : Fonctions utilitaires, clients API et requêtes GraphQL vers Hygraph.
- `public/` : Ressources statiques (images, icônes, polices, etc.).

## 📜 Scripts disponibles

- `pnpm dev` : Lance le serveur de développement.
- `pnpm build` : Compile l'application en vue d'un déploiement en production.
- `pnpm start` : Démarre le serveur de production (après le build).
- `pnpm lint` : Exécute ESLint pour l'analyse du code source.

---
*Projet développé par Lilian Brossard.*
