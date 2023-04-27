
class Pencil {
    constructor(posX, posY, color, ctx, lineWidth){
        this.antX = posX;
        this.antY = posY;
        this.posX = posX;
        this.posY = posY;
        this.color = color;
        this.ctx = ctx;
        this.lineWidth = lineWidth;
    }

    moveTo(posX, posY){
        this.antX = this.posX;
        this.antY = this.posY;
        this.posX = posX;
        this.posY = posY;
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.color;
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}