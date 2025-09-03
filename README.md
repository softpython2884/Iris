# Projet IRIS : Système de Renseignement Augmenté

## 0. But Résumé

Développer un système terminal-only privé et sécurisé nommé IRIS. Ce système agira comme un client TUI/CLI et un serveur backend, offrant :
- Une messagerie sécurisée et versionnée (boîte mail et temps réel).
- Un système de permissions granulaires.
- Un mécanisme de "lockdown" à 3 niveaux (manuel et automatique).
- Des bots et une IA pour la collecte et l'enrichissement de données.
- Un module de supervision (IRIS).
- Un stockage d'entités type "Orwell-like" pour personnes, organisations, sites, etc.
- Des garanties fortes d'audit et de chiffrement.

L'interface principale sera une TUI (Text-based User Interface) riche et interactive, fonctionnant entièrement dans un terminal.

---

## I. Spécifications Fonctionnelles

### 1. Authentification & Sessions
- **Description** : Connexion via token ou clé asymétrique (challenge-response). Les sessions seront à durée de vie courte et révocables. Une commande `whoami` affichera les informations de l'utilisateur (user, group, level).
- **Critères d'acceptation** :
  - Le login fonctionne avec un token et un challenge de clé.
  - Un token de session peut être révoqué par un administrateur.
  - `whoami` retourne l'utilisateur, son groupe et son niveau de permission.

### 2. Permissions
- **Description** : Modèle RBAC avec 8 niveaux principaux (0-7) et des sous-rôles (ex: 3.1 à 3.12) pour une granularité fine (lecture, écriture, gestion des bots, import, etc.). Chaque ressource aura un `required_min_level` et une ACL optionnelle.
- **Critères d'acceptation** :
  - L'accès est refusé si `user.level < required_min_level`.
  - Les exceptions définies dans les ACL sont respectées.

### 3. Lockdown (LV1 / LV2 / LV3)
- **Description** : 3 niveaux d'urgence pour sécuriser le système.
  - **LV1** : Affiche une bannière d'alerte, force tout le trafic à passer par Tor.
  - **LV2** : Déconnecte toutes les sessions, restreint les interactions avec la base de données (sauf pour déverrouillage).
  - **LV3** : Exporte les données chiffrées, suivi d'une suppression contrôlée nécessitant une approbation multiple.
- **Critères d'acceptation** :
  - L'activation de chaque niveau est une action signée et auditée.
  - LV2 invalide toutes les sessions actives.
  - LV3 ne s'enclenche qu'après approbation multiple et génère un export chiffré avant toute suppression.

### 4. Auto-Lock (Détection & Règles)
- **Description** : Des règles configurables (ex: X échecs de login, connexion sans token, lectures massives) déclenchent automatiquement un niveau de lockdown.
- **Critères d'acceptation** :
  - Une règle (ex: 5 échecs en 1 min) déclenche LV1.
  - Une autre règle (ex: lectures massives) déclenche LV2.

### 5. Messagerie Versionnée (Mailbox)
- **Description** : Messages chiffrés de bout en bout (E2E). Chaque message a un `msg_id` et est versionné. La modification d'un message crée une nouvelle version qui référence l'ancienne.
- **Critères d'acceptation** :
  - Un message envoyé est chiffré, et sa signature peut être vérifiée par le destinataire.
  - La mise à jour d'un message crée une nouvelle version liée à la précédente.

### 6. Chat Temps Réel
- **Description** : Canaux de discussion éphémères (par défaut) ou persistants (optionnel). Utilise le PFS (Perfect Forward Secrecy). Les conversations peuvent être archivées dans la mailbox.
- **Critères d'acceptation** :
  - Une session de chat temps réel peut être établie.
  - L'option `persist=true` sauvegarde la conversation dans la mailbox.

### 7. Chiffrement & Intégrité
- **Description** : Chiffrement E2E pour tout contenu utilisateur. Signatures pour la non-répudiation. Chaînage des données avec `prev_hash` pour garantir l'intégrité. Les clés privées restent côté client.
- **Critères d'acceptation** :
  - Le serveur ne peut pas déchiffrer les données des utilisateurs.
  - Le client vérifie les signatures et l'intégrité de la chaîne de données.

### 8. Anonymat (Tor / IP)
- **Description** : Le client peut forcer l'utilisation de Tor. L'interface affiche l'état de Tor et l'IP fournie par le réseau. L'IP réelle est masquée par défaut. Le serveur peut exposer un service Onion.
- **Critères d'acceptation** :
  - Le client peut router son trafic via un proxy SOCKS5 local.
  - L'interface utilisateur affiche clairement si Tor est actif.

### 9. TUI Dashboard
- **Description** : Interface terminal modulaire et responsive qui s'adapte à la taille du terminal. Zones définies (bannière, statut, zones multi-fonctions). Gestion des clics de souris.
- **Critères d'acceptation** :
  - L'affichage s'adapte aux terminaux de différentes tailles (small, medium, large).
  - Un clic sur un bouton déclenche l'action correspondante.

### 10. Layout Dynamique & Thèmes
- **Description** : Plusieurs thèmes (Neon, Glass, Retro, etc.). Les couleurs s'adaptent au niveau de lockdown. Affichage de sparklines pour CPU/RAM.
- **Critères d'acceptation** :
  - Le changement de thème modifie la palette de couleurs.
  - La bannière de lockdown change de couleur selon le niveau d'alerte.

