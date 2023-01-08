import { Figure } from "appTypes";
import Store from "Store/Store";
import Tool from "./Tool";

class Circle extends Tool {
  finishedFigure: Figure & { tool: 'circle' } = {
    tool: 'circle',
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
    const figure: Figure & { tool: 'circle' } = {
      ...this.finishedFigure,
      endX: x,
      endY: y,
    };

    Store.drawImage(this.save, () =>
      Circle.drawFigure(this.ctx, figure));
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & { tool: 'circle' }
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;

    const { startX, startY, endX, endY } = figure;
    
    ctx.beginPath();
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Circle;