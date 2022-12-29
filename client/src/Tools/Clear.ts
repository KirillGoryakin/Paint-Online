import { Figure } from "appTypes";
import Tool from "./Tool";

class Clear extends Tool {
  static drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure & {tool: 'clear'}
  ) {
    const { w, h } = figure;
    ctx.clearRect(0, 0, w, h);
  }
}

export default Clear;