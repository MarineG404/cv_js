# CV JS, notes projet

CV web dynamique (JS vanilla, sans framework), rendu depuis `data/data.json`, exportable en PDF A4 via le bouton "Imprimer PDF" (`window.print()`).

## Structure réelle (différente du README avant mise à jour)

```
cv_js/
├── index.html
├── data/
│   ├── data.json       # contenu du CV (source unique consommée par script.js)
│   └── projects.json   # snapshot généré des repos github/gitlab/framagit, PAS consommé par le site (juste une note de référence pour choisir les projets à afficher)
├── js/
│   ├── script.js        # fetch('../data/data.json') + rendu DOM complet
│   ├── github.js        # section "Projets Personnels", liste blanche codée en dur (wantedRepos)
│   └── age-calculator.js
├── styles/
│   ├── styles.css       # thème light/dark, layout web
│   └── print.css        # layout PDF A4, une seule page forcée
└── pdf/                  # exports PDF historiques (pas générés automatiquement)
```

Le `fetch('../data/data.json')` dans `script.js` fonctionne bien depuis `index.html` à la racine : la résolution d'URL relative plafonne au root du domaine, donc `../data/data.json` retombe sur `/data/data.json`. Pas un bug, vérifié.

## Contrainte critique : le CV PDF DOIT tenir sur une seule page A4

`styles/print.css` force `#cv`, `#sidebar`, `#main` à `height: 297mm` + `overflow: hidden`. **Tout contenu qui dépasse est silencieusement invisible, pas renvoyé sur une page 2.** Pas d'avertissement visuel dans le navigateur si on ajoute trop de contenu (formations, missions, projets...).

Avant tout ajout de contenu dans `data.json` (nouvelle expérience, formation, mission), vérifier que ça tient toujours en une page :

```bash
python3 -m http.server 8791 &   # depuis la racine du repo
google-chrome --headless --disable-gpu --no-sandbox \
  --print-to-pdf=/tmp/cv.pdf --print-to-pdf-no-header \
  --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
  http://localhost:8791/
pdftoppm -png -r 150 /tmp/cv.pdf /tmp/cv_page   # puis lire /tmp/cv_page-1.png pour vérifier visuellement
```

`pdftotext -layout` seul peut suffire pour un check rapide de contenu manquant, mais ne fie pas au layout texte pour détecter un chevauchement visuel (le footer `#pdf-footer` est en `position: fixed; top: 290mm` et peut chevaucher un contenu trop proche du bas) : dans ce cas, screenshot obligatoire.

Leviers pour gagner de la place, par ordre de préférence (aucun ne doit tronquer silencieusement du texte, ex. `text-overflow: ellipsis` refusé par Marine sur les formations) :
1. Resserrer les variables d'espacement (`--section-gap`, `--title-spacing`, `--card-gap`, `--main-padding-bottom`) dans `:root` de `print.css`.
2. Raccourcir le texte réel dans `data.json` (missions de stage courtes en particulier).
3. En dernier recours seulement : retirer un projet perso ou une expérience.

## Section "Projets Personnels"

`js/github.js` a une liste blanche codée en dur `wantedRepos` (actuellement `["Fokuz", "ADHDragon"]`). Le choix des projets affichés est un choix éditorial de Marine, pas un critère automatique (stars, date, etc.) : proposer des candidats via `data/projects.json` mais toujours faire valider le choix plutôt que remplacer soi-même.

## Compétences (`data.json` → `skills`)

Chaque compétence doit être justifiable par un repo public (voir `projects.json`) ou une expérience pro décrite dans `professionalExperiences`. Audit fait le 2026-08-07 : `C#` retiré (aucune trace nulle part). `Windows`/`Wireshark`/`Cisco` gardés bien que sans preuve récente (rattachables au BTS SNIR 2022-2024) sur décision de Marine. `C++` gardé malgré une preuve faible (repo privé `Mocapia-server`, langage secondaire) car projet Arduino à venir.
