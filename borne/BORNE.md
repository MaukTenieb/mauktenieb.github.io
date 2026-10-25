# Borne Insert Koin, site d'essai

https://mauktenieb.github.io/borne/ range Insert Koin dans une borne d'arcade. L'Insert Koin en ligne (dépôt `insertkoin`) reste intact.

## Fabrication
- `tools/aspire-borne.sh` (racine du dépôt) copie les fichiers d'Insert Koin ici, puis lance `borne-build.py`. Sa page d'accueil devient `insertkoin.html`.
- `borne-build.py` fabrique `index.html` (la borne) depuis `insertkoin.html` et `skoporhogo-borne.html` depuis `skoporhogo.html`. Il pose les crochets de la borne (`window.__ik`, `__borneGo`, `__borneHome`, `__borneGame`, `__borneBoom`), applique les noms canoniques (FotoFauna, KorhoName, SkopoRhogo), le plafond de 99 et les retouches de la grammaire commune aux copies affichées.

## Le meuble, de haut en bas
- Toit : une plante qui suit les mois du calendrier républicain ; au survol, EAU, SOLEIL, TAILLE l'entretiennent ; la caméra Kapture.
- Fronton : l'enseigne entre deux haut-parleurs ; Motel Sound joue dès l'arrivée, son coupé, une cloche barrée ouvre le son.
- Écran d'attente : une des vingt-sept images de Mauk Tenieb (attente-01 à attente-27), au hasard, le temps que la borne se monte.
- Cadre : l'enseigne Burrows, éclairée, au-dessus de l'écran ; l'autocollant Lore collé de travers au coin ; sous l'écran, les Koins et la dynamite Baku Boom (le mot BAKU BOOM s'allume à l'activation) ; dans un programme, la manette en miroir.
- Écran : les Koins en haut à gauche à l'accueil, avec le décompte de la Koin gratuite à zéro ; SkopoRhogo à la minute exacte de l'heure du visiteur ; chaque programme s'ouvre dedans, et le meuble se replie autour de l'écran, qui prend la hauteur de la fenêtre ; FaunInvaders redresse l'écran à la verticale.
- Panneau : BC, TL, IG en rangée de départ ; la manette au milieu, entre quatre touches-pavés lumineuses, KORHOGAME (grands jeux d'un côté, Katabatik et son dé de l'autre), FAUNEYE (BakuBook, VHS, FotoFauna), 3615, SURFAUNA (Reporhogo, FaunaTor) ; la plaque émaillée Mauk Tenieb sur le bord avant, qui ouvre https://github.com/mauktenieb.
- Porte : la fente INSERT KOIN (décompte de la Koin gratuite à zéro Koin) ; les boutons SKIN (bois, métal, 1960), FX, FR · EN, sur leur plaque à droite de la porte ; tout en bas, le copyright.

## Grammaire commune
1. Toucher = agir.
2. Glisser à gauche ou à droite = suivant ou précédent.
3. Pincer ou molette = zoomer.
4. Faire glisser un objet = le déplacer.
5. Appui long = en voir plus.
6. Baku Boom = revenir, toujours sous l'écran ; Échap fait pareil, programmes en cadre compris.
7. Flèches = glissés ; Espace et Entrée = toucher.

D'un programme à l'autre : un glissé depuis le bord de l'écran, ou un toucher sur ce bord, ou Page préc. / Page suiv., dans l'ordre du panneau ; la neige d'un changement de chaîne et le nom du programme marquent le passage ; des points sous l'écran montrent les programmes du groupe ; à zéro Koin, le glissé saute les jeux payants. Baku Boom ramène à l'accueil et referme le groupe.

Écran : commandes toujours au même endroit, une icône et un mot au plus, zéro phrase d'explication, cibles de 44 px au moins, état toujours visible. Plafond : 99 pour tout (Koins, cassettes, morceaux d'une cassette, Kuration, livres, récits, poses).

## Fichiers
- `borne-cabinet.css`, `borne-cabinet.js` : le meuble, les habits, le tilt, la porte, la grammaire commune, les éclats et reflets, la Koin qui tourne (payée, elle vole du compteur à la fente ou dans l'écran).
- `borne-aimant.js` : les blocs aimantés ; souris, appuyer puis glisser ; doigt, appui long ; ramené près de sa place, le bloc s'y recolle ; positions gardées par skin.
- La manette a un ressort : poussée, elle dépasse, cogne sa butée, tremble et revient ; le panneau encaisse le choc ; elle suit la boule saisie, les flèches et les glissés sur l'écran.
- `borne-presence.js` : Online Applicants, une diode et un chiffre au pied de l'écran ; chaque visiteur s'annonce toutes les 20 s sous un numéro tiré au hasard, sur un canal MQTT public (trois relais) ; zéro nom, zéro cookie.
- `borne-son.js` : les sons de la mécanique, synthétisés à la volée avec du hasard à chaque coup (touches, micro-contacts, ressort et butée de la manette, crans des molettes, Koin qui sonne et tombe, TILT de Baku Boom, blocs aimantés) ; la machine ronronne et s'échauffe quand on joue ; FX coupe tout.
- Immersion (bouton au pied de l'écran) : l'écran seul en plein écran ; un glissé parti d'un bord change de programme ; ✕ ou Échap pour sortir. Le Minitel s'affiche plus lumineux ; la Kam de Kapture indique BAK ou FRONT.
- `borne-diktat.html` : DiktatFaune (KorhoGame) ; 3, 5 ou 10 s au micro, choisi dans la liste quand il y en a plusieurs, demandé une fois par session ; hauteur et vitesse indépendantes, endroit ou envers ; SAVE en .wav au nom du calendrier républicain.
- `borne-jeu.js` : chaque jeu agrandi et centré à la mesure de l'écran ; la manette choisit et enfonce les touches à l'accueil, envoie flèches et Espace dans les jeux ; son socle la déplace.
- `borne-skopo.js` : SkopoRhogo à l'heure du visiteur.
- `borne-fauneye.html` : BakuBook, le lecteur universel (stock de fac-similés, fichiers du visiteur, Internet Archive, Gutenberg, Wikisource, Google Books ; zoom, loupe, vignettes, typographie).
- `borne-fotofauna.js`, `borne-fotofauna.css` : FotoFauna, le logo et le viseur déclenchent ; caméra avant ou arrière ; Une, Superposer, Pellicule.
- `borne-frames.css` : retouches de Reporhogo et de FaunaTor.
- `borne-bio.html` : la bio, lue en direct du README du profil GitHub.
- `borne-say.txt` : une phrase des psychopompes pour les arrêts propres à la borne (touches, BC, liseuse, FaunInvaders, Sampler) ; leurs répliques d'Insert Koin restent celles de l'artiste.
- `borne-lobby.json` : zones cliquables des 18 Masks sur l'image de l'écran titre, devant Korong!.

Les robots d'indexation passent leur chemin : `Disallow: /borne/` et `noindex` sur chaque page de la borne.
