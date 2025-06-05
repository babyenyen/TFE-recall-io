# Recall.io – Plateforme TFE

**Recall.io** est une plateforme web responsive dédiée aux étudiants. Elle permet de centraliser la prise de notes, de générer automatiquement des flashcards et des quiz personnalisés grâce à une intelligence artificielle (Gemini API), et d'organiser efficacement ses fichiers et dossiers d'étude.

---

## 📁 Arborescence du projet

src/
├── api/ # Fonctions liées à l'IA (génération de quiz/flashcards)
│ └── api.js
├── assets/
│ └── animations/ # Loader animé exporté de After Effects en Lottie
├── components/
│ ├── common/ # Logos (Icon, Full, Small), Breadcrumb
│ ├── editor/ # Editor, Toolbar, thème d'édition
│ ├── flashcards/ # Composant Flashcard
│ ├── quiz/ # QuizDisplay, QuizSelector
│ ├── sidebar/ # Sidebar principale
│ └── ui/ # Composants Shadcn (Button, AlertDialog, etc.)
├── hooks/ # Hooks personnalisés : useItems, useToast
├── layout/ # Layout global (MainLayout.jsx)
├── utils/ # Fonctions utilitaires globales (utils, textUtils)

---

## 🌐 Routing

Le projet utilise **React Router DOM** pour une navigation fluide entre les différentes pages :

- `/dashboard`, `/favorites`, `/notes`, `/trash` → pages principales
- `/folder/:id` et `/file/:id` → pages dynamiques pour les dossiers et fichiers
- `/quiz/:id` et `/flashcards/:id` → pages de révision générées à partir d’un fichier

Un système de **breadcrumb** dynamique est utilisé pour faciliter la navigation dans les dossiers imbriqués.

---

## ⚙️ Technologies utilisées

- **React** : architecture principale, composants dynamiques
- **Tailwind CSS** : style utilitaire moderne et responsive
- **Shadcn UI** : composants réutilisables avec design accessible et épuré
- **Lucide Icons** : icônes SVG modernes
- **Lottie** : pour animer le loader personnalisé
- **React Router DOM** : gestion des routes
- **LocalStorage** : stockage temporaire des données utilisateur

---

## 🤖 IA – Gemini API

La génération des quiz et flashcards est assurée par **Gemini API**. Les préférences de l'utilisateur (QCM, QRM) sont transmises via `Toolbar.jsx`, traitées dans `api.js`, puis affichées dans les composants `QuizDisplay.jsx` ou `Flashcard.jsx`.

---

## 🔐 Environnement & sécurité

Un fichier `.env` contient les variables sensibles comme la clé API :

```env
REACT_APP_GEMINI_API_KEY=ta-cle-api
```

> Ce fichier est ignoré dans Git pour éviter toute exposition publique des données sensibles. Voir `.gitignore` ci-dessous.

---

## 🎞️ Animation Lottie (loader)

L’animation de chargement est un fichier .json exporté depuis After Effects via le plugin Bodymovin, puis intégré à l’application via une librairie Lottie React. Elle est utilisée lors de la génération IA pour indiquer que le contenu est en cours de création.

---

## 📌 Auteur

Projet réalisé par Claire Nguyen dans le cadre de son Travail de Fin d’Études en développement web.
