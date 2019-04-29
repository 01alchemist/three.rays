class PrimRef {

    lower
    upper

    constructor(bounds:BBox3fa, geomID:int, primID:int) 
    {
      this.lower = bounds.lower; lower.a = geomID;
      this.upper = bounds.upper; upper.a = primID;
    }

    /*! calculates twice the center of the primitive */
    @inline center2():Vec3fa {
      return this.lower + this.upper;
    }
    
    /*! return the bounding box of the primitive */
    @inline bounds():BBox3fa {
      return new BBox3fa(lower,upper);
    }

    /*! size for bin heuristic is 1 */
    __forceinline unsigned size() const { 
      return 1;
    }

    /*! returns bounds and centroid used for binning */
    __forceinline void binBoundsAndCenter(BBox3fa& bounds_o, Vec3fa& center_o) const 
    {
      bounds_o = bounds();
      center_o = embree::center2(bounds_o);
    }

    __forceinline unsigned& geomIDref() {  // FIXME: remove !!!!!!!
      return lower.u;
    }
    __forceinline unsigned& primIDref() {  // FIXME: remove !!!!!!!
      return upper.u;
    }
    
    /*! returns the geometry ID */
    __forceinline unsigned geomID() const { 
      return lower.a;
    }

    /*! returns the primitive ID */
    __forceinline unsigned primID() const { 
      return upper.a;
    }

    /*! returns an size_t sized ID */
    __forceinline size_t ID() const { 
#if defined(__X86_64__)
      return size_t(lower.u) + (size_t(upper.u) << 32);
#else
      return size_t(lower.u);
#endif
    }

    /*! special function for operator< */
    __forceinline uint64_t ID64() const {
      return (((uint64_t)primID()) << 32) + (uint64_t)geomID();
    }
    
    /*! allows sorting the primrefs by ID */
    friend __forceinline bool operator<(const PrimRef& p0, const PrimRef& p1) {
      return p0.ID64() < p1.ID64();
    }

    /*! Outputs primitive reference to a stream. */
    friend __forceinline std::ostream& operator<<(std::ostream& cout, const PrimRef& ref) {
      return cout << "{ lower = " << ref.lower << ", upper = " << ref.upper << ", geomID = " << ref.geomID() << ", primID = " << ref.primID() << " }";
    }

  public:
    Vec3fa lower;     //!< lower bounds and geomID
    Vec3fa upper;     //!< upper bounds and primID
  }
