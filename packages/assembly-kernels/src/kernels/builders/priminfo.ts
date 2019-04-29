class CentGeom {
    
  constructor(public geomBounds:BBox = null, public centBounds:BBox3fa = null) {

  }
  extend_primref<PrimRef>(prim:PrimRef):void {
    var bounds:BBox;
    var center:Vec3fa;
    prim.binBoundsAndCenter(bounds,center);
    this.geomBounds.extend(bounds);
    this.centBounds.extend(center);
  }

      template<typename PrimRef> 
        __forceinline void extend_primref(const PrimRef& prim) 
      {
        BBox bounds; Vec3fa center;
        prim.binBoundsAndCenter(bounds,center);
        geomBounds.extend(bounds);
        centBounds.extend(center);
      }

       template<typename PrimRef> 
         __forceinline void extend_center2(const PrimRef& prim) 
       {
         BBox3fa bounds = prim.bounds();
         geomBounds.extend(bounds);
         centBounds.extend(bounds.center2());
       }
       
      __forceinline void extend(const BBox& geomBounds_) {
	geomBounds.extend(geomBounds_);
	centBounds.extend(center2(geomBounds_));
      }

      __forceinline void merge(const CentGeom& other) 
      {
	geomBounds.extend(other.geomBounds);
	centBounds.extend(other.centBounds);
      }

      static __forceinline const CentGeom merge2(const CentGeom& a, const CentGeom& b) {
        CentGeom r = a; r.merge(b); return r;
      }

    public:
      BBox geomBounds;   //!< geometry bounds of primitives
      BBox3fa centBounds;   //!< centroid bounds of primitives
    }

type PrimInfoMB = PrimInfoMBT<BBox>

class SetMB extends PrimInfoMB
    {
      static PARALLEL_THRESHOLD = 3 * 1024;
      static PARALLEL_FIND_BLOCK_SIZE = 1024;
      static PARALLEL_PARTITION_BLOCK_SIZE = 128;

      typedef mvector<PrimRefMB>* PrimRefVector;

      __forceinline SetMB() {}

       __forceinline SetMB(const PrimInfoMB& pinfo_i, PrimRefVector prims)
         : PrimInfoMB(pinfo_i), prims(prims) {}

      __forceinline SetMB(const PrimInfoMB& pinfo_i, PrimRefVector prims, range<size_t> object_range_in, BBox1f time_range_in)
        : PrimInfoMB(pinfo_i), prims(prims)
      {
        object_range = object_range_in;
        time_range = intersect(time_range,time_range_in);
      }
      
      __forceinline SetMB(const PrimInfoMB& pinfo_i, PrimRefVector prims, BBox1f time_range_in)
        : PrimInfoMB(pinfo_i), prims(prims)
      {
        time_range = intersect(time_range,time_range_in);
      }

      void deterministic_order() const 
      {
        /* required as parallel partition destroys original primitive order */
        PrimRefMB* prim = prims->data();
        std::sort(&prim[object_range.begin()],&prim[object_range.end()]);
      }

      template<typename RecalculatePrimRef>
      __forceinline LBBox3fa linearBounds(const RecalculatePrimRef& recalculatePrimRef) const
      {
        auto reduce = [&](const range<size_t>& r) -> LBBox3fa
        {
          LBBox3fa cbounds(empty);
          for (size_t j = r.begin(); j < r.end(); j++)
          {
            PrimRefMB& ref = (*prims)[j];
            const LBBox3fa bn = recalculatePrimRef.linearBounds(ref, time_range);
            cbounds.extend(bn);
          };
          return cbounds;
        };
        
        return parallel_reduce(object_range.begin(), object_range.end(), PARALLEL_FIND_BLOCK_SIZE, PARALLEL_THRESHOLD, LBBox3fa(empty),
                               reduce,
                               [&](const LBBox3fa& b0, const LBBox3fa& b1) -> LBBox3fa { return embree::merge(b0, b1); });
      }

      template<typename RecalculatePrimRef>
        __forceinline LBBox3fa linearBounds(const RecalculatePrimRef& recalculatePrimRef, const LinearSpace3fa& space) const
      {
        auto reduce = [&](const range<size_t>& r) -> LBBox3fa
        {
          LBBox3fa cbounds(empty);
          for (size_t j = r.begin(); j < r.end(); j++)
          {
            PrimRefMB& ref = (*prims)[j];
            const LBBox3fa bn = recalculatePrimRef.linearBounds(ref, time_range, space);
            cbounds.extend(bn);
          };
          return cbounds;
        };
        
        return parallel_reduce(object_range.begin(), object_range.end(), PARALLEL_FIND_BLOCK_SIZE, PARALLEL_THRESHOLD, LBBox3fa(empty),
                               reduce,
                               [&](const LBBox3fa& b0, const LBBox3fa& b1) -> LBBox3fa { return embree::merge(b0, b1); });
      }

      template<typename RecalculatePrimRef>
        const SetMB primInfo(const RecalculatePrimRef& recalculatePrimRef, const LinearSpace3fa& space) const
      {
        auto computePrimInfo = [&](const range<size_t>& r) -> PrimInfoMB
        {
          PrimInfoMB pinfo(empty);
          for (size_t j=r.begin(); j<r.end(); j++)
          {
            PrimRefMB& ref = (*prims)[j];
            PrimRefMB ref1 = recalculatePrimRef(ref,time_range,space);
            pinfo.add_primref(ref1);
          };
          return pinfo;
        };
        
        const PrimInfoMB pinfo = parallel_reduce(object_range.begin(), object_range.end(), PARALLEL_FIND_BLOCK_SIZE, PARALLEL_THRESHOLD, 
                                                 PrimInfoMB(empty), computePrimInfo, PrimInfoMB::merge2);

        return SetMB(pinfo,prims,object_range,time_range);
      }
      
    public:
      PrimRefVector prims;
    };
