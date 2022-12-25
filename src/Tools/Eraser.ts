import Tool from "./Tool";

class Eraser extends Tool {

  onMouseDown(e: MouseEvent) {
    this.isMouseDown = true;

    const [x, y, radius] = this.getParams(e);

    this.ctx.beginPath();
    this.draw(x, y, radius);
  }

  onMouseMove(e: MouseEvent) {
    if(this.isMouseDown){
      const [x, y, radius] = this.getParams(e);

      this.draw(x, y, radius);
    }
  }

  onMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  draw(x: number, y: number, radius: number){
    this.ctx.globalCompositeOperation = "destination-out";
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    this.ctx.globalCompositeOperation = "source-over";
  }

}

export default Eraser;