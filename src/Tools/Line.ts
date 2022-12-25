import Tool from "./Tool";

class Line extends Tool {
  save: string = '';
  startX: number = 0;
  startY: number = 0;

  onMouseDown(e: MouseEvent) {
    this.isMouseDown = true;

    const [x, y] = this.getParams(e);
    this.save = this.canvas.toDataURL();
    this.startX = x;
    this.startY = y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
  }

  onMouseMove(e: MouseEvent) {
    if (this.isMouseDown) {
      const [x, y, radius] = this.getParams(e);
      this.draw(x, y, radius);
    }
  }

  onMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  draw(x: number, y: number, radius: number){
    const img = new Image();
    img.src = this.save;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.drawCircle(this.startX, this.startY, radius);

      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      this.drawCircle(x, y, radius);
    }
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