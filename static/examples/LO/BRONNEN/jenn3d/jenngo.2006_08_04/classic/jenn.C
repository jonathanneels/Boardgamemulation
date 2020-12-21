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

// jenn.C, copyright 2001-2005 Fritz Obermeyer

/** todo:
 * allow region & dead stone selection for scoring
 * fix todd-coxeter bug
 * add help screen
*/

#include <new> //for std::bad_alloc

#ifdef CYGWIN_HACKS
    #define GLUT_STATIC
#endif
#if defined(__APPLE__) && defined(__MACH__)
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif

#include <cmath>
#include <cstdlib>
#include <cstdio> //for sprintf
#include <vector>

#include "definitions.h"
#include "linalg.h"
#include "go_game.h"
#include "drawing.h"
#include "animation.h"

#define ESCKEY 27

const Logging::Logger logger("main", Logging::INFO);
//globals
ToddCoxeter::Graph *graph;
GoGame::GO *go;
Drawings::Drawing *drawing;
Animation::Animate *animate;

//[ functions for main window ]----------
bool in_stereo;
bool paused;
void _glut_update_projection ()
{
    float w = animate->w, h = animate->h;
    float W = in_stereo ? w/2 : w;
    animate->W = W;

    float scale = (W<h ? W : h) / 1000;
    drawing->set_style(scale, in_stereo);

    animate->w_factor = W / (h<W?h:W);
    animate->h_factor = h / (W<h?W:h);

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-animate->w_factor*animate->r, animate->w_factor*animate->r,
            -animate->h_factor*animate->r, animate->h_factor*animate->r,
            -animate->h_factor*animate->r, animate->h_factor*animate->r);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glutPostRedisplay();
}
void switch_to_mono ()
{
    logger.debug() << "switching to mono" |0;
    in_stereo = false;
    _glut_update_projection ();
}
void switch_to_stereo ()
{
    logger.debug() << "switching to stereo" |0;
    in_stereo = true;
    _glut_update_projection ();
}
void drift ();
void unpause ()
{
    if (not paused) return;
    paused = false;
    glutIdleFunc(drift);
    time_difference(); //so gap goes unnoticed
    animate->reset_veloc();
    animate->reset_accel();
}
void toggle_pause ()
{
    if (paused) {
        unpause();
    } else {
        glutIdleFunc(NULL);
        paused = true;
    }
}
void reshape (int w,int h)
{
    animate->w = w;
    animate->h = h;
    _glut_update_projection ();
}
void display ()
{
    glClear(GL_COLOR_BUFFER_BIT);

    GLsizei W = static_cast<GLsizei>(animate->W),
            h = static_cast<GLsizei>(animate->h);
    
    if (in_stereo) {
        glViewport(0,0,W,h);
        drawing->display(animate->theta);

        glViewport(W,0,W,h);
        glRotatef(+7.0f,0.0f,1.0f,0.0f);
        drawing->display();
        glRotatef(-7.0f,0.0f,1.0f,0.0f);
    } else {
        glViewport(0,0,W,h);
        drawing->display(animate->theta);
    }

    glutSwapBuffers();
}
void mouse (int button, int state, int w_x, int w_y)
{
    //calculate position
    float x =-animate->r * animate->w_factor * (1.0-(2.0*w_x)/animate->W);
    float y = animate->r * animate->h_factor * (1.0-(2.0*w_y)/animate->h);
    bool first_down = (animate->drag_channels == 0);
    if (first_down) {
        animate->drag_x = x;
        animate->drag_y = y;
        unpause();
        animate->reset_accel();
    }

    //update drag channels
    switch (button) {
    case GLUT_LEFT_BUTTON:
        if (state == GLUT_UP) animate->drag_channels &= 6; //turn off channel 0
        else                  animate->drag_channels |= 1; //turn on  channel 0
        break;
    case GLUT_RIGHT_BUTTON:
        if (state == GLUT_UP) animate->drag_channels &= 5; //turn off channel 1
        else                  animate->drag_channels |= 2; //turn on  channel 1
        break;
    case GLUT_MIDDLE_BUTTON:
        if (state == GLUT_UP) animate->drag_channels &= 3; //turn off channel 2
        else                  animate->drag_channels |= 4; //turn on  channel 2
    }

    //click on stones
    static float last_time = elapsed_time() - 1.0;
    static int last_button = 0;
    if (state == GLUT_DOWN) {
        int selected = drawing->select(x,y);
        if (selected < 0) return;
        int sel_state = go->state(selected);
        if (sel_state || go->highlighted[selected]) go->highlight(selected);

        float time = elapsed_time();
        bool double_click = (button == last_button) and (time-last_time < 0.5);
        if (double_click) {
            switch (button) {
            case GLUT_LEFT_BUTTON:   go->play(selected, 1); break;
            case GLUT_RIGHT_BUTTON:  go->play(selected, 2); break;
            }
            glutSetWindowTitle(go->get_score_status());

            last_button = 0;
            last_time = time - 1.0;
        } else {
            last_button = button;
            last_time = time;
        }
    }
}
void motion (int w_x, int w_y)
{
    float x =-animate->r * animate->w_factor * (1.0-(2.0*w_x)/animate->W);
    float y = animate->r * animate->h_factor * (1.0-(2.0*w_y)/animate->h);
    animate->rot_drag(x,y);
}
void drift ()
{
    float dt = time_difference();
    if (dt) animate->drift(dt);
    glutPostRedisplay();
}
void toggle_fullscreen ();
void keyboard (unsigned char key, int w_x, int w_y)
{
    switch (key) {
        case '1': switch_to_mono(); break;
        case '2': switch_to_stereo(); break;
        case ' ': animate->toggle_stopped(); break;
        case 'r':
            go->random_play(); 
            glutSetWindowTitle(go->get_score_status());
            break;
        case 'p': toggle_pause();
        case 'f': toggle_fullscreen(); break;
        case ESCKEY: exit(0); break;
    }
}
void special_keys (int key, int, int)
{
    switch (key) {
        case GLUT_KEY_LEFT:  go->back(); break;
        case GLUT_KEY_RIGHT: go->forward();    break;
    }
    glutSetWindowTitle(go->get_score_status()); 
}

