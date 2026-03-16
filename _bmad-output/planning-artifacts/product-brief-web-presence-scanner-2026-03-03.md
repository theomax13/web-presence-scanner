---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - brainstorming/brainstorming-session-2026-03-03-1708.md
date: 2026-03-03
author: Léo
---

# Product Brief: web-presence-scanner

## Executive Summary

**web-presence-scanner** démocratise l'OSINT pour que chacun puisse voir, comprendre et maîtriser sa trace numérique — avant que quelqu'un d'autre ne l'exploite.

Le produit comble un gap de marché massif entre les outils OSINT professionnels (Maltego, SpiderFoot — 500-2000€/an, complexes, pensés pour experts) et l'absence totale de solution pour le grand public. Aujourd'hui, les données personnelles — adresses, habitudes, mots de passe — circulent en ligne. N'importe qui peut les trouver. Et la plupart des gens ne le savent même pas.

Dans un contexte de guerres d'information croissantes et de montée en puissance de l'IA, les citoyens deviennent des cibles potentielles sans en avoir conscience. **web-presence-scanner** leur donne le pouvoir de comprendre leur exposition en un seul scan, avec une transparence totale sur les sources et des recommandations concrètes pour agir.

Le modèle freemium à 3 paliers (Gratuit / Payant / Entreprise) permet une acquisition massive via le self-scan, tout en monétisant l'accès aux analyses complètes et à la surveillance continue.

---

## Core Vision

### Problem Statement

Vos données personnelles — adresse, habitudes, mots de passe — circulent en ligne. N'importe qui peut les trouver. Et vous ne le savez même pas. En une recherche, on peut tout savoir de votre vie.

Les individus ne comprennent pas l'étendue de leur trace numérique. Les entreprises s'exposent à des risques réels d'usurpation d'identité et de social engineering. Dans un monde où les guerres d'information font des citoyens des cibles malencontreuses, l'ignorance de sa propre exposition numérique n'est plus une option.

### Problem Impact

- **Pour les entreprises :** Infiltration via social engineering, compromission de systèmes, fuites de données sensibles
- **Pour les particuliers :** Usurpation d'identité, surexposition involontaire, exploitation de données personnelles par des tiers malveillants
- **Conséquence de l'inaction :** Les personnes qui ignorent leur présence en ligne restent des cibles faciles dans un monde où les cyberattaques et la guerre d'information s'intensifient

### Why Existing Solutions Fall Short

| Faiblesse                | Détails                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| **Prix prohibitif**      | 500-2000€/an, pas de période d'essai                               |
| **Complexité technique** | Conçus pour des experts OSINT, interface intimidante               |
| **Manque de confiance**  | Crainte que les outils gonflent les résultats pour vendre          |
| **Barrière d'entrée**    | Vérification d'identité requise avant même de tester (ex: Maltego) |
| **Aucune éducation**     | Résultats bruts sans explication, pas de guidance pour agir        |
| **Gap non couvert**      | Rien entre "Google son nom" et "audit professionnel à 2000€"       |

### Proposed Solution

Un scanner de présence en ligne où l'utilisateur entre un nom, email ou identifiant et obtient en **temps réel** une cartographie progressive de son exposition numérique avec un **score par source**.

**L'expérience utilisateur en 3 moments :**

1. 😱 **"Oh non"** — Le score et les résultats révèlent l'exposition réelle
2. 🧠 **"Je comprends"** — Chaque résultat est expliqué en langage humain, pas en jargon cyber
3. 💪 **"Je peux agir"** — Recommandations concrètes et actionnables pour réduire l'exposition

L'éducation se fait **pendant** le scan (pas avant) via un mode tutoriel intégré qui guide l'utilisateur dans la lecture de ses résultats en temps réel.

### Key Differentiators

- **Accessibilité prix** — Freemium : diagnostic gratuit, solution payante. "On montre le problème gratuitement, on vend la solution."
- **Transparence totale** — Sources visibles, méthodologie ouverte, aucun résultat artificiellement gonflé — un "Nutri-Score de la cyber-exposition"
- **Conçu pour tous** — Pas réservé aux experts OSINT, langage humain, parcours guidé
- **Éducation intégrée** — Sensibilisation naturelle pendant l'utilisation, pas en prérequis
- **Timing stratégique** — Guerres d'information, montée de l'IA, conscience citoyenne croissante

### Business Model Preview

| Tier              | Contenu                                                        | Objectif                         |
| ----------------- | -------------------------------------------------------------- | -------------------------------- |
| 🆓 **Gratuit**    | 2 sources (fuites + réseaux sociaux), résultats partiels       | Acquisition — provoquer le "wow" |
| 💎 **Payant**     | Toutes les sources, détails complets, recommandations, alertes | Monétisation principale          |
| 🏢 **Entreprise** | Sur devis, fonctionnalités avancées, multi-utilisateurs        | B2B, phase ultérieure            |

