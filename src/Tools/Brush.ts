import Tool from "./Tool";

class Brush extends Tool {

  onMouseDown(e: MouseEvent) {
    this.isMouseDown = true;

    const
      canvasRect = this.canvas.getBoundingClientRect(),
      x = e.clientX - canvasRect.left,
      y = e.clientY - canvasRect.top,
      radius = this.ctx.lineWidth / 2;

    this.ctx.beginPath();
    this.draw(x, y, radius);
  }

  onMouseMove(e: MouseEvent) {
    if(this.isMouseDown){
      const
        canvasRect = this.canvas.getBoundingClientRect(),
        x = e.clientX - canvasRect.left,
        y = e.clientY - canvasRect.top,
        radius = this.ctx.lineWidth / 2;

      this.draw(x, y, radius);
    }
  }

  onMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  draw(x: number, y: number, radius: number){
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    const temp = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = temp;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

}

export default Brush;