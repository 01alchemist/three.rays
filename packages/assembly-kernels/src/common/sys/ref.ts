import { atom } from "./atomic";

export class RefCount {
  private refCounter: atom<int>
  constructor(val: int = 0) {
    this.refCounter = new atom<int>(val)
  }
  refInc():RefCount {
    this.refCounter.add(1);
    return this;
  }
  refDec():void {
    if(this.refCounter.add(-1) === 1){
      memory.free(<usize>this);
    }
  }
}