---

## Target Users

### Primary Users

#### 🧑‍💻 Persona 1 — Samia, la particulière connectée

|                            |                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nom**                    | Samia                                                                                                                                            |
| **Âge**                    | 30 ans                                                                                                                                           |
| **Métier**                 | Influenceuse / créatrice de contenu                                                                                                              |
| **Contexte**               | Très présente en ligne, utilise de nombreuses plateformes. Voit régulièrement aux infos des reportages sur les fuites de données massives.       |
| **Motivation**             | Curiosité inquiète — veut savoir si ses données personnelles ont fuité                                                                           |
| **Problème actuel**        | Ne sait pas comment vérifier son exposition. Google son nom mais ne trouve rien de concluant. Pas les moyens (ni l'envie) de payer un audit pro. |
| **Ce qu'elle attend**      | Un outil simple, rapide, qui lui montre concrètement ce qui circule sur elle en ligne                                                            |
| **Moment "aha !"**         | Découvrir que ses données sensibles (adresse, mots de passe…) circulent à travers le monde à cause d'une fuite qu'elle ignorait                  |
| **Comportement post-scan** | Revient une semaine plus tard, approfondit, et potentiellement paie pour le scan complet. Peut partager l'outil à son audience.                  |

> **Samia représente le cœur de cible au lancement** : les particuliers curieux et connectés, première source d'acquisition via le self-scan gratuit.

---

#### 🏢 Persona 2 — Marc, le responsable sécurité en entreprise

|                     |                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nom**             | Marc                                                                                                                                               |
| **Âge**             | 42 ans                                                                                                                                             |
| **Métier**          | Responsable du pôle sécurité informatique (RSSI) dans une PME/ETI                                                                                  |
| **Contexte**        | Gère la cybersécurité d'une entreprise de 50-200 personnes. Budget sécu limité, pas les moyens d'un audit OSINT complet à 10k€.                    |
| **Motivation**      | Vérifier l'exposition de l'entreprise en ligne, détecter les fuites de données liées à l'entreprise, screening pré-embauche des nouveaux candidats |
| **Problème actuel** | Les outils pros sont trop chers et complexes. Fait du "bricolage" avec Google et des outils gratuits épars.                                        |
| **Ce qu'il attend** | Un outil centralisé, abordable, qui permet de scanner l'exposition de l'entreprise et de ses collaborateurs                                        |
| **Moment "aha !"**  | Découvrir que des accès ou données d'employés circulent sur le web, créant un risque d'infiltration via social engineering                         |

> **Marc représente la monétisation B2B** — tier Entreprise sur devis, à adresser en phase ultérieure.

---

### Secondary Users

- **En entreprise :** Le DPO (Délégué à la Protection des Données) ou la direction qui reçoivent les rapports d'exposition générés par Marc, sans utiliser l'outil directement
- **Pour les particuliers :** Pas d'utilisateurs secondaires identifiés — usage individuel direct

---

### User Journey

#### Parcours de Samia (utilisateur type)

```
🔍 DÉCOUVERTE          →  🚀 PREMIER SCAN        →  😱 RÉVÉLATION
Recherche Google          Entre son email            Score + fuites trouvées
"vérifier mes données"    Scan gratuit (2 sources)   "Mes données circulent !"

→  🧠 COMPRÉHENSION     →  🔄 RETOUR              →  💎 CONVERSION
   Explications claires      Revient 1 semaine         Paie le scan complet
   Langage humain             plus tard                 Toutes les sources
   Mode tutoriel              Curiosité + inquiétude    Recommandations
```

**Points clés du parcours :**

1. **Acquisition :** SEO / recherche Google — les gens cherchent activement "vérifier fuites données", "présence en ligne"
2. **Activation :** Le scan gratuit en 2 sources — frisson immédiat, zéro friction
3. **Rétention :** L'utilisateur revient vérifier, comparer, approfondir
4. **Monétisation :** Passage au payant pour le scan complet et les recommandations
5. **Référral :** Partage naturel — "teste ça, c'est flippant ce qu'on trouve sur toi"

#### Distinction à la connexion

Lors de l'inscription/connexion, l'utilisateur choisit son profil : **Particulier** ou **Entreprise**, ce qui adapte l'expérience, les sources scannées et les fonctionnalités proposées.

---

## Success Metrics

### Business Objectives

| Horizon     | Objectif utilisateurs      | Objectif payants  | Objectif stratégique                                                    |
| ----------- | -------------------------- | ----------------- | ----------------------------------------------------------------------- |
| **3 mois**  | ~30 utilisateurs inscrits  | ~6 payants (20%)  | 1ère page Google sur mots-clés cibles                                   |
| **12 mois** | ~100 utilisateurs inscrits | ~33 payants (33%) | Présence social media active (Instagram + TikTok), croissance organique |

> **Signal de validation fort :** La première rentrée d'argent — même symbolique — prouve que le marché est prêt à payer.

---

### Key Performance Indicators

#### 🎯 Acquisition

- **Nombre de comptes créés** — Indicateur de notoriété et d'intérêt (inclut les curieux "juste pour tester")
- **Trafic organique** — Progression du référencement sur les mots-clés cibles (ex: "vérifier fuite données", "ma présence en ligne")

#### ⚡ Activation

- **Taux de complétion du premier scan** — Prouve que l'onboarding est fluide et que la promesse est tenue
- **Temps jusqu'au premier "aha !"** — Rapidité avec laquelle l'utilisateur voit ses premiers résultats significatifs

#### 💎 Conversion

- **Taux gratuit → premium**
  - Cible idéale : 35%
  - Cible réaliste : 10–15%
- **MRR (Monthly Recurring Revenue)** — Évolution du revenu mensuel récurrent

#### 🔄 Rétention

- **Taux de retour** — % d'utilisateurs qui reviennent pour un second scan (dans les 30 jours)
- **Scans par utilisateur actif** — Indicateur de valeur perçue et d'engagement long terme

#### 📣 Référral

- **Partages organiques** — Mentions spontanées sur les réseaux, bouche-à-oreille mesurable via codes promo ou tracking UTM

---

## MVP Scope

### 🔵 V0 — Noyau Core (lancement initial)

> Fondations techniques solides avant tout. UI volontairement minimale. Pas de features flashy — un moteur de scan fiable et une architecture évolutive.

| #   | Fonctionnalité                    | Rôle                                   |
| --- | --------------------------------- | -------------------------------------- |
| 25  | Scanner en un seul input          | Porte d'entrée — zéro friction         |
| 37  | File d'attente de scan asynchrone | Scalabilité et performance             |
| 38  | Cache intelligent & rate-limiting | Maintenabilité et respect des APIs     |
| 26  | Architecture SaaS + API (interne) | Pensée en amont — évite une réécriture |
| 46  | _(à confirmer)_                   | À préciser                             |

**UI V0 :** Page de résultats simple + dashboard minimal (score, sources scannées, résumé)

---

### 🟡 V1 — Fonctionnalités produit

> Le reste du brainstorming V1, ajouté progressivement une fois le noyau validé.

| #   | Fonctionnalité                  | Domaine      |
| --- | ------------------------------- | ------------ |
| 2   | Agrégateur de fuites passives   | Sources      |
| 11  | Score de présence en ligne      | Analyse      |
| 15  | Alertes & surveillance continue | Analyse      |
| 16  | Comparateur d'entités           | Analyse      |
| 18  | Moteur de corrélation croisée   | Analyse      |
| 21  | Dashboard visuel temps réel     | UX           |
| 22  | Rapport PDF/HTML exportable     | UX           |
| 27  | Freemium avec upsell            | Business     |
| 35  | Mode self-scan                  | Business     |
| 39  | Mode scan rapide vs profond     | Architecture |
| 42  | Webhooks & intégrations         | Architecture |
| 53  | Mode tutoriel / parcours guidé  | Gamification |

---

### 🔴 V2 — Vision long terme

Fonctionnalités avancées développées en fonction de la demande utilisateur et du succès du produit :

- **Sources avancées** : Web Archive (#3), Scanner de code source public (#4), Radar blockchain (#6), Détecteur d'empreinte visuelle (#7)
- **Analyse avancée** : Détecteur de faux comptes (#12), Analyseur de sentiment multi-source (#14)
- **Business** : Plugin/extension navigateur (#29), Scanner collaboratif (#30), Base de connaissance crowdsourcée (#34)
- **B2B avancé** : Multi-tenant & white-label (#40)

---

### MVP Success Criteria

Le V0 est validé quand :

- ✅ Un utilisateur peut lancer un scan via un seul input et obtenir des résultats en < 30 secondes
- ✅ Le système tient la charge sans blocage (queue asynchrone + cache opérationnels)
- ✅ L'architecture SaaS/API permet d'ajouter de nouvelles sources sans refactoring
- ✅ Première rentrée d'argent réalisée (signal de marché)
- ✅ 6 utilisateurs payants sur les 30 premiers inscrits