### 11. Base de Données d'Entités ("Orwell-like")
- **Description** : Stockage d'entités (personne, organisation, site, etc.) avec provenance, liens, et tags. Possibilité d'attacher des notes et de lier des entités entre elles.
- **Critères d'acceptation** :
  - On peut créer une fiche entité, y lier des médias, et définir son niveau d'accès.

### 12. Médias Chiffrés
- **Description** : Les fichiers (images, documents) sont stockés chiffrés. L'accès se fait via des liens signés à courte durée de vie, générés en fonction des permissions.
- **Critères d'acceptation** :
  - Un fichier uploadé est chiffré sur le serveur.
  - Un lien généré expire correctement.

### 13. Bots & Collecte Web
- **Description** : Des bots peuvent être lancés pour crawler des domaines approuvés, extraire du contenu (texte, médias), et créer des brouillons d'entités pour le pipeline d'enrichissement. La provenance et un score de confiance sont stockés.
- **Critères d'acceptation** :
  - Un job de crawl simple extrait les titres, liens et images d'une page et crée des entités.

### 14. IA & Enrichissement Automatisé
- **Description** : Un pipeline IA analyse le contenu collecté, effectue de la reconnaissance d'entités (NER), relie les informations, et enrichit la base de données. Les entités créées sont marquées `bot:created`.
- **Critères d'acceptation** :
  - L'analyse d'une page (ex: Wikipedia) produit des entités structurées avec nom, rôle, et source.

### 15. IRIS — Supervision & Remote Admin
- **Description** : Agents déployables pour superviser des systèmes distants (logs, shell, processus). Le consentement de l'utilisateur est requis par défaut. Un mode d'urgence avec approbation multiple est disponible.
- **Critères d'acceptation** :
  - Une requête de remote shell nécessite un consentement ou une approbation multiple.
  - La session est enregistrée et peut être auditée.

---

## II. Spécifications Techniques & Non-Fonctionnelles

### 16. Recherche & Indexation
- **Description** : Moteur de recherche sur les entités, métadonnées des messages, et tags des médias, avec des facettes (type, date, provenance).
- **Critères d'acceptation** :
  - Une recherche par nom retourne les entités pertinentes avec un score de pertinence.

### 17. Audit & Logs Immuables
- **Description** : Toutes les actions sensibles (lockdown, actions IRIS, purge) sont enregistrées dans un journal `append-only` et signées.
- **Critères d'acceptation** :
  - L'activation du lockdown crée une entrée d'audit signée.

### 18. Backup, Export & Purge
- **Description** : Le niveau de lockdown LV3 génère un export chiffré complet. La purge est une procédure contrôlée et irréversible.
- **Critères d'acceptation** :
  - L'export est téléchargeable. La purge ne s'exécute qu'après toutes les validations.

### 19. API Fonctionnelle
- **Description** : Endpoints pour toutes les fonctionnalités principales (login, messagerie, bots, etc.). Chaque endpoint vérifie les permissions et l'état de lockdown.
- **Critères d'acceptation** :
  - Les endpoints fonctionnent comme prévu sans jamais exposer de données chiffrées en clair.

### 20. Auto-mitigation & Détection DoS
- **Description** : Règles pour détecter et bloquer les comportements anormaux (rafales d'échecs, utilisation abusive de l'API).
- **Critères d'acceptation** :
  - Une simulation d'attaque déclenche la règle et la réponse attendue (ex: auto-lock).

### 21. Ergonomie (UX/UI)
- **Description** : Palette de commandes (Ctrl+P), aperçu rapide (Espace), réponse rapide (r), etc.
- **Critères d'acceptation** :
  - Les raccourcis clavier sont fonctionnels.

### 22. Gouvernance & Éthique
- **Description** : Processus pour le droit à l'oubli (DSAR), logs d'accès, approbation multiple pour les actions invasives.
- **Critères d'acceptation** :
  - Une documentation de conformité est maintenue. Les actions IRIS suivent un workflow d'approbation.

---

## III. Plan de Développement

### 23. Checklist des Tests d'Acceptation Rapides
- [ ] Login via token & clé (challenge)
- [ ] Envoi/réception message E2E + signature vérifiable
- [ ] Affichage & bascule du statut Tor
- [ ] Activation manuelle des flux LV1, LV2, LV3
- [ ] Job de bot minimal qui crée une entité depuis une URL
- [ ] Requête IRIS nécessite un consentement et est enregistrée
- [ ] Upload d'image + expiration du lien signé

### 24. Priorités Recommandées pour le Démarrage
1.  **Fondations** : Authentification, sessions, `whoami`, et une boîte de réception minimale.
2.  **Interface** : Squelette de la TUI responsive avec gestion des clics.
3.  **Crypto** : Chiffrement E2E des messages et stockage des données chiffrées.
4.  **Sécurité** : Lockdown manuel, une règle d'auto-lock (échec auth), et logging des audits.
5.  **Contenu** : Un job de bot simple pour créer une entité avec sa provenance.

### 25. Remarques Pratiques
- **Légalité** : Ne pas inclure de fonctionnalités invasives sans un processus légal clair.
- **Provenance** : Toujours stocker la provenance pour chaque donnée importée.
- **Anonymat** : Masquer l'IP réelle par défaut ; l'affichage de l'IP Tor est opt-in.
- **Irreversibilité** : Toute opération destructive nécessite une approbation multiple et un audit signé.
