export class BBox<T> {
    constructor(public lower: T, public upper: T) {}
    empty(): boolean {
        return this.lower > this.upper
    }
    size(): T {
        return this.upper - this.lower
    }
    center(): T {
        return 0.5 * (this.lower + this.upper)
    }
    center2(): T {
        return this.lower + this.upper
    }
    // merge(a: BBox<T>, b: BBox<T>): BBox<T> {
    //     return new BBox(min(a.lower, b.lower), max(a.upper, b.upper))
    // }
}
