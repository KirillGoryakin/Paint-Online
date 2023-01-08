import { Figure } from "appTypes";
import { makeAutoObservable } from "mobx";
import Brush from "Tools/Brush";
import Circle from "Tools/Circle";
import Clear from "Tools/Clear";
import Eraser from "Tools/Eraser";
import Line from "Tools/Line";
import Rect from "Tools/Rect";
import Tool from "Tools/Tool";

class Store {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  tool: Tool | null = null;
  lineWidth: number = 8;
  color: string = '#000000';
  clickable: boolean = true;

  undoList: Array<Figure & {id: number}> = [];
  redoList: Array<Figure & {id: number}> = [];
  figures: Array<Figure & {username: string; id: number}> = [];
  pending: { [username: string]: Figure } = {};

  roomId: string = '';
  username: string = '';
  socket: WebSocket | null = null;
  users: string[] = [];
  
  constructor() {
    makeAutoObservable(this);

    this.saveImage = this.saveImage.bind(this);
    this.drawFigure = this.drawFigure.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.pushFigure = this.pushFigure.bind(this);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

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
  }

  setWebsocketConnection(roomId: string, username: string) {
    const socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/`);

    this.socket = socket;
    this.roomId = roomId;
    this.username = username;

    const msg = { roomId, username };

    socket.onopen = () => 
      socket.send(JSON.stringify({ ...msg, method: 'connection' }));

    socket.onmessage = ({ data: msg }) => {
      msg = JSON.parse(msg);

      switch (msg.method){
        case 'connection':
        case 'disconnection':
          this.setUsers(msg.users);
          break;

        case 'init':
          this.figures = msg.figures;
          this.pending = msg.pending;
          this.updateCanvas();
          break;

        case 'figure':
          if (msg.username !== this.username){
            if (msg.figure.pending){
              this.pending[msg.username] = msg.figure;
            } else {
              this.figures.push(msg.figure);
              delete this.pending[msg.username];
            }
            
            this.drawFigure(msg.figure);
          }
          break;

        case 'undo':
          if (msg.username !== this.username) {
            this.figures = this.figures.filter(
              f => f.id !== msg.id || f.username !== msg.username);
            this.updateCanvas();
          }
          break;

        case 'redo':
          if (msg.username !== this.username) {
            this.figures.push(msg.figure);
            this.updateCanvas();
          }
          break;

        default:
          console.log('Unknown message: ', msg);
          break;
      }
    };

    if (
      process.env.REACT_APP_DO_RECONNECT === 'true'
      && process.env.REACT_APP_RECONNECT_TIMEOUT
    ){
      setTimeout(
        () => {
          socket.close();
          this.setWebsocketConnection(roomId, username)
        },
        Number(process.env.REACT_APP_RECONNECT_TIMEOUT)
      );
    }
  }

  async isUsernameTaken(roomId: string, username: string) {
    const res = await fetch(`${process.env.REACT_APP_HTTP_URL}/room/${roomId}`);
    const data = await res.json();
    if(data.users.includes(username))
      return true;
    
    return false;
  }

  sendMessage(msg: object) {
    if (this.socket) {
      msg = {
        roomId: this.roomId,
        username: this.username,
        ...msg,
      };
      this.socket.send(JSON.stringify(msg));
    }
  }

  sendFigure(figure: Figure, id: number) {
    this.sendMessage({
      method: 'figure',
      figure: {
        ...figure,
        username: this.username,
        id
      },
    });
  }

  sendUndo(id: number){
    this.sendMessage({ method: 'undo', username: this.username, id });
  }

  sendRedo(figure: Figure & { id: number }) {
    this.sendMessage({
      method: 'redo',
      figure: {...figure, username: this.username}
    });
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

  setClickable(value: boolean) {
    this.clickable = value;
  }

  setUsers(users: string[]) {
    this.users = users;
  }
  
  clearCanvas() {
    if (this.canvas && this.ctx) {
      const { width: w, height: h } = this.canvas;
      const ctx = this.ctx;
      
      const figure: Figure & { tool: 'clear' } = {
        tool: 'clear',
        color: '',
        lineWidth: 0,
        w, h
      };

      Clear.drawFigure(ctx, figure);

      const id = new Date().getTime();
      this.pushFigure(figure, id);
      this.sendFigure(figure, id);
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

  getToolFromFigure(figure: Figure): typeof Tool | null {
    switch (figure.tool) {
      case 'brush': return Brush;
      case 'eraser': return Eraser;
      case 'line': return Line;
      case 'rect': return Rect;
      case 'circle': return Circle;
      case 'clear': return Clear;

      default: return null;
    }
  }

  drawFigure(figure: Figure) {
    if (this.ctx) {
      const ctx = this.ctx;
      const tool = this.getToolFromFigure(figure);

      ctx.beginPath();
      if (tool) tool.drawFigure(ctx, figure);
    }
  }

  updateCanvas() {
    if (this.canvas && this.ctx) {
      const canvas = this.canvas;
      const ctx = this.ctx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.figures.forEach(this.drawFigure);
      Object.values(this.pending).forEach(this.drawFigure);
    }
  }

  undo() {
    if (this.undoList.length) {
      const figure = this.undoList.pop();
      if (figure) {
        this.redoList.push(figure);
        this.figures = this.figures.filter(
          f => f.id !== figure.id || f.username !== this.username);

        this.updateCanvas();
        this.sendUndo(figure.id);
      }
    }
  }

  redo() {
    if (this.redoList.length) {
      const figure = this.redoList.pop();
      if (figure) {
        this.undoList.push(figure);
        this.figures.push({ ...figure, username: this.username })
        
        this.updateCanvas();
        this.sendRedo(figure);
      }
    }
  }

  pushFigure(figure: Figure, id: number){
    const username = this.username;
    this.undoList.push({ ...figure, id });
    this.figures.push({ ...figure, username, id });
    this.redoList = [];
  }
}

export default new Store();