import './types';

export class Vector2 {
    constructor(public x: float, public y: float) {}
    set(x: float = 0.0, y: float = 0.0): Vector2 {
        this.x = x;
        this.y = y;
        return this;
    }
}
export class Vector3 {
    constructor(public x: float = 0.0, public y: float = 0.0, public z: float = 0.0) {}
    set(x: float, y: float, z: float): Vector3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
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
