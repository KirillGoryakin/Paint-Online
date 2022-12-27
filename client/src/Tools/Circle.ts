import Store from "Store/Store";
import Tool from "./Tool";

class Circle extends Tool {
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
      const [x, y] = this.getParams(e);
      this.draw(x, y);
    }
  }

  draw(x: number, y: number) {
    Store.drawImage(this.save, () => {
      this.ctx.beginPath();
      const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
      this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

}

export default Circle;