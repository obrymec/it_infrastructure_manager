# IT Infrastructure Manager
![Full Stack Development](https://img.shields.io/badge/full%20stack%20development-skyblue.svg?style=for-the-badge)
![IT Infrastructure](https://img.shields.io/badge/it%20infrastructure-steelblue.svg?style=for-the-badge)
![Web Application](https://img.shields.io/badge/web%20application-slateblue?style=for-the-badge)
![PWA](https://img.shields.io/badge/pwa-darkblue.svg?style=for-the-badge)

This big project is academic. The main goal of the project is to manage IT
infrastructure in the computer packs. It has been developed with Native Web
Development Languages. The project is subdivided in two parts such as:
Front-end and Back-end. In Front-end, all user interfaces are built
using basic HTML and CSS to draw layouts, controls and JavaScript to
make some feedback with users and HTTP requests to Back-end via Node.js.
In Back-end, a simple Node.js API is developed to get and treat client
requests. Express.js is used as a server to run this project. Note that
data is stored in a remote Mongo Cloud Database hosted on Internet. The
communication between Front-end and Back-end uses AJAX and data transfer
uses JSON language.

## Table of contents
1. [Access link](#link)
2. [Reference](#ref)
3. [Final result](#result)
    1. [Video](#video)
    2. [Screenshots](#images)
4. [Project installation](#install)
    1. [Nodejs installation](#node-install)
    2. [Sources code cloning](#cloning)
    3. [Dependencies installation](#dev-install)
    4. [Project execution](#running)

## Access link <a id = "link"></a>
The project is already hosted on web and can be
accessible through the link below :
- https://it-infrastructure-manager.onrender.com

## Reference <a id = "ref"></a>
The project can be found via the link below :
- https://gitlab.com/obrymec/it_infrastructure_manager

## Final result <a id = "result"></a>
This is the final result of the project :
### Video <a id = "video"></a>
[![Watch the project's video](https://img.youtube.com/vi/3gKHXcMMDlA/maxresdefault.jpg)](https://youtu.be/3gKHXcMMDlA)

### Screenshots <a id = "images"></a>
![First render](./front_end/public/assets/render/render_1.png)
![Second render](./front_end/public/assets/render/render_2.png)
![Third render](./front_end/public/assets/render/render_3.png)
![Fourth render](./front_end/public/assets/render/render_4.png)

## Project installation <a id = "install"></a>
👉 If you want to get project sources code, make sure
to have <i><a href = "https://nodejs.org/en/download">
NodeJs</a></i> already installed in your machine. If
it isn't the case, you can install it from <i>
<a href = "https://github.com/nvm-sh/nvm">nvm</i></a>.

### Nodejs installation <a id = "node-install"></a>
```sh
cd ~;\
sudo apt install curl;\
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash;\
source ~/.bashrc;\
nvm --version;\
nvm install --lts;\
node --version;\
npm install yarn --global;\
yarn --version
```

### Sources code cloning <a id = "cloning"></a>
```sh
git clone git@github.com:obrymec/it_infrastructure_manager.git it_infrastructure_manager/
```

### Dependencies installation <a id = "dev-install"></a>
Go to the root folder of the project sources
and run :
```sh
yarn install
```

### Project execution <a id = "running"></a>
Go to the root folder of the project and
run :
```sh
yarn start
```

Then, open your favorite browser and tap
on the search bar, the following link :
```sh
http://localhost:5700/
```

Enjoy :)
