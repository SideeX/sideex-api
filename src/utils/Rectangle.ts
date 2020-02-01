import { Point } from "./Point";
export class Rectangle {
    begin: Point
    end: Point
    constructor(left: number = 0, top: number = 0, right?: number, bottom?: number) {
        this.begin = new Point(left, top);
        this.end = new Point(right ? right : left, bottom ? bottom : top);
    }
    static fromRect(rect: ClientRect | DOMRect): Rectangle {
        return new Rectangle(rect.left, rect.top, rect.right, rect.bottom);
    }
    static isIntersection(a: Rectangle, b: Rectangle): boolean {
        const left = Math.max(a.left, b.left);
        const top = Math.max(a.top, b.top);
        const right = Math.min(a.right, b.right);
        const bottom = Math.min(a.bottom, b.bottom);
        return left < right && top < bottom;
    }
    static union(a: Rectangle, b: Rectangle): Rectangle {
        return new Rectangle(
            Math.min(a.left, b.left),
            Math.min(a.top, b.top),
            Math.max(a.right, b.right),
            Math.max(a.bottom, b.bottom)
        );
    }
    get left() { return this.begin.x; }
    set left(left: number) { this.begin.x = left; }
    get top() { return this.begin.y; }
    set top(top: number) { this.begin.y = top; }
    get right() { return this.end.x; }
    set right(right: number) { this.end.x = right; }
    get bottom() { return this.end.y; }
    set bottom(bottom: number) { this.end.y = bottom; }
    get width() { return Math.max(0, this.right - this.left); }
    get height() { return Math.max(0, this.bottom - this.top); }
    public addRectangle(that: Rectangle): Rectangle {
        return new Rectangle(
            this.left + that.left,
            this.top + that.top,
            this.right + that.right,
            this.bottom + that.bottom
        );
    }
    public addPointOffset(that: Point): Rectangle {
        return new Rectangle(
            this.left + that.x,
            this.top + that.y,
            this.right + that.x,
            this.bottom + that.y
        );
    }
}
