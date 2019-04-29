class BBox<T> {
    constructor(public lower:T, public upper:T = null){
      if(!upper) {
        this.upper = lower
      }
    }

    @operator("=") assign(other:BBox) { this.lower = other.lower; this.upper = other.upper; return this; }

    ////////////////////////////////////////////////////////////////////////////////
    /// Extending Bounds
    ////////////////////////////////////////////////////////////////////////////////

    @inline extend(other:BBox) { this.lower = min(this.lower,other.lower); this.upper = max(this.upper,other.upper); return this; }
    @inline extendT(other:T) { this.lower = min(this.lower, other); this.upper = max(this.upper,other); return this; }

    /*! tests if box is empty */
    // @inline empty():boolean { for (let i = 0; i < T::N; i++) if (lower[i] > upper[i]) return true; return false; }
    @inline empty():boolean { return this.lower > this.upper }

    /*! computes the size of the box */
    @inline size():T { return this.upper - this.lower; }

    /*! computes the center of the box */
    @inline center():T { return 0.5 * (this.lower+this.upper); }

    /*! computes twice the center of the box */
    @inline center2():T { return this.lower+this.upper; }

    /*! merges two boxes */
    @inline static merge(a:BBox, b:BBox):BBox {
      return new BBox(min(a.lower, b.lower), max(a.upper, b.upper));
    }

     /*! enlarge box by some scaling factor */
    @inline enlarge_by(a:float):BBox {
      return BBox(lower - T(a)*abs(lower), upper + T(a)*abs(upper));
    }
    
    ////////////////////////////////////////////////////////////////////////////////
    /// Constants
    ////////////////////////////////////////////////////////////////////////////////

    // @inline BBox( EmptyTy ) : lower(pos_inf), upper(neg_inf) {}
    // @inline BBox( FullTy  ) : lower(neg_inf), upper(pos_inf) {}
    // @inline BBox( FalseTy ) : lower(pos_inf), upper(neg_inf) {}
    // @inline BBox( TrueTy  ) : lower(neg_inf), upper(pos_inf) {}
    // @inline BBox( NegInfTy ): lower(pos_inf), upper(neg_inf) {}
    // @inline BBox( PosInfTy ): lower(neg_inf), upper(pos_inf) {}
  }

