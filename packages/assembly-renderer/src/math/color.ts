export class RGB<Num> {
    constructor(public r: Num, public g: Num, public b: Num) {}
    set(r: Num, g: Num, b: Num): RGB<Num> {
        this.r = r
        this.g = g
        this.b = b
        return this
    }
}
export class RGBA<Num> {
    constructor(public r: Num, public g: Num, public b: Num, public a: Num) {}
    set(r: Num, g: Num, b: Num, a: Num): RGBA<Num> {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
        return this
    }

    clone():RGBA<Num> {
        return new RGBA<Num>(this.r, this.g, this.b, this.a);
    }
}

export class Color64 extends RGBA<f64> {
    constructor(public r: f64 = 0, public g: f64 = 0, public b: f64 = 0, public a: f64 = 0) {
        super(r, g, b, a)
    }
}
export class Color32 extends RGBA<f32> {
    constructor(public r: f32 = 0, public g: f32 = 0, public b: f32 = 0, public a: f32 = 0) {
        super(r, g, b, a)
    }
}
export class Color16 extends RGBA<u16> {
    constructor(public r: u16 = 0, public g: u16 = 0, public b: u16 = 0, public a: u16 = 0) {
        super(r, g, b, a)
    }
}
export class Color8 extends RGBA<u8> {
    constructor(public r: u8 = 0, public g: u8 = 0, public b: u8 = 0, public a: u8 = 0) {
        super(r, g, b, a)
    }
}
export class Color extends Color64 {}
