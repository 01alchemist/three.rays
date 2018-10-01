export class RGB<T> {
    constructor(public r: T, public g: T, public b: T) {}
    set(r: T, g: T, b: T): RGB<T> {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
}
export class RGBA<T> {
    constructor(public r: T, public g: T, public b: T, public a: T) {}
    set(r: T, g: T, b: T, a: T): RGBA<T> {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }
}
