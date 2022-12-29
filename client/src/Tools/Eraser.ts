import { Figure } from "appTypes";
import Store from "Store/Store";
import Tool from "./Tool";

class Eraser extends Tool {
  figureToUndo: Figure & { tool: 'eraser' } = {
    tool: 'eraser',
    color: '',
    lineWidth: 0,
    coords: [],
  };

  onMouseDown(e: MouseEvent) {
    super.onMouseDown(e);
    this.figureToUndo.coords = [];
  }

  onMouseMove(e: MouseEvent) {
    super.onMouseMove(e);

    if (this.isMouseDown) {
      const [x, y] = this.getCoords(e);
      this.figureToUndo.coords.push({ x, y });
      this.draw(x, y);
    }
  }

  draw(x: number, y: number){
    const figure: Figure & { tool: 'eraser' } = {
      tool: 'eraser',
      color: Store.color,
      lineWidth: Store.lineWidth,
      coords: [{ x, y }]
    };

    Eraser.drawFigure(this.ctx, figure);
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & { tool: 'eraser' }
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;
    ctx.globalCompositeOperation = "destination-out";

    figure.coords.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
    });
    
    ctx.globalCompositeOperation = "source-over";
  }
}

export default Eraser;