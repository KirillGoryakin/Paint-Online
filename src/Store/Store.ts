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

  setDefaultSettings() {
    
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    if (this.canvas && this.ctx && this.undoList.length){
      const dataURL = this.undoList.pop();
      if(dataURL){
        this.redoList.push(this.canvas.toDataURL());

        const canvas = this.canvas;
        const ctx = this.ctx;

        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    } else {
      this.clearCanvas();
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