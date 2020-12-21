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


#include "linalg.h"

using namespace LinAlg;

void gs_ortho (float **M)
{ //gram-schmidt orthonormalization
    float coef,norm;
    for (int i=0; i<4; ++i) {
        for (int j=0; j<i; ++j) {
            coef = inner(M[i],M[j]);
            for (int k=0;k<4; ++k) M[i][k] -= coef*M[j][k];
        }
        norm = 0;
        for (int j=0; j<4; ++j) norm += sqr(M[i][j]);
        norm = sqrt(norm);
        for (int j=0; j<4; ++j) M[i][j] /= norm;
    }
}
void mat_iscale (float **a, float t)
{
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
            a[i][j]  *= t;
}
void mat_iadd (float **a, float**b)
{ //a +=b
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
            a[i][j]  += b[i][j];
}
void mat_mult (float **a,float**b,float**c)
{ //a*b->c
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
        {
            c[i][j] = a[i][0]*b[0][j];
            for (int k=1;k<4; ++k)
                c[i][j] += a[i][k]*b[k][j];
        }
}
void mat_conj (float **a,float**b,float**c)
{ //a*b*transpose(a)->c
    float temp[4][4];
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
        {
            temp[i][j] = a[0][i]*b[0][j];
            for (int k=1;k<4; ++k)
                temp[i][j] += a[k][i]*b[k][j];
        }          
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
        {
            c[i][j] = temp[i][0]*a[0][j];
            for (int k=1;k<4; ++k)
                c[i][j] += temp[i][k]*a[k][j];
        }
}
void mat_copy (float **a,float **b)
{ //a->b
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
            b[i][j] = a[i][j];
}
void vect_mult (float **a,float *b,float *c)
{ //a*b->c
    for (int i=0; i<4; ++i)
    {
        c[i] = a[i][0]*b[0];
        for (int j=1; j<4; ++j)
            c[i] += a[i][j]*b[j];
    }
}
void mat_zero (float **a)
{ //a->identity
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
            a[i][j] = 0;
}
void mat_identity (float **a)
{ //a->identity
    for (int i=0; i<4; ++i) {
        for (int j=0; j<4; ++j) {
            a[i][j] = (i==j) ? 1 : 0;
        }
    }
}
void mat_inverse (float **a,float**b)
{ //inv(a)->b
    float m[4][8];
    for (int i=0; i<4; ++i)
        for (int j=0; j<4; ++j)
        {
            m[i][j] = a[i][j];
            m[i][j+4] = (i==j) ? 1 : 0;
        }
    for (int i=0; i<4; ++i) { //clears below diagnol
        //ensure m[i][i]! = 0;
        for (int j=i+1; j<4 && sqr(m[i][i])<0.2f; ++j) {
            for (int k=i;k<8; ++k) {
                m[i][k] += m[j][k];
            }
        }
        for (int j=i+1; j<8; ++j) {
            m[i][j] /= m[i][i];
        }
        m[i][i] = 1;
        for (int j=i+1; j<4; ++j) {
            for (int k=i+1;k<8; ++k) {
                m[j][k] -= m[j][i]*m[i][k];
            }
            m[j][i] = 0;
        }
    }
    for (int i = 3; i>0; --i) { //clears above diagnol
        for (int j=i-1; j>=0; --j) {
            for (int k=i+1;k<8; ++k) {
                m[j][k] -= m[i][k]*m[j][i];
            }
            m[j][i] = 0;
        }
    }
    for (int i=0; i<4; ++i) {
        for (int j=0; j<4; ++j) {
            b[i][j] = m[i][j+4];
        }
    }
}
void print_matrix (float **a)
{
    for (int i=0; i<4; ++i) {
        const Logging::fake_ostream& os = logger.info();
        os << "matrix:\n" << a[i][0];
        for (int j=1; j<4; ++j)
            os << "\t" << a[i][j];
    }
}
inline float rand_unif ()
{
#ifndef CYGWIN_HACKS
    return drand48();
#else
    return static_cast<float>(rand()) / RAND_MAX;
#endif
}
float rand_gauss ()
{//box-muller
    static bool available = false;
    static float y = 0.0f;

    if (available) {
        available = false;
        return y;
    } else{
        float theta = 2.0f*M_PI*rand_unif();
        float r = sqrtf(-2.0f*logf(1.0f-rand_unif()));
        float x = r * cosf(theta);
        y = r * sinf(theta);
        available = true;
        return x;
    }
}
void rand_asym_mat (float **a, float sigma)
{
    for (int i=0; i<4; ++i) {
        a[i][i] = 0.0f;
        for (int j=0; j<i; ++j) {
            float t = M_SQRT2 * sigma * rand_gauss();
            a[i][j] = t;
            a[j][i] = -t;
        }
    }
}

