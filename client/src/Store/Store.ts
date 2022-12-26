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

  setWebsocketConnection(id: string, username: string) {
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
            if (this.canvas && this.ctx) {
              this.pushToUndo();

              const ctx = this.ctx;
              const { width, height } = this.canvas;
              const img = new Image();

              img.src = msg.dataURL;
              img.onload = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
              };
            }
          }
          break;

        default:
          console.log('Unknown message: ', msg);
          break;
      }
    };
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

          const img = new Image();
          img.src = dataURL;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            this.onDraw();
          };
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

        const canvas = this.canvas;
        const ctx = this.ctx;

        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          this.onDraw();
        };
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