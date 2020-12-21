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


#include "animation.h"
#include "linalg.h"

namespace Animation
{

//[ animation class ]----------
Animate::Animate ()
{
    r = 1.0f;

    noise0 = 0.04f;
    noise1 = 0.008f;
    decay0 = 0.1f;
    decay1 = 0.5f;
    decay2 = 10.0f;
    strength0 = 2.0f;
    stopped = true;

    //LATER: make these a contiguous array
    try {
        theta     = new float*[4];
        omega     = new float*[4];
        alpha     = new float*[4];
        delta     = new float*[4];
        conj_part = new float*[4];
        rot_part  = new float*[4];

        for (int i=0; i<4; ++i) {
            theta[i]     = new float[4];
            omega[i]     = new float[4];
            alpha[i]     = new float[4];
            delta[i]     = new float[4];
            conj_part[i] = new float[4];
            rot_part[i]  = new float[4];
        }
    
        mat_identity(theta); //initialize to identity
        reset_veloc();
        reset_accel();
    }
    catch (std::bad_alloc) { mem_err(); }
    logger.debug() << "matrices build and theta set to identity" |0;

    //make initial display
    drag_channels = 0;
}
Animate::~Animate (void)
{
    for (int i=0; i<4; ++i) {
        delete theta[i];
        delete delta[i];
        delete conj_part[i];
        delete rot_part[i];
    }
    delete theta;
    delete delta;
    delete conj_part;
    delete rot_part;
}
void Animate::reset_veloc () { mat_zero(omega); }
void Animate::reset_accel () { mat_zero(alpha); }
void Animate::rot_drag (float x, float y)
{
    //calculate displacements
    float dx = x - drag_x;  drag_x = x;
    float dy = y - drag_y;  drag_y = y;

    //rotate (z <--> w), (x <--> y)
    if (drag_channels & 1) {  //drag channel 0 is active
        alpha[0][2] += dx;
        alpha[2][0] -= dx;

        alpha[1][2] += dy;
        alpha[2][1] -= dy;
    }

    //rotate (x,y) <--> z
    if (drag_channels & 2) {  //drag channel 1 is active
        alpha[0][3] += dx;
        alpha[3][0] -= dx;

        alpha[1][3] += dy;
        alpha[3][1] -= dy;
    }

    //rotate (x,y) <--> w
    if (drag_channels & 4) {  //drag channel 2 is active
        alpha[0][1] += dx;
        alpha[1][0] -= dx;

        alpha[3][2] += dy;
        alpha[2][3] -= dy;
    }
}
void Animate::toggle_stopped ()
{
    //if (not stopped) { mat_iscale(omega, 0.5f); }
    stopped = not stopped;
}
void Animate::drift (float dt)
{
    //add noise
    float noise = sqrt(dt) * (stopped ? noise1 : noise0);
    rand_asym_mat(delta, noise);
    mat_iadd(omega, delta);

    //damp to slow down
    float decay = (stopped ? decay1 : decay0);
    float factor = exp(-dt * decay);
    mat_iscale(omega, factor);

    //control motion
    if (drag_channels) {
        float strength = strength0 * decay2;
        mat_iscale(alpha, strength);
        mat_iadd(omega, alpha);
        mat_zero(alpha);
        float factor = exp(-dt * decay2);
        mat_iscale(omega, factor);
    }

    //rotate theta by omega dt
    //mat_copy(omega, delta);
    mat_mult(omega, theta, delta);
    mat_iscale(delta, dt);
    mat_iadd(theta, delta);
    gs_ortho(theta);
}

}

