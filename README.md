# CV JS

Un CV interactif moderne en JavaScript, HTML et CSS.

## Description
Ce projet est un CV web dynamique, initialement réalisé dans le cadre d'un cours puis adapté pour un usage personnel. Il met en avant l'utilisation de données structurées (JSON), le rendu DOM sans innerHTML, le thème dark/light, et des effets visuels modernes (glassmorphism).

## Fonctionnalités
- Affichage des infos, compétences, expériences, formations, centres d'intérêt
- Sidebar avec widget GitHub et contacts (icônes Remix Icon, liens cliquables)
- Calcul automatique de l'âge en années et jours
- Thème clair/sombre avec persistance (localStorage)
- Responsive design 
- Effets glassmorphism sur les cartes et badges
- Chargement dynamique des projets GitHub

## Installation
1. Clonez le repo :
   ```bash
   git clone https://github.com/MarineG404/cv_js.git
   ```
2. Lancez un serveur local (ex : Python)
   ```bash
   cd cv_js
   python3 -m http.server 8000
   ```
3. Ouvrez `http://localhost:8000` dans votre navigateur

## Structure du projet
```
cv_js/
├── index.html
├── styles.css
├── script.js
├── github.js
├── age-calculator.js
├── data.json
└── README.md
```

## Technologies
- JavaScript (ES6+)
- HTML5
- CSS3 (variables, grid, flex, glassmorphism)
- JSON
- Remix Icon (CDN)
- GitHub REST API

## Crédits
- Réalisé par Marine GONNORD
- Remix Icon : https://remixicon.com/

## Licence
Usage personnel, libre d'adaptation.
