# MAJOIE

Une expérience web personnelle et immersive — HTML5, CSS3 et JavaScript vanilla, sans framework, sans backend, sans collecte de données.

Le site se parcourt comme une histoire en sept étapes :

1. **Accueil** — une invitation à entrer
2. **Majoie** — le prénom révélé lettre par lettre, avec une carte interactive
3. **Dziedzom** — le même prénom dans sa langue, dans une ambiance bordeaux intime
4. **Joy** — une rupture lumineuse, en anglais
5. **Portrait** — la photo mise en scène (clic pour agrandir)
6. **La lettre** — un message qui apparaît lentement au défilement
7. **Finale** — les trois noms, l'un après l'autre

## Structure

```
majoie/
├── index.html          # toutes les sections (contenus textuels des étapes 3-7)
├── css/
│   └── style.css       # palette, typographies, animations, responsive
├── js/
│   └── script.js       # CONFIG en haut : prénoms, textes des lettres, timings
└── assets/
    ├── images/
    │   └── majoie.jpg  # la photo (ratio 3:4 portrait)
    ├── audio/          # éventuelle musique (aucune par défaut)
    └── fonts/          # polices auto-hébergées éventuelles
```

## Personnaliser

### La photo

Déposez l'image dans `assets/images/` et nommez-la `majoie.jpg` (ou modifiez le chemin dans `index.html`, section `#portrait` — la même image est utilisée pour la lightbox). Le cadrage (`object-position`) et le ratio se règlent dans `.frame img` de `style.css`.

### Les textes

- Accueil, Dziedzom, Joy, Portrait, Lettre, Finale : directement dans `index.html`.
- Les six textes de l'acrostiche MAJOIE (M–A–J–O–I–E) : dans `js/script.js`, objet `CONFIG.letters`.

### Les prénoms

Modifiez les `<h1>`, `<h2>` et `.final-name` dans `index.html`.

### Les couleurs

Toutes les variables sont regroupées en haut de `css/style.css` (`:root`) : `--ink`, `--bordeaux`, `--rose`, `--cream`, `--gold`.

### Les animations

Timings et contenu dans `CONFIG` (`js/script.js`). `prefers-reduced-motion` est respecté automatiquement.

## Lancer en local

Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
cd majoie
python -m http.server 8000
# puis http://localhost:8000
```

## Déployer sur GitHub Pages

1. Créez un dépôt GitHub et poussez le contenu du dossier `majoie/` à la racine.
2. Dans **Settings → Pages**, choisissez *Deploy from a branch* → branche `main`, dossier `/ (root)`.
3. Le site sera disponible à `https://<votre-compte>.github.io/<nom-du-depot>/` — tous les chemins sont relatifs, donc le sous-chemin fonctionne sans configuration.

## Notes

- Aucune donnée n'est collectée, aucun compte requis, aucun backend.
- La musique est optionnelle : placez un fichier audio dans `assets/audio/` et ajoutez un lecteur discret si besoin — rien ne démarre automatiquement.
- Accessibilité : navigation clavier, contrastes vérifiés, `prefers-reduced-motion` géré, lightbox accessible (Échap pour fermer).
