import { makeAutoObservable } from "mobx";
import Brush from "Tools/Brush";
import Tool from "Tools/Tool";

class Store {

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  tool: Tool | null = null;
  lineWidth: number = 8;
  strokeColor: string = '#000000';
  fillColor: string = '#000000';
  
  constructor() {
    makeAutoObservable(this);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    this.canvas.onselectstart = () => false;

    this.ctx = canvas.getContext('2d');
    if (this.ctx){
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.fillStyle = this.fillColor;
      this.ctx.strokeStyle = this.strokeColor;
    }

    this.setTool(Brush);
  }

  setTool(tool: typeof Tool){
    if (this.canvas && this.ctx){
      this.tool = new tool(
        this.canvas,
        this.ctx
      );

      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.fillStyle = this.fillColor;
    }
  }
  
  setLineWidth(width: number) {
    if (this.ctx) {
      this.lineWidth = width;
      this.ctx.lineWidth = width;
    }
  }

  setStrokeColor(color: string) {
    if (this.ctx){
      this.strokeColor = color;
      this.ctx.strokeStyle = color;
    }
  }

  setFillColor(color: string) {
    if (this.ctx){
      this.fillColor = color;
      this.ctx.fillStyle = color;
    }
  }
  
  clearCanvas() {
    if (this.canvas && this.ctx) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = this.fillColor;
    }
  }
  
}

export default new Store();