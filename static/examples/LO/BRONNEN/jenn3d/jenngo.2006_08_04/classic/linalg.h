/*
This file is part of Jenn.
Copyright 2001-2006 Fritz Obermeyer.

Jenn is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

Jenn is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Jenn; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

#ifndef JENN_LINALG_H
#define JENN_LINALG_H

#include <cmath>

#include "definitions.h"

#ifndef M_PI
    #define M_PI 3.1415926535897
#endif

namespace LinAlg
{
const Logging::Logger logger("linalg", Logging::INFO);
}

//[ linear algebra shite ]----------------------------------

/* conventions:
  [x, y, z, w] - first two are screen space,
            - thrid is out-of-screen vector
            - fourth is the center (hidden) dimension
*/

inline float g_sqrt (float num) { return num>0 ? sqrt(num) : 0; }

inline float sqr (float num) { return num*num; }

inline float inner (float *a, float*b)//inner product
{
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
}

inline float norm (float *a)
{
    return sqrt(sqr(a[0]) + sqr(a[1]) + sqr(a[2]) + sqr(a[3]));
}

inline float r3_norm(float *a)
{
    return sqrt(sqr(a[0]) + sqr(a[1]) + sqr(a[2]));
}

inline float r3_dist_sqr(float *a, float *b)
{
    return sqr (a[0]-b[0]) + sqr(a[1]-b[1]) + sqr(a[2]-b[2]);
}

inline void normalize (float *a)
{
    const float norm = sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3]);
    a[0] /= norm;
    a[1] /= norm;
    a[2] /= norm;
    a[3] /= norm;
}

inline void r3_normalize(float *a)
{
    const float norm = sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    a[0] /= norm;
    a[1] /= norm;
    a[2] /= norm;
}

void gs_ortho (float **M);
void mat_iscale (float **a, float t);
void mat_iadd (float **a, float**b);
void mat_mult (float **a, float**b, float**c);
void mat_conj (float **a, float**b, float**c);
void mat_copy (float **a, float **b);
void vect_mult (float **a, float *b, float *c);
void mat_zero (float **a);
void mat_identity (float **a);
void mat_inverse (float **a, float**b);
void print_matrix (float**a);

float rand_gauss ();
void rand_asym_mat (float **a, float sigma=1.0f);

//[ geometry stuff ]----------

void build_geom (const int *coxeter, int cogens,
                 float ***generators, float *origin);
float hopf_phase (float* e);

#endif

