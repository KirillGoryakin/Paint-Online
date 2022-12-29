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

  onMouseDown(e: MouseEvent) {
    super.onMouseDown(e);
    this.figureToUndo.coords = [];
  }
  
  onMouseMove(e: MouseEvent) {
    super.onMouseMove(e);
    
    if(this.isMouseDown){
      const [x, y] = this.getCoords(e);
      this.figureToUndo.coords.push({x, y});
      this.draw(x, y);
    }
  }

  draw(x: number, y: number){
    const figure: Figure & { tool: 'brush' } = {
      tool: 'brush',
      color: Store.color,
      lineWidth: Store.lineWidth,
      coords: [{ x, y }]
    };
    
    Brush.drawFigure(this.ctx, figure);
  }

  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & {tool: 'brush'}
  ) {
    ctx.strokeStyle = figure.color;
    ctx.fillStyle = figure.color;
    ctx.lineWidth = figure.lineWidth;

    figure.coords.forEach(({x, y}) => {
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
    });
  }
}

export default Brush;