import Store from "Store/Store";
import Tool from "./Tool";

class Rect extends Tool {
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
      this.ctx.fillRect(this.startX, this.startY, x - this.startX, y - this.startY);
    });
  }

}

export default Rect;