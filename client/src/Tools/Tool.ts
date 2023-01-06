import { Figure } from "appTypes";
import Store from "Store/Store";

class Tool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isMouseDown: boolean = false;

  figureToUndo: Figure | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.setEvents()
  }

  setEvents() {
    this.canvas.onpointerdown = this.onMouseDown.bind(this);
    this.canvas.onpointermove = this.onMouseMove.bind(this);
    this.canvas.onmouseup = this.onMouseUp.bind(this);
  }

  onMouseDown(e: PointerEvent) {
    this.isMouseDown = true;
    
    if (this.figureToUndo){
      this.figureToUndo.color = Store.color;
      this.figureToUndo.lineWidth = Store.lineWidth;
    }

    this.ctx.beginPath();
  }

  onMouseMove(e: PointerEvent) {
    if (e.pressure === 0) this.onMouseUp(e);
  }
  
  onMouseUp(e: MouseEvent) {
    if (this.isMouseDown && this.figureToUndo){
      Store.sendFigure(this.figureToUndo);
      Store.pushFigureToUndo(this.figureToUndo);
    }

    this.isMouseDown = false;
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure
  ) {}

  getCoords(e: MouseEvent) {
    const
      canvasRect = this.canvas.getBoundingClientRect(),
      x = Math.round(e.clientX - canvasRect.left),
      y = Math.round(e.clientY - canvasRect.top);

    return [x, y];
  }
}

export default Tool;