// #if defined(__SSE__)
//   template<> @inline bool BBox<Vec3fa>::empty() const {
//     return !all(le_mask(lower,upper));
//   }
// #endif

  /*! tests if box is finite */
  @inline isvalid(v:BBox<Vec3fa>):boolean {
    return all(gt_mask(v.lower,Vec3fa_t(-FLT_LARGE)) & lt_mask(v.upper,Vec3fa_t(+FLT_LARGE)));
  }

  /*! tests if box has finite entries */
  @inline is_finite(b:BBox<Vec3fa>):boolean {
    return is_finite(b.lower) && is_finite(b.upper);
  }

  /*! test if point contained in box */
  @inline inside (b:BBox<Vec3fa>, p:Vec3fa):boolean { return all(ge_mask(p,b.lower) & le_mask(p,b.upper)); }

  /*! computes the center of the box */
  @inline center2(box:BBox<T>) { return box.lower + box.upper; }
  @inline center (box:BBox<T>) { return T(0.5) * center2(box); }

  /*! computes the volume of a bounding box */
  @inline volume    ( const BBox<Vec3fa>& b ):float { return reduce_mul(b.size()); }
  @inline safeVolume( const BBox<Vec3fa>& b ):float { if (b.empty()) return 0.0f; else return volume(b); }

  /*! computes the volume of a bounding box */
  @inline float volume( const BBox<Vec3f>& b )  { return reduce_mul(b.size()); }

  /*! computes the surface area of a bounding box */
  template<typename T> @inline const T area( const BBox<Vec2<T> >& b ) { const Vec2<T> d = b.size(); return d.x*d.y; }

  template<typename T> @inline const T halfArea( const BBox<Vec3<T> >& b ) { return halfArea(b.size()); }
  template<typename T> @inline const T     area( const BBox<Vec3<T> >& b ) { return 2.0f*halfArea(b); }

  @inline float halfArea( const BBox<Vec3fa>& b ) { return halfArea(b.size()); }
  @inline float     area( const BBox<Vec3fa>& b ) { return 2.0f*halfArea(b); }

  template<typename Vec> @inline float safeArea( const BBox<Vec>& b ) { if (b.empty()) return 0.0f; else return area(b); }

  template<typename T> @inline float expectedApproxHalfArea(const BBox<T>& box) {
    return halfArea(box);
  }

  /*! merges bounding boxes and points */
  template<typename T> @inline const BBox<T> merge( const BBox<T>& a, const       T& b ) { return BBox<T>(min(a.lower, b    ), max(a.upper, b    )); }
  template<typename T> @inline const BBox<T> merge( const       T& a, const BBox<T>& b ) { return BBox<T>(min(a    , b.lower), max(a    , b.upper)); }
  template<typename T> @inline const BBox<T> merge( const BBox<T>& a, const BBox<T>& b ) { return BBox<T>(min(a.lower, b.lower), max(a.upper, b.upper)); }

  /*! Merges three boxes. */
  template<typename T> @inline const BBox<T> merge( const BBox<T>& a, const BBox<T>& b, const BBox<T>& c ) { return merge(a,merge(b,c)); }

  /*! Merges four boxes. */
  template<typename T> @inline BBox<T> merge(const BBox<T>& a, const BBox<T>& b, const BBox<T>& c, const BBox<T>& d) {
    return merge(merge(a,b),merge(c,d));
  }

  /*! Comparison Operators */
  template<typename T> @inline bool operator==( const BBox<T>& a, const BBox<T>& b ) { return a.lower == b.lower && a.upper == b.upper; }
  template<typename T> @inline bool operator!=( const BBox<T>& a, const BBox<T>& b ) { return a.lower != b.lower || a.upper != b.upper; }

  /*! scaling */
  template<typename T> @inline BBox<T> operator *( const float& a, const BBox<T>& b ) { return BBox<T>(a*b.lower,a*b.upper); }
  template<typename T> @inline BBox<T> operator *( const     T& a, const BBox<T>& b ) { return BBox<T>(a*b.lower,a*b.upper); }

  /*! translations */
  template<typename T> @inline BBox<T> operator +( const BBox<T>& a, const BBox<T>& b ) { return BBox<T>(a.lower+b.lower,a.upper+b.upper); }
  template<typename T> @inline BBox<T> operator -( const BBox<T>& a, const BBox<T>& b ) { return BBox<T>(a.lower-b.lower,a.upper-b.upper); }
  template<typename T> @inline BBox<T> operator +( const BBox<T>& a, const      T & b ) { return BBox<T>(a.lower+b      ,a.upper+b      ); }
  template<typename T> @inline BBox<T> operator -( const BBox<T>& a, const      T & b ) { return BBox<T>(a.lower-b      ,a.upper-b      ); }

  /*! extension */
  template<typename T> @inline BBox<T> enlarge(const BBox<T>& a, const T& b) { return BBox<T>(a.lower-b, a.upper+b); }

  /*! intersect bounding boxes */
  template<typename T> @inline const BBox<T> intersect( const BBox<T>& a, const BBox<T>& b ) { return BBox<T>(max(a.lower, b.lower), min(a.upper, b.upper)); }
  template<typename T> @inline const BBox<T> intersect( const BBox<T>& a, const BBox<T>& b, const BBox<T>& c ) { return intersect(a,intersect(b,c)); }
  template<typename T> @inline const BBox<T> intersect( const BBox<T>& a, const BBox<T>& b, const BBox<T>& c, const BBox<T>& d ) { return intersect(intersect(a,b),intersect(c,d)); }

  /*! subtract bounds from each other */
  template<typename T> @inline void subtract(const BBox<T>& a, const BBox<T>& b, BBox<T>& c, BBox<T>& d)
  {
    c.lower = a.lower;
    c.upper = min(a.upper,b.lower);
    d.lower = max(a.lower,b.upper);
    d.upper = a.upper;
  }

  /*! tests if bounding boxes (and points) are disjoint (empty intersection) */
  template<typename T> __inline bool disjoint( const BBox<T>& a, const BBox<T>& b ) { return intersect(a,b).empty(); }
  template<typename T> __inline bool disjoint( const BBox<T>& a, const       T& b ) { return disjoint(a,BBox<T>(b)); }
  template<typename T> __inline bool disjoint( const       T& a, const BBox<T>& b ) { return disjoint(BBox<T>(a),b); }

  /*! tests if bounding boxes (and points) are conjoint (non-empty intersection) */
  template<typename T> __inline bool conjoint( const BBox<T>& a, const BBox<T>& b ) { return !intersect(a,b).empty(); }
  template<typename T> __inline bool conjoint( const BBox<T>& a, const       T& b ) { return conjoint(a,BBox<T>(b)); }
  template<typename T> __inline bool conjoint( const       T& a, const BBox<T>& b ) { return conjoint(BBox<T>(a),b); }

  /*! subset relation */
  template<typename T> __inline bool subset( const BBox<T>& a, const BBox<T>& b )
  { 
    for ( size_t i = 0; i < T::N; i++ ) if ( a.lower[i] < b.lower[i] ) return false;
    for ( size_t i = 0; i < T::N; i++ ) if ( a.upper[i] > b.upper[i] ) return false;
    return true; 
  }

  template<> __inline bool subset( const BBox<Vec3fa>& a, const BBox<Vec3fa>& b ) {
    return all(ge_mask(a.lower,b.lower)) & all(le_mask(a.upper,b.upper));
  }
  
  /*! blending */
  template<typename T>
    @inline BBox<T> lerp(const BBox<T>& b0, const BBox<T>& b1, const float t) {
    return BBox<T>(lerp(b0.lower,b1.lower,t),lerp(b0.upper,b1.upper,t));
  }

  /*! output operator */
  template<typename T> @inline std::ostream& operator<<(std::ostream& cout, const BBox<T>& box) {
    return cout << "[" << box.lower << "; " << box.upper << "]";
  }

  /*! default template instantiations */
  typedef BBox<float> BBox1f;
  typedef BBox<Vec2f> BBox2f;
  typedef BBox<Vec2fa> BBox2fa;
  typedef BBox<Vec3f> BBox3f;
  typedef BBox<Vec3fa> BBox3fa;
}

