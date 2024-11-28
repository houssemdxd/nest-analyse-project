# Utiliser une image Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source de l'application
COPY . .

# Construire le projet
RUN npm run build

# Exposer le port utilisé par l'application (par défaut 3000 pour NestJS)
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:prod"]
