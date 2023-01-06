import { Figure } from "appTypes";
import Store from "Store/Store";
import Tool from "./Tool";

class Line extends Tool {
  figureToUndo: Figure & { tool: 'line' } = {
    tool: 'line',
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

    this.figureToUndo = {
      ...this.figureToUndo,
      startX: x,
      startY: y,
    };
  }

  onMouseMove(e: PointerEvent) {
    super.onMouseMove(e);

    if (this.isMouseDown) {
      const [x, y] = this.getCoords(e);

      this.figureToUndo = {
        ...this.figureToUndo,
        endX: x,
        endY: y,
      };
      
      this.draw(x, y);
    }
  }

  draw(x: number, y: number){
    const figure: Figure & { tool: 'line' } = {
      ...this.figureToUndo,
      endX: x,
      endY: y,
    };
    
    Store.drawImage(this.save, () => 
      Line.drawFigure(this.ctx, figure));
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & { tool: 'line' }
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;

    const { startX, startY, endX, endY } = figure;

    const drawCircle = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);

      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    drawCircle(startX, startY);

    ctx.lineTo(endX, endY);
    ctx.stroke();

    drawCircle(endX, endY);

    ctx.beginPath();
  }
}

export default Line;