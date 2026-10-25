# EmsiExam 

Application web complète (Back-end + Front-end) dédiée à la gestion d'examens pour l'EMSI, où les étudiants peuvent passer leurs examens directement sur la plateforme.
---

## Table des matières

1. [Présentation](#présentation)
2. [Structure du projet](#structure-du-projet)
3. [Architecture du Back-end](#architecture-du-back-end)
4. [Technologies utilisées](#technologies-utilisées)
5. [Prérequis](#prérequis)
6. [Fonctionnalités](#fonctionnalités)

---

## Présentation

**EmsiExam** est une plateforme permettant de gérer et de passer des examens en ligne.
Ce dépôt regroupe l'ensemble de la solution :

- un **Back-end** Spring Boot (API REST et logique métier) ;
- un **Front-end** (interface utilisateur) ;
- un document d'**analyse stratégique** du projet.

## Structure du projet

```
EmsiExamFullVersion/
├── EmsiExam/                          # Back-end (Spring Boot / Maven)
├── frontend/                          # Front-end (interface utilisateur)
├── analyse_strategique_emsiexam.html  # Analyse stratégique du projet
├── package-lock.json                  # Verrouillage des dépendances Node.js
└── README.md
```

## Architecture du Back-end

Le back-end suit une architecture **en couches** classique de Spring Boot :

```
EmsiExam/
├── .mvn/wrapper/                      # Maven Wrapper
├── src/
│   ├── main/
│   │   ├── java/com/labas/emsiexam/
│   │   │   ├── controller/            # Contrôleurs REST (points d'entrée de l'API)
│   │   │   ├── service/               # Logique métier
│   │   │   ├── repository/            # Accès aux données
│   │   │   ├── entity/                # Entités (modèle de données)
│   │   │   ├── exception/             # Gestion des exceptions
│   │   │   └── EmsiExamApplication.java   # Point d'entrée de l'application
│   │   └── resources/                 # Configuration (application.properties, etc.)
│   └── test/java/com/labas/emsiexam/  # Tests
├── uploads/                           # Fichiers téléversés
└── pom.xml
```

| Couche         | Rôle                                                              |
| -------------- | ----------------------------------------------------------------- |
| `controller`   | Reçoit les requêtes HTTP et renvoie les réponses                  |
| `service`      | Contient les règles métier                                        |
| `repository`   | Communique avec la base de données                                |
| `entity`       | Représente les tables / objets persistés                          |
| `exception`    | Centralise la gestion des erreurs                                 |

## Technologies utilisées

| Couche           | Technologie                                     |
| ---------------- | ----------------------------------------------- |
| Back-end         | Java, Spring Boot, Maven (Maven Wrapper)        |
| Front-end        | React js                                        |
| Base de données  | MySQL                                           |
| Outils           | Git, npm, Postman                               |

## Prérequis

- [Git](https://git-scm.com/)
- [JDK](https://adoptium.net/) 17 ou supérieur _(à adapter à la version du `pom.xml`)_
- [Node.js](https://nodejs.org/) et npm (pour le front-end)
- Un SGBD en cours d'exécution _(à préciser)_

> Maven n'a pas besoin d'être installé : le projet inclut le **Maven Wrapper** (`mvnw`).


## Fonctionnalités

> À ajuster selon l'état réel de l'application.

- Gestion des examens et des questions
- Gestion des utilisateurs et des rôles
- Téléversement de fichiers (dossier `uploads/`)
- Gestion centralisée des erreurs
- Interface web pour les utilisateurs
