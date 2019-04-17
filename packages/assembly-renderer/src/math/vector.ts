import '../types';

export class Vector2 {
    constructor(public x: float, public y: float) {}
    set(x: float = 0.0, y: float = 0.0): Vector2 {
        this.x = x;
        this.y = y;
        return this;
    }
}
export class Vector3 {
    
    static normalized(x:float, y:float, z:float): Vector3 {
        let d = NativeMath.sqrt(x * x + y * y + z * z)
        return new Vector3(x / d, y / d, z / d);
    }

    constructor(public x: float = 0.0, public y: float = 0.0, public z: float = 0.0) {}
    set(x: float, y: float, z: float): Vector3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    length():float {
        return NativeMath.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(b: Vector3):float {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }

    cross(b: Vector3): Vector3 {
        let x = this.y * b.z - this.z * b.y;
        let y = this.z * b.x - this.x * b.z;
        let z = this.x * b.y - this.y * b.x;
        return new Vector3(x, y, z);
    }

    normalize(): Vector3 {
        let d = this.length();
        return new Vector3(this.x / d, this.y / d, this.z / d);
    }

    add(b: Vector3): Vector3 {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    }

    sub(b: Vector3): Vector3 {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    mul(b: Vector3): Vector3 {
        return new Vector3(this.x * b.x, this.y * b.y, this.z * b.z);
    }

    div(b: Vector3): Vector3 {
        return new Vector3(this.x / b.x, this.y / b.y, this.z / b.z);
    }

    mulScalar(b): Vector3 {
        return new Vector3(this.x * b, this.y * b, this.z * b);
    }

    divScalar(b): Vector3 {
        return new Vector3(this.x / b, this.y / b, this.z / b);
    }

    min(b: Vector3): Vector3 {
        return new Vector3(NativeMath.min(this.x, b.x), NativeMath.min(this.y, b.y), NativeMath.min(this.z, b.z));
    }

    max(b: Vector3): Vector3 {
        return new Vector3(NativeMath.max(this.x, b.x), NativeMath.max(this.y, b.y), NativeMath.max(this.z, b.z));
    }

    minAxis(): Vector3 {
        let x = NativeMath.abs(this.x);
        let y = NativeMath.abs(this.y);
        let z = NativeMath.abs(this.z);
        if (x <= y && x <= z) {
            return new Vector3(1, 0, 0);
        } else if (y <= x && y <= z) {
            return new Vector3(0, 1, 0);
        }
        return new Vector3(0, 0, 1);
    }

    minComponent():float {
        return NativeMath.min(NativeMath.min(this.x, this.y), this.z);
    }

    reflect(i: Vector3): Vector3 {
        return i.sub(this.mulScalar(2 * this.dot(i)));
    }

    refract(i: Vector3, n1:float, n2:float): Vector3 {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return new Vector3();
        }
        let cosT = NativeMath.sqrt(1 - sinT2);
        return i.mulScalar(nr).add(this.mulScalar(nr * cosI - cosT));
    }

    reflectance(i: Vector3, n1: float, n2: float):float {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1;
        }
        let cosT = NativeMath.sqrt(1 - sinT2);
        let rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }

    toString(): string {
        return '(' + this.x + ',' + this.y + ',' + this.z + ')';
    }

    equals(v: Vector3): bool {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    isZero(): bool {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }
}
export class Vector4 {
    constructor(public x: float = 0.0, public y: float = 0.0, public z: float = 0.0, public w: float = 0.0) {}
    set(x: float, y: float, z: float, w: float): Vector4 {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
}
