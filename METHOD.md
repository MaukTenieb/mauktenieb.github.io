# How Mauk Tenieb keeps Korhogo's public data consistent across platforms

The method covers YouTube, Bandcamp, MusicBrainz, the Internet Archive, Discogs, his sites and Wikidata. Mauk Tenieb set this method in October 2026. French below.

## Principles

1. Every platform states the same facts about the artist, the world, the avatars and each release. Search engines and answer engines then read one linked entity and cite it right.
2. Facts (names, titles, dates, labels, links, genres) follow rules and pass through automated chains. The work (the artist's texts, lore, language) stays as the artist wrote it; the machine quotes and places it.
3. The artist and the work open every page and record; administrative data stays exact and discreet.
4. The artist sets the rules and settles exceptions; the machine executes and checks itself; repetitive typing and checking go to the machine.
5. A missing fact comes from a named source (the release page, the publication date) or waits for the artist.
6. Before declaring a failure, the method searches the code forges for those who solved the problem and reads their code and their test data.

## The cycle of each chain

1. Read the exact source: the official API first, a real browser when the page alone holds the information.
2. Apply the rules, after the hand corrections, so the rules cover them too.
3. Judge each record against three tests. True: every fact matches its source and every link answers. Sufficient: the core is complete. Pertinent: each remaining item adds information; the chain removes outdated and false items.
4. Have an independent reviewer check the whole set against the rules, down to zero faults; each new rule triggers a full review, which catches regressions.
5. Write only what differs, keep every replaced text, and allow one run to restore the previous state.
6. Report the count of records the chain rewrites, keeps and sees refused.

Tools in the open: [Reporhogo](https://github.com/MaukTenieb/reporhogo) searches forty-one code forges for a topic; [KorhoTube](https://github.com/MaukTenieb/korhotube) lists the public videos of a YouTube channel as JSON.

---

# Comment Mauk Tenieb tient cohérentes les données publiques de Korhogo

La méthode couvre YouTube, Bandcamp, MusicBrainz, Internet Archive, Discogs, ses sites et Wikidata. Mauk Tenieb fixe cette méthode en octobre 2026.

## Principes

1. Chaque plateforme énonce les mêmes faits sur l'artiste, le monde, les avatars et chaque sortie. Les moteurs de recherche et de réponse lisent une entité reliée et la citent juste.
2. Les faits (noms, titres, dates, labels, liens, genres) suivent des règles et passent par des chaînes automatisées. L'œuvre (textes de l'artiste, lore, langue) reste telle que l'artiste l'écrit ; la machine la cite et la place.
3. L'artiste et l'œuvre ouvrent chaque page et chaque fiche ; la donnée administrative reste exacte et discrète.
4. L'artiste fixe les règles et tranche les exceptions ; la machine exécute et se contrôle ; la saisie et la vérification répétitives reviennent à la machine.
5. Un fait absent vient d'une source nommée (la page de la sortie, la date de publication) ou attend l'artiste.
6. Avant de constater un échec, la méthode cherche dans les forges de code ceux qui ont franchi l'obstacle, et lit leur code et leurs données de test.

## Le cycle de chaque chaîne

1. Lire la source exacte : l'API officielle d'abord, un vrai navigateur quand la page seule porte l'information.
2. Appliquer les règles, après les corrections faites à la main, pour les couvrir aussi.
3. Juger chaque fiche selon trois critères. Vraie : chaque fait concorde avec sa source et chaque lien répond. Suffisante : le cœur est complet. Pertinente : chaque élément restant ajoute une information ; la chaîne retire le périmé et le faux.
4. Faire relire l'ensemble par un relecteur indépendant, jusqu'à zéro faute ; chaque nouvelle règle déclenche une relecture complète, qui attrape les régressions.
5. Écrire seulement ce qui diffère, garder chaque texte remplacé, permettre à un seul passage de restaurer l'état antérieur.
6. Compter les fiches que la chaîne réécrit, garde, ou voit refusées.

Outils publics : [Reporhogo](https://github.com/MaukTenieb/reporhogo) cherche un sujet dans quarante et une forges de code et liste les dépôts trouvés ; [KorhoTube](https://github.com/MaukTenieb/korhotube) liste les vidéos publiques d'une chaîne YouTube en JSON.

Code: MIT licence. Korhogo material: Copyright © Mauk Tenieb & Korhogo, all rights reserved; training of artificial intelligence on it requires written permission.
