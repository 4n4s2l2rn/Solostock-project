# 🛒 Solostock B2B - Plateforme Marketplace B2B

Une plateforme de commerce inter-entreprises (B2B) construite avec une architecture microservices.
Inspirée de solostock.ma, elle permet aux fournisseurs de publier leurs produits en gros et aux acheteurs de négocier et payer en ligne.

---

## 🏗️ Architecture

7 microservices Spring Boot indépendants :

| Service | Port | Description |
|---|---|---|
| Eureka Server | 8761 | Service Discovery |
| API Gateway | 8080 | Point d'entrée unique |
| Auth Service | 8081 | JWT + BCrypt + Rôles |
| Catalog Service | 8082 | Produits & Stocks |
| Negotiation Service | 8083 | Offres & Négociations |
| Analytics Service | 8084 | Dashboard KPIs |
| Payment Service | 8085 | Transactions |

---

## 🛠️ Tech Stack

**Backend :** Java 21 · Spring Boot 3.2 · Spring Cloud · Spring Security · PostgreSQL 15 · Maven

**Frontend :** React TypeScript · Material UI · Axios · React Router

---

## 👥 Rôles utilisateurs

- **FOURNISSEUR** → Publie ses produits, reçoit et gère les offres, voit ses gains
- **ACHETEUR** → Parcourt le catalogue, fait des offres, paie les offres acceptées
- **ADMIN** → Vue complète de toute la plateforme

---

## 🔐 Sécurité

- JWT (HS256) avec expiration 24h
- BCrypt pour le hachage des mots de passe
- RBAC (Role-Based Access Control)
- Spring Security Stateless
- CORS configuré au niveau de l'API Gateway

---

## 🚀 Lancement en local

### Prérequis
- Java 21
- PostgreSQL 15
- Node.js 18+
- IntelliJ IDEA

### 1. Créer les bases de données PostgreSQL
```sql
CREATE DATABASE solostock_auth;
CREATE DATABASE solostock_catalog;
CREATE DATABASE solostock_negotiation;
CREATE DATABASE solostock_analytics;
CREATE DATABASE solostock_payment;
```

### 2. Lancer les services dans IntelliJ (dans l'ordre)
```
1. EurekaServerApplication
2. ApiGatewayApplication
3. AuthServiceApplication
4. CatalogServiceApplication
5. NegotiationServiceApplication
6. AnalyticsServiceApplication
7. PaymentServiceApplication
```

### 3. Lancer le Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### 4. Ouvrir dans le navigateur
```
http://localhost:3001
```

Vérifier Eureka : http://localhost:8761

---

## 📋 Flux métier

```
Fournisseur publie produit
        ↓
Acheteur fait une offre
        ↓
Fournisseur : Accepte / Refuse / Contre-propose
        ↓
Acheteur paie (si ACCEPTED)
        ↓
Transaction COMPLETED → visible pour les deux
```

---

## 📁 Structure du projet

```
solostock-b2b/
├── eureka-server/
├── api-gateway/
├── auth-service/
├── catalog-service/
├── negotiation-service/
├── analytics-service/
├── payment-service/
├── frontend/
├── docker-compose.yml
└── pom.xml
```

---

## 👨‍💻 Développé avec

IntelliJ IDEA · Spring Boot · React · PostgreSQL
