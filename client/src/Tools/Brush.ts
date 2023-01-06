import { Figure } from "appTypes";
import Store from "Store/Store";
import Tool from "./Tool";

class Brush extends Tool {
  figureToUndo: Figure & { tool: 'brush' } = {
    tool: 'brush',
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

    if(this.isMouseDown){
      const [x, y] = this.getCoords(e);
      const pressure = e.pointerType === 'mouse' ? undefined : e.pressure + 0.5;
      
      this.figureToUndo.coords.push({x, y, pressure});
      this.draw(x, y, pressure);
    }
  }

  draw(x: number, y: number, pressure?: number){
    const figure: Figure & { tool: 'brush' } = {
      ...this.figureToUndo,
      coords: [{ x, y, pressure }],
    };
    
    Brush.drawFigure(this.ctx, figure);
    Store.sendFigure({ ...figure, pending: true });
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & {tool: 'brush'}
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;

    figure.coords.forEach(({x, y, pressure}) => {
      if(pressure)
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
  }
}

export default Brush;