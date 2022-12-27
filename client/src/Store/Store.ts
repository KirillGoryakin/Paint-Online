import { makeAutoObservable } from "mobx";
import Brush from "Tools/Brush";
import Tool from "Tools/Tool";

class Store {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  tool: Tool | null = null;
  undoList: string[] = [];
  redoList: string[] = [];
  lineWidth: number = 8;
  color: string = '#000000';

  id: string = '';
  username: string = '';
  socket: WebSocket | null = null;
  users: string[] = [];
  
  constructor() {
    makeAutoObservable(this);

    this.setColor = this.setColor.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.pushToUndo = this.pushToUndo.bind(this);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    /* Default settings start */
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    this.canvas.onselectstart = () => false;
    
    this.ctx = canvas.getContext('2d');
    if (this.ctx){
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
    }
    
    this.setTool(Brush);
    /* Default settings end */
  }

  async setWebsocketConnection(id: string, username: string) { 
    if(await this.isUsernameTaken(id, username))
      return false;
    
    const socket = new WebSocket('ws://localhost:5000/');

    this.socket = socket;
    this.id = id;
    this.username = username;

    const msg = { id, username };

    socket.onopen = () => 
      socket.send(JSON.stringify({ ...msg, method: 'connection' }));
    
    window.onbeforeunload = () => 
      socket.send(JSON.stringify({ ...msg, method: 'disconnection' }));

    socket.onmessage = ({ data: msg }) => {
      msg = JSON.parse(msg);

      switch (msg.method){
        case 'connection':
        case 'disconnection':
          this.users = msg.users;
          break;

        case 'draw':
          if (msg.username !== this.username){
            this.pushToUndo();
            this.drawImage(msg.dataURL);
          }
          break;

        case 'roomImage':
          this.drawImage(msg.dataURL);
          break;

        default:
          console.log('Unknown message: ', msg);
          break;
      }
    };

    return true;
  }

  async isUsernameTaken(id: string, username: string) {
    const res = await fetch(`http://localhost:5000/room/${id}`);
    const data = await res.json();
    if(data.users.includes(username))
      return true;
    
    return false;
  }

  onDraw() {
    if (this.canvas && this.socket) {
      const msg = {
        method: 'draw',
        id: this.id,
        username: this.username,
        dataURL: this.canvas.toDataURL()
      };
      this.socket.send(JSON.stringify(msg));
    }
  }

  setTool(tool: typeof Tool){
    if (this.canvas && this.ctx){
      this.tool = new tool(
        this.canvas,
        this.ctx
      );

      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
    }
  }
  
  setLineWidth(width: number) {
    if (this.ctx) {
      this.lineWidth = width;
      this.ctx.lineWidth = width;
    }
  }

  setColor(color: string) {
    if (this.ctx){
      this.color = color;
      this.ctx.strokeStyle = color;
      this.ctx.fillStyle = color;
    }
  }
  
  clearCanvas() {
    if (this.canvas && this.ctx) {
      this.pushToUndo();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.onDraw();
    }
  }

  drawImage(image: string, cb?: Function) {
    if(this.canvas && this.ctx){
      const canvas = this.canvas;
      const ctx = this.ctx;

      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if(cb) cb();
      };
    }
  }

  saveImage() {
    if (this.canvas) {
      const img = this.canvas.toDataURL();
      const link = document.createElement('a');

      link.style.display = 'none';
      link.setAttribute('download', new Date().getTime() + '.png');
      link.setAttribute('href', img);

      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  undo() {
    if (this.canvas && this.ctx) {
      const canvas = this.canvas;
      const ctx = this.ctx;
      
      if (this.undoList.length) {
        const dataURL = this.undoList.pop();
        if (dataURL) {
          this.redoList.push(this.canvas.toDataURL());
          this.drawImage(dataURL, this.onDraw);
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.onDraw();
      }
    }
  }

  redo() {
    if (this.canvas && this.ctx && this.redoList.length) {
      const dataURL = this.redoList.pop();
      if (dataURL) {
        this.undoList.push(this.canvas.toDataURL());
        this.drawImage(dataURL, this.onDraw);
      }
    }
  }

  pushToUndo() {
    if (this.canvas) {
      this.undoList.push(this.canvas.toDataURL());
      this.redoList = [];
    }
  }
}

export default new Store();