////////////////////////////////////////////////////////////////////////////////
/// SSE / AVX / MIC specializations
////////////////////////////////////////////////////////////////////////////////

#if defined __SSE__
#include "../simd/sse.h"
#endif

#if defined __AVX__
#include "../simd/avx.h"
#endif

#if defined(__AVX512F__)
#include "../simd/avx512.h"
#endif

namespace embree
{
  template<int N>
    @inline BBox<Vec3<vfloat<N>>> transpose(const BBox3fa* bounds);
  
  template<>
    @inline BBox<Vec3<vfloat4>> transpose<4>(const BBox3fa* bounds)
  {
    BBox<Vec3<vfloat4>> dest;
    
    transpose((vfloat4&)bounds[0].lower,
              (vfloat4&)bounds[1].lower,
              (vfloat4&)bounds[2].lower,
              (vfloat4&)bounds[3].lower,
              dest.lower.x,
              dest.lower.y,
              dest.lower.z);
    
    transpose((vfloat4&)bounds[0].upper,
              (vfloat4&)bounds[1].upper,
              (vfloat4&)bounds[2].upper,
              (vfloat4&)bounds[3].upper,
              dest.upper.x,
              dest.upper.y,
              dest.upper.z);
    
    return dest;
  }
  
#if defined(__AVX__)
  template<>
    @inline BBox<Vec3<vfloat8>> transpose<8>(const BBox3fa* bounds)
  {
    BBox<Vec3<vfloat8>> dest;
    
    transpose((vfloat4&)bounds[0].lower,
              (vfloat4&)bounds[1].lower,
              (vfloat4&)bounds[2].lower,
              (vfloat4&)bounds[3].lower,
              (vfloat4&)bounds[4].lower,
              (vfloat4&)bounds[5].lower,
              (vfloat4&)bounds[6].lower,
              (vfloat4&)bounds[7].lower,
              dest.lower.x,
              dest.lower.y,
              dest.lower.z);
    
    transpose((vfloat4&)bounds[0].upper,
              (vfloat4&)bounds[1].upper,
              (vfloat4&)bounds[2].upper,
              (vfloat4&)bounds[3].upper,
              (vfloat4&)bounds[4].upper,
              (vfloat4&)bounds[5].upper,
              (vfloat4&)bounds[6].upper,
              (vfloat4&)bounds[7].upper,
              dest.upper.x,
              dest.upper.y,
              dest.upper.z);
    
    return dest;
  }
#endif
  
  template<int N>
    @inline BBox3fa merge(const BBox3fa* bounds);
  
  template<>
    @inline BBox3fa merge<4>(const BBox3fa* bounds)
  {
    const Vec3fa lower = min(min(bounds[0].lower,bounds[1].lower),
                             min(bounds[2].lower,bounds[3].lower));
    const Vec3fa upper = max(max(bounds[0].upper,bounds[1].upper),
                             max(bounds[2].upper,bounds[3].upper));
    return BBox3fa(lower,upper);
  }
  
#if defined(__AVX__)
  template<>
    @inline BBox3fa merge<8>(const BBox3fa* bounds)
  {
    const Vec3fa lower = min(min(min(bounds[0].lower,bounds[1].lower),min(bounds[2].lower,bounds[3].lower)),
                             min(min(bounds[4].lower,bounds[5].lower),min(bounds[6].lower,bounds[7].lower)));
    const Vec3fa upper = max(max(max(bounds[0].upper,bounds[1].upper),max(bounds[2].upper,bounds[3].upper)),
                             max(max(bounds[4].upper,bounds[5].upper),max(bounds[6].upper,bounds[7].upper)));
    return BBox3fa(lower,upper);
  }
#endif
}

