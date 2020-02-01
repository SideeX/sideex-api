export class Point {
    x: number
    y: number
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    public add(that: Point): Point {
        return new Point(this.x + that.x, this.y + that.y);
    }
    public sub(that: Point): Point {
        return new Point(this.x - that.x, this.y - that.y);
    }
}