//[ functions for control window ]----------
void control_display ()
{
    glClear(GL_COLOR_BUFFER_BIT);
}

//[ board selection ]----------
namespace Boards
{
//300-cell
const int cox_1[6] = {2,2,3,5,2,3};
const int gens_1 = (1<<0) + (1<<2) + (1<<3);

//~24-cell
const int cox_2[6] = {3,3,3,2,2,2};
const int gens_2 = 0;
}
void set_board (const int* coxeter, int gens)
{
    static bool board_exists = false;

    if (board_exists) {
        delete drawing;
        delete go;
        delete graph;
    }

    graph = new ToddCoxeter::Graph(coxeter, gens);
    go = new GoGame::GO(graph);
    drawing = new Drawings::Drawing(go);

    board_exists = true;
}
void board_selector (int key, int, int)
{
    logger.info() << "switching board" |0;
    using namespace Boards;
    switch (key) {
        case GLUT_KEY_F1: set_board(cox_1, gens_1); break;
        case GLUT_KEY_F2: set_board(cox_2, gens_2); break;
    }
}

//[ menus for glut ]----------
void select_board_size (int n)
{
    logger.info() << "switching to board " << n |0;
}

//[ glut manager class ]----------
class GlutManager
{
public:
    float width, height, radius;
    GlutManager::GlutManager(int *argc,char **argv);

    static void init_callbacks ();
    static void toggle_fullscreen ();
};
GlutManager::GlutManager(int *argc, char **argv)
{
    const int INIT_WIDTH=800, INIT_HEIGHT=600;
    //define main window
    glutInit(argc,argv);
    glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB);
    glutInitWindowSize(INIT_WIDTH, INIT_HEIGHT);
    animate->w = INIT_WIDTH;
    animate->h = INIT_HEIGHT;
    glutInitWindowPosition(50,50);
    int main_window = glutCreateWindow(argv[0]);
    glutSetWindowTitle(go->get_score_status()); 
    glutGameModeString("1600x1200:16");

    init_callbacks();
    switch_to_mono();
    glutMainLoop();
}
void GlutManager::init_callbacks ()
{
    //set callbacks
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutMouseFunc(mouse);
    glutKeyboardFunc(keyboard);
    //glutSpecialFunc(board_selector);
    glutSpecialFunc(special_keys);
    glutMotionFunc(motion);
    glutIdleFunc(drift);

    //set parameters
    glClearColor(COLOR_BG,0.0);
    glShadeModel(GL_FLAT);
#ifndef FAST_GL
    glEnable(GL_LINE_SMOOTH);
    glHint(GL_LINE_SMOOTH_HINT,GL_FASTEST);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);
#endif

    /*
    //define control window
    int control_panel = glutCreateSubWindow(main_window, 0, 0, 100, 100);
    glutDisplayFunc(control_display);
    glClearColor(COLOR_BG,0.0);

    //define menus
    int menu_num = glutCreateMenu(select_board_size);
    glutAddMenuEntry("n=300, d=4",1);
    glutAddMenuEntry("-cell",2);
    glutSetMenu(menu_num);
    glutAttachMenu(0);
    */
}
void GlutManager::toggle_fullscreen ()
{
    if (not glutGameModeGet(GLUT_GAME_MODE_ACTIVE)) {
        glutEnterGameMode();
        init_callbacks();
    } else {
        glutLeaveGameMode();
        //init_callbacks();
    }
}
void toggle_fullscreen () { GlutManager::toggle_fullscreen(); }

//[ main ]--------------------------------------------------

int main(int argc,char **argv)
{
    Logging::title("Jenn, a projective go board");

#ifndef CYGWIN_HACKS
    srand48(time_seed());
#endif

    //read coxeter matrix
    int coxeter[6] = {2,2,3,5,2,3};
    int gens = (1<<0) + (1<<2) + (1<<3);

    if (argc > 6) {
        for (int i = 0;i<6;i++) {
            coxeter[i] = atoi(argv[i+1]);
        }
        gens = 0;
        for (int i=0; i<argc-7; ++i) {
            gens += (1<<atoi(argv[i+7]));
        }
    }

    set_board (coxeter, gens);

    logger.debug() << "starting animator" |0;
    animate = new Animation::Animate();

    GlutManager gm(&argc,argv);
    
    return 0;
}



