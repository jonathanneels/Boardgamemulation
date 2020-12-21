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


#include "drawing.h"

#ifdef CYGWIN_HACKS
    #define GLUT_STATIC
#endif

#if defined(__APPLE__) && defined(__MACH__)
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif

#include <cmath>

#include "linalg.h"

namespace Drawings
{

//#define IN_STEREO

#define COLOR_LINE    0.1, 0.1,  0.1
#define COLOR_BLACK   0.0, 0.05, 0.1
#define COLOR_WHITE   1.0, 1.0,  1.0
#define COLOR_LIBERTY 0.2, 0.3,  1.0
#define COLOR_THREAT  1.0, 0.2,  0.1

#define RAD_EMPTY  0.25
#define RAD_FILLED 0.4

float WIDTH_LINE;
#define BASIC_WIDTH_LINE 2.0
float WIDTH_SHADOW;
float BASIC_WIDTH_SHADOW;
#define BASIC_WIDTH_SHADOW_STEREO 4.0
#define BASIC_WIDTH_SHADOW_MONO   8.0
#define BOLD_FACTOR 2.0

#define PASSIVE_OPACITY 0.3
#define ACTIVE_OPACITY  0.5

const float
    c_bg[4] = {COLOR_BG,   PASSIVE_OPACITY},
    c_ln[4] = {COLOR_LINE, PASSIVE_OPACITY},
    c_bb[4] = {.7*c_bg[0] + .3*c_ln[0], //bubble color
               .7*c_bg[1] + .3*c_ln[1],
               .7*c_bg[2] + .3*c_ln[2], PASSIVE_OPACITY},
    c_bl[4] = {COLOR_BLACK,   1.0},
    c_wh[4] = {COLOR_WHITE,   1.0},
    c_lb[4] = {COLOR_LIBERTY, ACTIVE_OPACITY},
    c_th[4] = {COLOR_THREAT,  ACTIVE_OPACITY};

Drawing::Drawing (GoGame::GO *_go)
    : go(_go),
      graph(go->graph),
      ord(graph->ord),
      sorted(ord, 0),
      centers(ord),
      radii(ord, 1.0),
      phases(ord, 0.0),
      midpoints(ord)
{
    //define standard node radius
    //rad0 = 0.5;
    rad0 = 0;
    for (int i = 0; i<4; ++i) {
        rad0 += sqr(graph->points[0][i] - graph->points[graph->adj[0][0]][i]);
    }
    rad0 = sqrt(rad0)/2;

    /* this doesn't look so good
    //define oscillation phases
    for (int v = 0; v < ord; ++v) {
        phases[v] = 2.0 * hopf_phase(graph->points[v]); //doesn't look so good
    }
    logger.debug() << "oscillation phases defined." |0;
    */

    //define pre-projection matrix
    try {
        project = new float*[4];
        for (int i = 0; i<4; ++i) { project[i]= new float[4]; }
    }
    catch(std::bad_alloc){ mem_err(); }
    mat_identity(project);
    logger.debug() << "projection built and set to identity." |0;

    //build center- and neighbor- arrays
    //LATER: make these contiguous arrays
    try {
        for (int v = 0; v < ord; ++v) {
            centers[v] = new float[4];
            midpoints[v] = new float*[graph->deg];
            for (int j = 0; j < graph->deg; ++j) {
                midpoints[v][j] = new float[4];
            }
        }
    }
    catch (std::bad_alloc) { mem_err(); }
    logger.debug() << "centers, midpoints built." |0;

    //define depth-sorted list
    for (int v = 0; v < ord; ++v) { sorted[v] = v; }
    logger.debug() << "sorted built and set to linear order." |0;

    //define original polygon
    for (int i = 0; i<POLY_SIDES; ++i) {
        poly0[i][0] = cos((2.0*M_PI*i)/POLY_SIDES);
        poly0[i][1] = sin((2.0*M_PI*i)/POLY_SIDES);
    }
}
Drawing::~Drawing (void)
{
    delete go;
    for (int i = 0; i < 4; ++i) { delete project[i]; }
    delete project;
    for (int v = 0; v < ord; ++v) {
        delete centers[v];
        for (int j = 0; j < graph->deg; ++j) { delete midpoints[v][j]; }
        delete midpoints[v];
    }
}

//interface
void Drawing::set_style(float scale, bool in_stereo)
{
    WIDTH_LINE = scale * BASIC_WIDTH_LINE;
    WIDTH_SHADOW = scale * (in_stereo ? BASIC_WIDTH_SHADOW_STEREO
                                      : BASIC_WIDTH_SHADOW_MONO);
#ifndef IN_STEREO
    if (in_stereo) {
        logger.info() << "this version not compliled with stereo" |0;
    }
#endif
}
void Drawing::display (float** theta)
{
    mat_copy(theta, project);
    for (int v = 0; v < ord; ++v) {
        reproject(v);
    }
    for (int v = 0; v < ord; ++v) {
        re_mid(v);
    }
    for (int v = 0; v < ord; ++v) {
        recenter(v);
        resize(v);
    }
    sort();
    display();
}
void Drawing::display ()
{
    for (int v = 0; v < ord; ++v) {
        if (centers[sorted[v]][3] < 10.0) { //arbitrary threshold; change LATER
            display_vertex(sorted[v]);
        }
    }
}
int Drawing::select (float x,float y)
{
    for (int n = ord-1; n >= 0; --n) {
        int v = sorted[n];
        if (sqr(x-centers[v][0]) + sqr(y-centers[v][1]) < sqr(radii[v])) {
            if (centers[v][3]<10.0) {
                return v;
            }
        }
    }
    return -1;
}

//private helper functions
void Drawing::display_vertex(int v)
{
    float e[6];       //edge point array {x1,y1,z1,x2,y2,z2}
    float dist;       //keeps lines away from the center of spheres
    float *color_bg;  //current background drawing color
    float *color_fg;  //current foreground drawing color
    float *color_fl;  //current fill color
    float width;      //current line width

    //define transformed polygon
    for (int i = 0; i < POLY_SIDES; ++i) {
        poly1[i][0] = centers[v][0] + radii[v]*poly0[i][0];
        poly1[i][1] = centers[v][1] + radii[v]*poly0[i][1];
    }

    //draw background lines
    for (int j = 0; j < graph->deg; ++j)
      if (midpoints[v][j][2] < centers[v][2]) {
        //calculate line location
        dist = sqrt( sqr(midpoints[v][j][0] - centers[v][0] )
                    +sqr(midpoints[v][j][1] - centers[v][1] )
                    +sqr(midpoints[v][j][2] - centers[v][2] ));
        float rho = radii[v] / dist;
        e[0] = midpoints[v][j][0] * rho  +  centers[v][0] * (1-rho);
        e[3] = midpoints[v][j][0];
        e[1] = midpoints[v][j][1] * rho  +  centers[v][1] * (1-rho);
        e[4] = midpoints[v][j][1];
#ifdef IN_STEREO
        e[2] = midpoints[v][j][2] * rho  +  centers[v][2] * (1-rho);
        e[5] = midpoints[v][j][2];
#endif

        //decide edge coloring & width
        int edge_state = (1<<go->state(v)) + (1<<go->state(graph->adj[v][j]));
        switch (edge_state) {
            case 2://empty-empty
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_ln);
                break;
            case 3://empty-black
            case 5://empty-white
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_lb);
                break;
            case 4://black-black
                width = BOLD_FACTOR*WIDTH_LINE;
                color_fg = const_cast<float*>(c_wh);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_bl);
                break;
            case 8://white-white
                width = BOLD_FACTOR*WIDTH_LINE;
                color_fg = const_cast<float*>(c_bl);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_wh);
                break;
            case 6://black-white
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_th);
                break;
        }

        //draw background border
        glLineWidth(width + 2*WIDTH_LINE+ 2*WIDTH_SHADOW);
        glColor4fv(color_bg);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
        //draw foreground border
        glLineWidth(width + 2*WIDTH_LINE);
        glColor4fv(color_fg);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
        //center fill
        glLineWidth(width);
        glColor4fv(color_fl);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
    }

    //draw circle
    switch (go->state(v)) {
        case 0:
            color_bg = const_cast<float*>(c_bg);
            color_fg = const_cast<float*>(c_ln);
            color_fl = const_cast<float*>(c_bb);
            break;
        case 1:
            color_bg = const_cast<float*>(c_bg);
            color_fg = const_cast<float*>(c_wh);
            color_fl = const_cast<float*>(c_bl);
            break;
        case 2:
            color_bg = const_cast<float*>(c_bg);
            color_fg = const_cast<float*>(c_bl);
            color_fl = const_cast<float*>(c_wh);
            break;
        default:
            logger.error() << "drawing: unknown vertex state: " << go->state(v) |0;
    }
    //  draw background outline
    glLineWidth(WIDTH_LINE + 2*WIDTH_SHADOW);
    glColor4fv(color_bg);
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    glBegin(GL_POLYGON);
    for (int i = 0; i < POLY_SIDES; ++i) {
#ifdef IN_STEREO
        glVertex3f(poly1[i][0], poly1[i][1], centers[v][2]);
#else
        glVertex2f(poly1[i][0], poly1[i][1]);
#endif
    }
    glEnd();
    //  draw filled center
    glLineWidth(0.0);
    glColor4fv(color_fl);
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
    glBegin(GL_POLYGON);
    for (int i = 0; i < POLY_SIDES; ++i) {
#ifdef IN_STEREO
        glVertex3f(poly1[i][0], poly1[i][1], centers[v][2]);
#else
        glVertex2f(poly1[i][0], poly1[i][1]);
#endif
    }
    glEnd();
    //  draw foreground outline
    glLineWidth(WIDTH_LINE);
    glColor4fv(color_fg);
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    glBegin(GL_POLYGON);
    for (int i = 0; i < POLY_SIDES; ++i) {
#ifdef IN_STEREO
        glVertex3f(poly1[i][0], poly1[i][1], centers[v][2]);
#else
        glVertex2f(poly1[i][0], poly1[i][1]);
#endif
    }
    glEnd();

    //draw foreground lines
    for (int j = 0; j < graph->deg; ++j)
      if (midpoints[v][j][2] >= centers[v][2]) {
        //calculate line location
        dist = sqrt( sqr(midpoints[v][j][0] - centers[v][0] )
                    +sqr(midpoints[v][j][1] - centers[v][1] )
                    +sqr(midpoints[v][j][2] - centers[v][2] ));
        float rho = radii[v] / dist;
        e[0] = midpoints[v][j][0] * rho  +  centers[v][0] * (1-rho);
        e[3] = midpoints[v][j][0];
        e[1] = midpoints[v][j][1] * rho  +  centers[v][1] * (1-rho);
        e[4] = midpoints[v][j][1];
#ifdef IN_STEREO
        e[2] = midpoints[v][j][2] * rho  +  centers[v][2] * (1-rho);
        e[5] = midpoints[v][j][2];
#endif

        //decide edge coloring & width
        int edge_state = (1<<go->state(v)) + (1<<go->state(graph->adj[v][j]));
        switch (edge_state) {
            case 2://empty-empty
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_ln);
                break;
            case 3://empty-black
            case 5://empty-white
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_lb);
                break;
            case 4://black-black
                width = BOLD_FACTOR*WIDTH_LINE;
                color_fg = const_cast<float*>(c_wh);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_bl);
                break;
            case 8://white-white
                width = BOLD_FACTOR*WIDTH_LINE;
                color_fg = const_cast<float*>(c_bl);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_wh);
                break;
            case 6://black-white
                width = WIDTH_LINE;
                color_fg = const_cast<float*>(c_bg);
                color_bg = const_cast<float*>(c_bg);
                color_fl = const_cast<float*>(c_th);
                break;
        }

        //draw background border
        glLineWidth(width + 2*WIDTH_LINE+ 2*WIDTH_SHADOW);
        glColor4fv(color_bg);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
        //draw foreground border
        glLineWidth(width + 2*WIDTH_LINE);
        glColor4fv(color_fg);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
        //center fill
        glLineWidth(width);
        glColor4fv(color_fl);
        glBegin(GL_LINES);
