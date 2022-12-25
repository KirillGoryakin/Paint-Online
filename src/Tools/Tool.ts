
class Tool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isMouseDown: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.setEvents()
  }

  setEvents() {
    this.canvas.onmousedown = this.onMouseDown.bind(this);
    this.canvas.onmousemove = this.onMouseMove.bind(this);
    this.canvas.onmouseup = this.onMouseUp.bind(this);
  }

  onMouseDown(e: MouseEvent) {}
  onMouseMove(e: MouseEvent) {}
  onMouseUp(e: MouseEvent) {}

  getParams(e: MouseEvent) {
    const
      canvasRect = this.canvas.getBoundingClientRect(),
      x = e.clientX - canvasRect.left,
      y = e.clientY - canvasRect.top,
      radius = this.ctx.lineWidth / 2;

    return [x, y, radius];
  }
}

export default Tool;