//[ geometry stuff ]----------

void build_geom (const int *coxeter, int cogens,
                 float ***generators, float *origin)
{
    float *axis[4], *ortho[4], *cosine[4];
    for (int i = 0; i<4; ++i) {
        axis[i] = new float[4];
        ortho[i] = new float[4];
        cosine[i] = new float[4];
        //XXX: these are never freed!
    }

    //define cosines bewtween reflection planes
    for (int i = 0; i<4; ++i) {
        cosine[i][i] = 1;
    }
    cosine[1][0] = cos(M_PI/coxeter[0]);
    cosine[2][0] = cos(M_PI/coxeter[1]);
    cosine[3][0] = cos(M_PI/coxeter[2]);
    cosine[2][1] = cos(M_PI/coxeter[3]);
    cosine[3][1] = cos(M_PI/coxeter[4]);
    cosine[3][2] = cos(M_PI/coxeter[5]);

    //define normal vectors, i.e., reflection axes
    for (int i = 0; i<4; ++i)
        for (int j = 0; j<4; ++j)
            axis[i][j] = 0;
    axis[0][0] = 1;
    axis[1][0] = cosine[1][0];
    axis[1][1] = g_sqrt(1.0f - sqr(axis[1][0]));
    axis[2][0] = cosine[2][0];
    axis[2][1] = (cosine[2][1] - axis[2][0]*axis[1][0]) / axis[1][1];
    axis[2][2] = g_sqrt(1.0f-sqr(axis[2][0])-sqr(axis[2][1]));
    axis[3][0] = cosine[3][0];
    axis[3][1] = (cosine[3][1] - axis[3][0]*axis[1][0]) / axis[1][1];
    axis[3][2] = (cosine[3][2] - axis[3][0]*axis[2][0]
                 -axis[3][1]*axis[2][1]) / axis[2][2];
    axis[3][3] = g_sqrt(1.0f - sqr(axis[3][0]) - sqr(axis[3][1])
                 -sqr(axis[3][2]));

    //sanity check
    for (int i = 0; i<4; ++i) {
        for (int j = i; j<4; ++j) {
            Assert (fabs(inner(axis[i],axis[j]) - cosine[j][i]) < 1e-6,
                    "funkay business: axes don't jive with cosines");
        }
    }

    //define ortho
    mat_inverse(axis, ortho);
    for (int i=0; i<4; ++i) {
        /* don't normalize, else origin will be off center
        //normalize
        float norm = 0;
        for (int j=0; j<4; ++j) norm += sqr(ortho[j][i]);
        float n = sqrt(norm);
        float s = 1 / n;
        logger.debug() << "scaling axis " << i << " by " << s |0;
        for (int j=0; j<4; ++j) {
            ortho[j][i] *= s;
            axis [i][j] *= n;
        }
        */

        //realign others to make angles acute
        for (int j = i+1; j<4; ++j) {
            float ip = 0;
            for (int k=0; k<4; ++k) {
                ip += ortho[k][i] * ortho[k][j];
            }
            if (ip>=0) continue;
            logger.debug() << "flipping axis " << j |0;
            for (int k=0; k<4; ++k) {
                ortho[k][j] *= -1;
                axis [j][k] *= -1;
            }
        }
    }

    //define origin
    for (int j=0; j<4; ++j) {
        origin[j] = 0;
    }
    for (int i=0; i<4; ++i) {
        if (cogens & (1<<i)) continue;
        for (int j=0; j<4; ++j) {
            origin[j] += ortho[j][i];
        }
    }
    normalize(origin);

    //define reflectors
    for (int letter = 0;letter<4;letter++) {
        for (int j = 0;j<4;j++) {
            ortho[0][j] = axis[letter][j];
            for (int i = 0;i<letter;i++) {
                ortho[i+1][j] = (i == j)?1:0;
            }
            for (int i = letter+1;i<4;i++) {
                ortho[i][j] = (i == j)?1:0;
            }
        }
        gs_ortho(ortho);
        for (int i = 0; i<4; ++i) {
            for (int j = 0; j<4; ++j) {
                generators[letter][i][j] = -ortho[0][i] * ortho[0][j];
                for (int k = 1;k<4;k++)
                    generators[letter][i][j] += ortho[k][i] * ortho[k][j];
            }
        }
    }
}

float hopf_phase (float* e) //a 4-vector
{//phase from hopf fibration
    float r1 = sqrt(sqr(e[0]) + sqr(e[1]));
    float r2 = sqrt(sqr(e[2]) + sqr(e[3]));
    float x = r2 * e[0] + r1 * e[2];
    float y = r2 * e[1] + r1 * e[3];
    return atan2(x, y);
}