#ifdef IN_STEREO
            glVertex3f(e[0], e[1], e[2]);
            glVertex3f(e[3], e[4], e[5]);
#else
            glVertex2f(e[0], e[1]);
            glVertex2f(e[3], e[4]);
#endif
        glEnd();
    }
}
class DepthCmp
{
private:
    const int ord;
    float * const values;
public:
    DepthCmp (int _ord) : ord(_ord), values(new float[_ord])
    { logger.debug() << "init'ing DeptCmp of size " << ord |0; }
    //~DepthCmp () { delete[] values; } //this seems to crash
    void update(const std::vector<float *>& centers) const
    { for (int i=0; i<ord; ++i) values[i] = centers[i][2]; }
    bool operator () (int v1, int v2) const
    { return values[v1] < values[v2]; }
};
void Drawing::sort (void)
{//using stl's sorting algorithms
    static const DepthCmp cmp(ord);
    cmp.update(centers);
    std::sort(sorted.begin(), sorted.end(), cmp);
}
/* older version of sorting
class DepthCmp
{
private:
    typedef const std::vector<float *>& Centers ;
    Centers centers;
public:
    DepthCmp (Centers _centers) : centers(_centers) {}
    inline bool operator () (int v1, int v2) const
    { return centers[v1][2] < centers[v2][2]; }
};
void Drawing::sort (void)
{//using stl's sorting algorithms
    static const DepthCmp cmp(centers);
    std::sort(sorted.begin(), sorted.end(), cmp);
}
*/
void Drawing::reproject (int v)
{//updates a vertex's projecting from S^3 --> R^3
    vect_mult(project, graph->points[v], centers[v]);

    //swap vertex if it's in the outer hemihypersphere
    if (centers[v][3] < 0) {
        for (int i = 0; i<4; ++i) {
            centers[v][i] *= -1;
        }
    }

    radii[v] = 1 - r3_norm(centers[v])/(1+centers[v][3]);
}
inline void Drawing::re_mid(int v)
{//update modpoints between vertices
    for (int j = 0; j < graph->deg; ++j) {
        int v1 = graph->adj[v][j];
        if (inner(centers[v],centers[v1]) >= 0) {
            for (int i = 0; i < 4; ++i) {
                midpoints[v][j][i] = (centers[v][i] + centers[v1][i])/2;
            }
        } else {
            float c0,c1;
            c0 = radii[v1] / (radii[v] + radii[v1]);
            c1 = radii[v]  / (radii[v] + radii[v1]);
            for (int i = 0; i < 4; ++i) {
                midpoints[v][j][i] = c0*centers[v][i] - c1*centers[v1][i];
            }
        }
        normalize(midpoints[v][j]);
        midpoints[v][j][3] = 1 / (1 + midpoints[v][j][3]);
        for (int i = 0; i < 3; ++i) {
            midpoints[v][j][i] *= midpoints[v][j][3];
        }
    }
}
inline void Drawing::recenter (int v)
{
    centers[v][3] = 1 / (1+centers[v][3]);
    for (int i=0; i<3 ; ++i) {
        centers[v][i] *= centers[v][3];
    }
}
inline void Drawing::resize (int v)
{
    float r = rad0*centers[v][3];
    int s = go->state(v), h = go->highlighted[v];
    r *= s ? RAD_FILLED : RAD_EMPTY;
    if (h) {
        float phase =  phases[v] + (s==2) * M_PI;
        r *= (1.0 + 0.06 * sin(4*M_PI*elapsed_time() + phase));
    }
    if (radii[v] > r) { radii[v] = r; }
}

}


