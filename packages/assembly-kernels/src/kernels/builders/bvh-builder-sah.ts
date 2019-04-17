import { RTCError } from "../../core/rtcore-device";

const travCost: float = 1.0
const DEFAULT_SINGLE_THREAD_THRESHOLD: int = 1024

class Settings {

    constructor(
        public branchingFactor: int = 2,          //!< branching factor of BVH to build
        public maxDepth: int = 32,                //!< maximum depth of BVH to build
        public logBlockSize: int = 0,             //!< log2 of blocksize for SAH heuristic
        public minLeafSize: int = 1,              //!< minimum size of a leaf
        public maxLeafSize: int = 8,              //!< maximum size of a leaf
        public travCost: float = 1.0,              //!< estimated cost of one traversal step
        public intCost: float = 1.0,               //!< estimated cost of one primitive intersection
        public singleThreadThreshold: int = 1024, //!< threshold when we switch to single threaded build
        public primrefarrayalloc: int = Infinity  //!< builder uses prim ref array to allocate nodes and leaves when a subtree of that size is finished
    ) {
    }
}

class BuildRecord {

}

type PrimRef = any;
type Heuristic = any;
type CreateAllocFunc = any;
type CreateNodeFunc = any;
type UpdateNodeFunc = any;
type CreateLeafFunc = any;
type ProgressMonitor = any;
type Allocator = any;
type ReductionTy = any;

class BuilderT {
  constructor(
    public prims:PrimRef,
    public heuristic: Heuristic,
    public createAlloc: CreateAllocFunc,
    public createNode: CreateNodeFunc,
    public updateNode: UpdateNodeFunc,
    public createLeaf: CreateLeafFunc,
    public progressMonitor: ProgressMonitor,
    public cfg: Settings
  )
  {
    if (cfg.branchingFactor > GeneralBVHBuilder.MAX_BRANCHING_FACTOR)
      throw new RTCError(RTCError.RTC_ERROR_UNKNOWN, "bvh_builder: branching factor too large");
  }

  createLargeLeaf(current:BuildRecord, alloc:Allocator):ReductionTy
  {
    /* this should never occur but is a fatal error */
    if (current.depth > this.cfg.maxDepth)
      throw new RTCError(RTCError.RTC_ERROR_UNKNOWN, "depth limit reached");

    /* create leaf for few primitives */
    if (current.prims.size() <= this.cfg.maxLeafSize)
      return this.createLeaf(this.prims, current.prims, alloc);

    /* fill all children by always splitting the largest one */
    let values:Array<ReductionTy> = new Array<ReductionTy>(GeneralBVHBuilder.MAX_BRANCHING_FACTOR);
    let children:Array<BuildRecord> = new Array<BuildRecord>(GeneralBVHBuilder.MAX_BRANCHING_FACTOR);
    let numChildren:int = 1;
    children[0] = current;
    
    do {

      /* find best child with largest bounding box area */
      let bestChild = -1;
      let bestSize = 0;
      for (let i = 0; i<numChildren; i++)
      {
        /* ignore leaves as they cannot get split */
        if (children[i].prims.size() <= this.cfg.maxLeafSize)
          continue;

        /* remember child with largest size */
        if (children[i].prims.size() > bestSize) {
          bestSize = children[i].prims.size();
          bestChild = i;
        }
      }
      if (bestChild === -1) break;

      /*! split best child into left and right child */
      let left:Array<BuildRecord> = new Array<BuildRecord>(current.depth+1);
      let right:Array<BuildRecord> = new Array<BuildRecord>(current.depth+1);
      this.heuristic.splitFallback(children[bestChild].prims,left.prims,right.prims);

      /* add new children left and right */
      children[bestChild] = children[numChildren-1];
      children[numChildren-1] = left;
      children[numChildren+0] = right;
      numChildren++;

    } while (numChildren < this.cfg.branchingFactor);

    /* set barrier for primrefarrayalloc */
    if (unlikely(current.size() > this.cfg.primrefarrayalloc))
      for (size_t i=0; i<numChildren; i++)
        children[i].alloc_barrier = children[i].size() <= this.cfg.primrefarrayalloc;

    /* create node */
    let node = createNode(children,numChildren,alloc);

    /* recurse into each child  and perform reduction */
    for (let i=0; i<numChildren; i++)
      values[i] = createLargeLeaf(children[i],alloc);

    /* perform reduction */
    return updateNode(current,children,node,values,numChildren);
  }

