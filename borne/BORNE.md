# Borne Insert Koin — site d'essai

https://mauktenieb.github.io/borne/ : Insert Koin rangé dans une borne d'arcade. L'Insert Koin en ligne (dépôt `insertkoin`) reste intact.

- `tools/aspire-borne.sh` (racine du dépôt) copie les fichiers d'Insert Koin ici, puis lance `borne-build.py`. Sa page d'accueil devient `insertkoin.html`.
- `borne-build.py` fabrique `index.html` (la borne) depuis `insertkoin.html`, et `skoporhogo-borne.html` depuis `skoporhogo.html` ; il applique aussi les noms canoniques (FotoFauna, KorhoName) aux copies affichées.
- `borne-cabinet.css`, `borne-cabinet.js` : le meuble, l'écran 4:3, le panneau de boutons, le tilt, la porte à Koins, l'habit de chaque programme.
- `borne-skopo.js` : Skoporhogo à l'heure du visiteur, en temps réel, la journée des Masks rejouée depuis le matin.
- `borne-fauneye.html` : FaunEye, le lecteur universel : le stock de fac-similés, les fichiers du visiteur (PDF, EPUB, images, CBZ, texte), Internet Archive, Gutenberg, Wikisource, Google Books.
- `borne-lobby.json` : zones cliquables des 18 Masks sur l'image de l'écran titre, devant Korong!.

Les robots d'indexation passent leur chemin : `Disallow: /borne/` et `noindex` sur chaque page de la borne.
