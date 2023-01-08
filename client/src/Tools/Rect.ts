import { Figure } from "appTypes";
import Store from "Store/Store";
import Tool from "./Tool";

class Rect extends Tool {
  finishedFigure: Figure & { tool: 'rect' } = {
    tool: 'rect',
    color: '',
    lineWidth: 0,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };
  
  save: string = '';

  onMouseDown(e: PointerEvent) {
    super.onMouseDown(e);

    const [x, y] = this.getCoords(e);
    this.save = this.canvas.toDataURL();

    this.finishedFigure = {
      ...this.finishedFigure,
      startX: x,
      startY: y,
    };
  }

  onMouseMove(e: PointerEvent) {
    super.onMouseMove(e);
    
    if (this.isMouseDown) {
      const [x, y] = this.getCoords(e);

      this.finishedFigure = {
        ...this.finishedFigure,
        endX: x,
        endY: y,
      };
      
      this.draw(x, y);
    }
  }

  draw(x: number, y: number) {
    const figure: Figure & { tool: 'rect' } = {
      ...this.finishedFigure,
      endX: x,
      endY: y,
    };

    Store.drawImage(this.save, () => 
      Rect.drawFigure(this.ctx, figure));
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & { tool: 'rect' }
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;

    const
      { startX, startY, endX, endY } = figure,
      w = endX - startX,
      h = endY - startY;

    ctx.fillRect(startX, startY, w, h)
  }
}

export default Rect;