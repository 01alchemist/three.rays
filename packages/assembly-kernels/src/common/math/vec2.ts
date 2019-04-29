// ======================================================================== //
// Copyright 2009-2018 Intel Corporation                                    //
//                                                                          //
// Licensed under the Apache License, Version 2.0 (the "License");          //
// you may not use this file except in compliance with the License.         //
// You may obtain a copy of the License at                                  //
//                                                                          //
//     http://www.apache.org/licenses/LICENSE-2.0                           //
//                                                                          //
// Unless required by applicable law or agreed to in writing, software      //
// distributed under the License is distributed on an "AS IS" BASIS,        //
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. //
// See the License for the specific language governing permissions and      //
// limitations under the License.                                           //
// ======================================================================== //

import "math.h"

  ////////////////////////////////////////////////////////////////////////////////
  /// Generic 2D vector Class
  ////////////////////////////////////////////////////////////////////////////////

  export class Vec2<T>
  {
    static N = 2;

    ////////////////////////////////////////////////////////////////////////////////
    /// Construction
    ////////////////////////////////////////////////////////////////////////////////

    constructor(public x:T = 0, public y:T = 0) {
    }

    ////////////////////////////////////////////////////////////////////////////////
    /// Constants
    ////////////////////////////////////////////////////////////////////////////////

    // @inline Vec2( ZeroTy   ) : x(zero), y(zero) {}
    // @inline Vec2( OneTy    ) : x(one),  y(one) {}
    // @inline Vec2( PosInfTy ) : x(pos_inf), y(pos_inf) {}
    // @inline Vec2( NegInfTy ) : x(neg_inf), y(neg_inf) {}

    @inline @operator("[]") load(axis:int)
    { assert(axis < 2); return [axis]; }
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Unary Operators
  ////////////////////////////////////////////////////////////////////////////////

  @inline @operator("+") add(a:Vec2<T>) { return Vec2<T>(+a.x, +a.y); }
  template<typename T> @inline Vec2<T> operator -( const Vec2<T>& a ) { return Vec2<T>(-a.x, -a.y); }
  template<typename T> @inline Vec2<T> abs       ( const Vec2<T>& a ) { return Vec2<T>(abs  (a.x), abs  (a.y)); }
  template<typename T> @inline Vec2<T> rcp       ( const Vec2<T>& a ) { return Vec2<T>(rcp  (a.x), rcp  (a.y)); }
  template<typename T> @inline Vec2<T> rsqrt     ( const Vec2<T>& a ) { return Vec2<T>(rsqrt(a.x), rsqrt(a.y)); }
  template<typename T> @inline Vec2<T> sqrt      ( const Vec2<T>& a ) { return Vec2<T>(sqrt (a.x), sqrt (a.y)); }
  template<typename T> @inline Vec2<T> frac      ( const Vec2<T>& a ) { return Vec2<T>(frac (a.x), frac (a.y)); }

  ////////////////////////////////////////////////////////////////////////////////
  /// Binary Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline Vec2<T> operator +( const Vec2<T>& a, const Vec2<T>& b ) { return Vec2<T>(a.x + b.x, a.y + b.y); }
  template<typename T> @inline Vec2<T> operator +( const Vec2<T>& a, const       T& b ) { return Vec2<T>(a.x + b  , a.y + b  ); }
  template<typename T> @inline Vec2<T> operator +( const       T& a, const Vec2<T>& b ) { return Vec2<T>(a   + b.x, a   + b.y); }
  template<typename T> @inline Vec2<T> operator -( const Vec2<T>& a, const Vec2<T>& b ) { return Vec2<T>(a.x - b.x, a.y - b.y); }
  template<typename T> @inline Vec2<T> operator -( const Vec2<T>& a, const       T& b ) { return Vec2<T>(a.x - b  , a.y - b  ); }
  template<typename T> @inline Vec2<T> operator -( const       T& a, const Vec2<T>& b ) { return Vec2<T>(a   - b.x, a   - b.y); }
  template<typename T> @inline Vec2<T> operator *( const Vec2<T>& a, const Vec2<T>& b ) { return Vec2<T>(a.x * b.x, a.y * b.y); }
  template<typename T> @inline Vec2<T> operator *( const       T& a, const Vec2<T>& b ) { return Vec2<T>(a   * b.x, a   * b.y); }
  template<typename T> @inline Vec2<T> operator *( const Vec2<T>& a, const       T& b ) { return Vec2<T>(a.x * b  , a.y * b  ); }
  template<typename T> @inline Vec2<T> operator /( const Vec2<T>& a, const Vec2<T>& b ) { return Vec2<T>(a.x / b.x, a.y / b.y); }
  template<typename T> @inline Vec2<T> operator /( const Vec2<T>& a, const       T& b ) { return Vec2<T>(a.x / b  , a.y / b  ); }
  template<typename T> @inline Vec2<T> operator /( const       T& a, const Vec2<T>& b ) { return Vec2<T>(a   / b.x, a   / b.y); }

  template<typename T> @inline Vec2<T> min(const Vec2<T>& a, const Vec2<T>& b) { return Vec2<T>(min(a.x, b.x), min(a.y, b.y)); }
  template<typename T> @inline Vec2<T> max(const Vec2<T>& a, const Vec2<T>& b) { return Vec2<T>(max(a.x, b.x), max(a.y, b.y)); }

  ////////////////////////////////////////////////////////////////////////////////
  /// Ternary Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline Vec2<T> madd  ( const Vec2<T>& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>( madd(a.x,b.x,c.x), madd(a.y,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> msub  ( const Vec2<T>& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>( msub(a.x,b.x,c.x), msub(a.y,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> nmadd ( const Vec2<T>& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>(nmadd(a.x,b.x,c.x),nmadd(a.y,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> nmsub ( const Vec2<T>& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>(nmsub(a.x,b.x,c.x),nmsub(a.y,b.y,c.y) ); }

  template<typename T> @inline Vec2<T> madd  ( const T& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>( madd(a,b.x,c.x), madd(a,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> msub  ( const T& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>( msub(a,b.x,c.x), msub(a,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> nmadd ( const T& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>(nmadd(a,b.x,c.x),nmadd(a,b.y,c.y) ); }
  template<typename T> @inline Vec2<T> nmsub ( const T& a, const Vec2<T>& b, const Vec2<T>& c) { return Vec2<T>(nmsub(a,b.x,c.x),nmsub(a,b.y,c.y) ); }

  ////////////////////////////////////////////////////////////////////////////////
  /// Assignment Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline Vec2<T>& operator +=( Vec2<T>& a, const Vec2<T>& b ) { a.x += b.x; a.y += b.y; return a; }
  template<typename T> @inline Vec2<T>& operator -=( Vec2<T>& a, const Vec2<T>& b ) { a.x -= b.x; a.y -= b.y; return a; }
  template<typename T> @inline Vec2<T>& operator *=( Vec2<T>& a, const       T& b ) { a.x *= b  ; a.y *= b  ; return a; }
  template<typename T> @inline Vec2<T>& operator /=( Vec2<T>& a, const       T& b ) { a.x /= b  ; a.y /= b  ; return a; }

  ////////////////////////////////////////////////////////////////////////////////
  /// Reduction Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline T reduce_add( const Vec2<T>& a ) { return a.x + a.y; }
  template<typename T> @inline T reduce_mul( const Vec2<T>& a ) { return a.x * a.y; }
  template<typename T> @inline T reduce_min( const Vec2<T>& a ) { return min(a.x, a.y); }
  template<typename T> @inline T reduce_max( const Vec2<T>& a ) { return max(a.x, a.y); }

  ////////////////////////////////////////////////////////////////////////////////
  /// Comparison Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline bool operator ==( const Vec2<T>& a, const Vec2<T>& b ) { return a.x == b.x && a.y == b.y; }
  template<typename T> @inline bool operator !=( const Vec2<T>& a, const Vec2<T>& b ) { return a.x != b.x || a.y != b.y; }
  template<typename T> @inline bool operator < ( const Vec2<T>& a, const Vec2<T>& b ) {
    if (a.x != b.x) return a.x < b.x;
    if (a.y != b.y) return a.y < b.y;
    return false;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Shift Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline Vec2<T> shift_right_1( const Vec2<T>& a ) {
    return Vec2<T>(shift_right_1(a.x),shift_right_1(a.y));
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  /// Euclidian Space Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline T       dot      ( const Vec2<T>& a, const Vec2<T>& b ) { return madd(a.x,b.x,a.y*b.y); }
  template<typename T> @inline Vec2<T> cross    ( const Vec2<T>& a )                   { return Vec2<T>(-a.y,a.x); } 
  template<typename T> @inline T       length   ( const Vec2<T>& a )                   { return sqrt(dot(a,a)); }
  template<typename T> @inline Vec2<T> normalize( const Vec2<T>& a )                   { return a*rsqrt(dot(a,a)); }
  template<typename T> @inline T       distance ( const Vec2<T>& a, const Vec2<T>& b ) { return length(a-b); }
  template<typename T> @inline T       det      ( const Vec2<T>& a, const Vec2<T>& b ) { return a.x*b.y - a.y*b.x; }

  template<typename T> @inline Vec2<T> normalize_safe( const Vec2<T>& a ) {
    const T d = dot(a,a); return select(d == T( zero ),a, a*rsqrt(d) );
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Select
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> @inline Vec2<T> select ( bool s, const Vec2<T>& t, const Vec2<T>& f ) {
    return Vec2<T>(select(s,t.x,f.x),select(s,t.y,f.y));
  }

  template<typename T> @inline Vec2<T> select ( const Vec2<bool>& s, const Vec2<T>& t, const Vec2<T>& f ) {
    return Vec2<T>(select(s.x,t.x,f.x),select(s.y,t.y,f.y));
  }

  template<typename T> @inline Vec2<T> select ( const typename T::Bool& s, const Vec2<T>& t, const Vec2<T>& f ) {
    return Vec2<T>(select(s,t.x,f.x),select(s,t.y,f.y));
  }

  template<typename T>
    @inline Vec2<T> lerp(const Vec2<T>& v0, const Vec2<T>& v1, const T& t) {
    return madd(Vec2<T>(T(1.0f)-t),v0,t*v1);
  }

  template<typename T> @inline int maxDim ( const Vec2<T>& a )
  {
    const Vec2<T> b = abs(a);
    if (b.x > b.y) return 0;
    else return 1;
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Output Operators
  ////////////////////////////////////////////////////////////////////////////////

  template<typename T> inline std::ostream& operator<<(std::ostream& cout, const Vec2<T>& a) {
    return cout << "(" << a.x << ", " << a.y << ")";
  }

  ////////////////////////////////////////////////////////////////////////////////
  /// Default template instantiations
  ////////////////////////////////////////////////////////////////////////////////

  typedef Vec2<bool > Vec2b;
  typedef Vec2<int  > Vec2i;
  typedef Vec2<float> Vec2f;
}

#include "vec2fa.h"

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
  template<> @inline Vec2<float>::Vec2(const Vec2fa& a) : x(a.x), y(a.y) {}

#if defined(__SSE__)
  template<> @inline Vec2<vfloat4>::Vec2(const Vec2fa& a) : x(a.x), y(a.y) {}
#endif

#if defined(__AVX__)
  template<> @inline Vec2<vfloat8>::Vec2(const Vec2fa& a) : x(a.x), y(a.y) {}
#endif

#if defined(__AVX512F__)
  template<> @inline Vec2<vfloat16>::Vec2(const Vec2fa& a) : x(a.x), y(a.y) {}
#endif
}
