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

import "../sys/platform.h"
import "../sys/intrinsics.h"
import "constants.h"

@global @inline function isvalid(v: float): bool {
  return (v > -FLT_LARGE) & (v < +FLT_LARGE);
}

@global @inline function cast_f2i(f: float): int {
  returnconvert<i32>(f);
}

@global @inline function cast_i2f(i: int): float {
  return trunc<f32>(i);
}