  recurse(current:BuildRecord, alloc:Allocator, toplevel:bool):ReductionTy
  {
    /* get thread local allocator */
    if (!alloc)
      alloc = this.createAlloc();

    /* call memory monitor function to signal progress */
    if (toplevel && current.size() <= this.cfg.singleThreadThreshold)
      progressMonitor(current.size());

    /*! find best split */
    auto split = heuristic.find(current.prims,this.cfg.logBlockSize);

    /*! compute leaf and split cost */
    const float leafSAH  = this.cfg.intCost*current.prims.leafSAH(this.cfg.logBlockSize);
    const float splitSAH = this.cfg.travCost*halfArea(current.prims.geomBounds)+this.cfg.intCost*split.splitSAH();
    assert((current.prims.size() == 0) || ((leafSAH >= 0) && (splitSAH >= 0)));

    /*! create a leaf node when threshold reached or SAH tells us to stop */
    if (current.prims.size() <= this.cfg.minLeafSize || current.depth+MIN_LARGE_LEAF_LEVELS >= this.cfg.maxDepth || (current.prims.size() <= this.cfg.maxLeafSize && leafSAH <= splitSAH)) {
      heuristic.deterministic_order(current.prims);
      return createLargeLeaf(current,alloc);
    }

    /*! perform initial split */
    let lprims:Set,rprims:Set;
    heuristic.split(split,current.prims,lprims,rprims);

    /*! initialize child list with initial split */
    let values:ReductionTy[] = new Array<ReductionTy>(GeneralBVHBuilder.MAX_BRANCHING_FACTOR);
    let children:BuildRecord[] = new Array<BuildRecord>(GeneralBVHBuilder.MAX_BRANCHING_FACTOR);
    children[0] = BuildRecord(current.depth+1,lprims);
    children[1] = BuildRecord(current.depth+1,rprims);
    let numChildren = 2;

    /*! split until node is full or SAH tells us to stop */
    while (numChildren < this.cfg.branchingFactor)
    {
      /*! find best child to split */
      let bestArea:float = neg_inf;
      let bestChild = -1;
      for (let i = 0; i < numChildren; i++)
      {
        /* ignore leaves as they cannot get split */
        if (children[i].prims.size() <= this.cfg.minLeafSize) continue;

        /* find child with largest surface area */
        if (halfArea(children[i].prims.geomBounds) > bestArea) {
          bestChild = i;
          bestArea = halfArea(children[i].prims.geomBounds);
        }
      }
      if (bestChild == -1) break;

      /* perform best found split */
      let brecord:BuildRecord = children[bestChild];
      let lrecord:BuildRecord = (current.depth+1);
      let rrecord:BuildRecord = (current.depth+1);
      let split = heuristic.find(brecord.prims,this.cfg.logBlockSize);
      heuristic.split(split,brecord.prims,lrecord.prims,rrecord.prims);
      children[bestChild] = lrecord;
      children[numChildren] = rrecord;
      numChildren++;
    }

    /* set barrier for primrefarrayalloc */
    if (unlikely(current.size() > this.cfg.primrefarrayalloc))
      for (let i = 0; i < numChildren; i++) {
        children[i].alloc_barrier = children[i].size() <= this.cfg.primrefarrayalloc;
      }

    /* sort buildrecords for faster shadow ray traversal */
    // std::sort(&children[0],&children[numChildren],std::greater<BuildRecord>());

    /*! create an inner node */
    let node = createNode(children,numChildren,alloc);

    /* spawn tasks */
    if (current.size() > this.cfg.singleThreadThreshold)
    {
      /*! parallel_for is faster than spawing sub-tasks */
      // parallel_for(size_t(0), numChildren, [&] (const range<size_t>& r) { // FIXME: no range here
          for (let i = r.begin(); i < r.end(); i++) {
            values[i] = recurse(children[i], nullptr,true);
            // _mm_mfence(); // to allow non-temporal stores during build
          }
        // });

      return updateNode(current,children,node,values,numChildren);
    }
    /* recurse into each child */
    else
    {
      for (let i = 0; i < numChildren; i++)
        values[i] = recurse(children[i],alloc,false);

      return updateNode(current,children,node,values,numChildren);
    }
  }
}

export class GeneralBVHBuilder {
    static MAX_BRANCHING_FACTOR: int = 8 //!< maximum supported BVH branching factor
    static MIN_LARGE_LEAF_LEVELS: int = 8 //!< create balanced tree of we are that many levels before the maximum tree depth

    constructor() {
    }

    build(heuristic: Heuristic,
          prims: PrimRef,
          set: Set,
          createAlloc: CreateAllocFunc,
          createNode: CreateNodeFunc,
          updateNode: UpdateNodeFunc,
          createLeaf: CreateLeafFunc,
          progressMonitor: ProgressMonitor,
          settings: Settings): ReductionTy {
    }
}

export class BVHBuilderBinnedSAH {
    constructor() {
    }
}

export class BVHBuilderBinnedFastSpatialSAH {
    constructor() {
    }
}

export class BVHBuilderBinnedOpenMergeSAH {
    constructor() {
    }
}
