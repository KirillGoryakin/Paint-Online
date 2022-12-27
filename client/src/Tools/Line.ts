import Store from "Store/Store";
import Tool from "./Tool";

class Line extends Tool {
  save: string = '';
  startX: number = 0;
  startY: number = 0;

  onMouseDown(e: MouseEvent) {
    super.onMouseDown(e);

    const [x, y] = this.getParams(e);
    this.save = this.canvas.toDataURL();
    this.startX = x;
    this.startY = y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
  }

  onMouseMove(e: MouseEvent) {
    super.onMouseMove(e);

    if (this.isMouseDown) {
      const [x, y, radius] = this.getParams(e);
      this.draw(x, y, radius);
    }
  }

  draw(x: number, y: number, radius: number){
    Store.drawImage(this.save, () => {
      this.drawCircle(this.startX, this.startY, radius);

      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      this.drawCircle(x, y, radius);
    });
  }
  
  drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    const temp = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = temp;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

}

export default Line;