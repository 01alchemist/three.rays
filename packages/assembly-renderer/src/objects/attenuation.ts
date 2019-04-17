/**
 * Created by Nidin Vinayakan on 09-01-2016.
 */
export class Attenuation {
  constructor(
    public constant: float = 1,
    public linear: float = 0,
    public quadratic: float = 0
  ) {}

  static fromJson(attenuation: Attenuation): Attenuation {
    if (!attenuation) {
      return NoAttenuation
    } else {
      return new Attenuation(
        attenuation.constant,
        attenuation.linear,
        attenuation.quadratic
      )
    }
  }

  compute(d: float): float {
    return 1 / (this.constant + this.linear * d + this.quadratic * d * d)
  }

  set(attenation: Attenuation): Attenuation {
    this.constant = attenation.constant
    this.linear = attenation.linear
    this.quadratic = attenation.quadratic
    return this
  }

  clone(): Attenuation {
    return new Attenuation(this.constant, this.linear, this.quadratic)
  }

  directWrite(mem: float[], offset: int): int {
    mem[offset++] = this.constant
    mem[offset++] = this.linear
    mem[offset++] = this.quadratic
    return offset
  }

  directRead(mem: float[], offset: int): int {
    this.constant = mem[offset++]
    this.linear = mem[offset++]
    this.quadratic = mem[offset++]
    return offset
  }
}

export const NoAttenuation: Attenuation = new Attenuation(1, 0, 0)

export class LinearAttenuation extends Attenuation {
  constructor(value: float) {
    super(1, value, 0)
  }
}

export class QuadraticAttenuation extends Attenuation {
  constructor(value: float) {
    super(1, 0, value)
  }
}
