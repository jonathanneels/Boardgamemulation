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

#ifndef JENN_DRAWING_H
#define JENN_DRAWING_H

#include "definitions.h"
#include "go_game.h"
#include "linalg.h" //for hopf_phase

//[ depth sorting graph drawing ]----------
namespace Drawings
{

const Logging::Logger logger("draw", Logging::INFO);

//#define FAST_GL

#define COLOR_BG      0.9, 0.8,  0.5
#define POLY_SIDES 20

class Drawing
{
public:
    //data
    GoGame::GO *go;
    ToddCoxeter::Graph *graph;
    const int ord;
    std::vector<int> sorted;         //depth-sorted list
    std::vector<float*> centers;     //centers
    std::vector<float> radii;        //radii
    std::vector<float> phases;       //blinkin' hopf phases
    std::vector<float**> midpoints;  //mid-points between nodes
    float rad0;                      //standard radius size
    float **project;                 //orthogonal (pre-)projection matrix
    float poly0[POLY_SIDES][2];      //original polygon
    float poly1[POLY_SIDES][2];      //temporarily transformed polygon
    unsigned long f_edj, b_edj;      //bitmaps

    //ctors & dtors
    Drawing (GoGame::GO *_go);
    ~Drawing (void);

    //methods
    void set_glut_params ();
    void set_style (float scale, bool in_stereo);
    void display (float** theta);
    void display (); //using current projection
    int select (float x,float y);
private:
    void display_vertex (int v);
    void sort ();
    void reproject (int v);
    inline void re_mid (int v);
    inline void recenter(int v);
    inline void resize (int v);
};

}

#endif

