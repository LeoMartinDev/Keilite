# Keilite

## [Télécharger](https://github.com/LeoMartinDev/Keilite/releases/latest)

> Keilite est un utilitaire pour le jeu Dofus permettant de changer rapidement de compte grace à des raccourcis clavier. Il a donc pour but de remplacer le raccourcis Windows `alt+echap` ou des utilitaires comme Mininit ou Organizer. Le principal avantage à utiliser Keilite au lieu des raccourcis Windows est la possibilité de gérer l'ordre de ses personnages lors du focus (et de pouvoir le modifier facilement).

![Keilite](https://media.giphy.com/media/dvHkd8ZDVBFo687G6n/giphy.gif)

## Development

### Requirements

- NodeJS 10 et supérieur
- node-gyp (voir https://github.com/nodejs/node-gyp pour l'installation, nécessite *python2.7* entre autres).
- Atlbase.h nécessaire pour compiler [native-process](https://github.com/LeoMartinDev/node-native-process) qui permet le focus et la récupération des titres de fenêtres (voir https://stackoverflow.com/a/46304843/5677183 pour l'installation, nécessite Visual Studio).

#### Installer les dépendances

> npm install

#### Lancer le mode development

> npm run electron:serve

#### Build l'application

> npm run electron:build
