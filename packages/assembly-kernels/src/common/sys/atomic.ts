export class atom<T> {
  private addr:usize;
  constructor(private val: T) {
    this.addr = memory.allocate(sizeof<T>())
    atomic.store<T>(this.addr, val);
  }
  
  @inline @operator("=")
  set(val:T):T {
    return atomic.store<T>(this.addr, val);
  }

  @inline value():T {
    return atomic.load<T>(this.addr);
  }

  @inline add(val:T):T {
    return atomic.add<T>(this.addr, val);
  }

  @inline sub(val:T):T {
    return atomic.sub<T>(this.addr, val);
  }
  
}
