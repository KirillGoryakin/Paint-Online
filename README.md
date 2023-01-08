
# 🎨 Paint Online
**Paint Online** is a web application that allows you to draw with other people in real time! When you enter the site, it generates a room for you. You just copy the URL and send it to your friend. That's it! Now you can draw together!

**Only desktop version!**
## ✨ Features:
- Live drawing!
- Room generation
- Different tools for drawing
- **Undo** and **redo**
- **Saving** your masterpieces

## 🔧 Technologies:
- HTML canvas
- React JS
- Typescript
- MobX
- Chakra UI
- WebSocket
- Express JS

# 👓 Live Demo
https://paint-online-kirillgoryakin.vercel.app/

Used [Vercel.com](https://vercel.com/) for hosting frontend and [Render.com](https://render.com/) for backend.

If your backend hosting closes websocket connection ([Render.com](https://render.com/) closes it after 5 min), you have to regularly reconnect to the server. This project has such feature implemented. You can activate and set reconnection timeout by providing these ENV variables to your **frontend**:
```
REACT_APP_DO_RECONNECT=true
REACT_APP_RECONNECT_TIMEOUT=240000
```
*240 000 ms = 4 min. You can set your own timeout.*
# Development
### Instalation:
Clone repository:
```
git clone https://github.com/KirillGoryakin/Paint-Online.git
```
Install packages:
```
npm i
```
If the server cannot be reached from client you'll see and error message, but you still will be able to continue offline.

Client doesn't have links to the server. Provide them with ENV variables. If you are in developing mod, you can just create a `.env.local` file in `/client/` folder and write this:
```
REACT_APP_HTTP_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```
### Start client and server:
```
npm run start
```
### Start only client:
```
npm run client
```
### Start only server:
```
npm run server
```