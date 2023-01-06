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

  onMouseDown(e: PointerEvent) {
    super.onMouseDown(e);
    this.figureToUndo.coords = [];
  }

  onMouseMove(e: PointerEvent) {
    super.onMouseMove(e);

    if (this.isMouseDown) {
      const [x, y] = this.getCoords(e);
      const pressure = e.pointerType === 'mouse' ? undefined : e.pressure + 0.5;
      
      this.figureToUndo.coords.push({ x, y, pressure });
      this.draw(x, y, pressure);
    }
  }

  draw(x: number, y: number, pressure?: number){
    const figure: Figure & { tool: 'eraser' } = {
      ...this.figureToUndo,
      coords: [{ x, y, pressure }],
    };

    Eraser.drawFigure(this.ctx, figure);
    Store.sendFigure({ ...figure, pending: true });
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & { tool: 'eraser' }
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;
    ctx.globalCompositeOperation = "destination-out";

    figure.coords.forEach(({ x, y, pressure }) => {
      if (pressure)
        ctx.lineWidth = figure.lineWidth * pressure;
      
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);

      ctx.lineWidth = figure.lineWidth;
    });
    
    ctx.globalCompositeOperation = "source-over";
  }
}

export default Eraser;