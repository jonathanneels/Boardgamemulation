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

#ifndef JENN_ANIMATION_H
#define JENN_ANIMATION_H

#include "definitions.h"

namespace Animation
{

const Logging::Logger logger("anime", Logging::INFO);

class Animate
{
public:
    float w, W, h, r,              //width, adjusted width, height, radius
          w_factor, h_factor;      //width and height scaling factors
    int drag_channels;             //bitfield of active drag channels
    float drag_x, drag_y;          //current dragging position
    float drag_dx, drag_dy;        //dragging differentials
    float noise0, noise1;          //process noise
    float decay0, decay1, decay2;  //drift damping
    float strength0;               //control strength
    bool stopped;                  //drift control
    float **theta,                 //rotational positions
          **omega,                 //rotational velocity
          **alpha,                 //rotational acceleration
          **delta,                 //rotational displacements
          **conj_part,             //conjugation part of delta
          **rot_part;              //rotation part of delta

    Animate ();
    ~Animate (void);

    void reset_veloc ();
    void reset_accel ();

    void rot_drag (float x, float y);
    void toggle_stopped ();
    void drift (float dt);
};

}

#endif

