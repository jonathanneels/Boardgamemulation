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

#ifndef JENN_GO_GAME_H
#define JENN_GO_GAME_H

#include <cmath>
#include <vector>

#include "definitions.h"
#include "todd_coxeter.h"

namespace GoGame
{

const Logging::Logger logger("go", Logging::INFO);

//[ simple go playing stuff ]----------

inline int other  (int s) { return (s == 2)?1:2; }

struct State
{
    std::vector<char> state;
    int score; //black winning by
    State () : state(0,0), score(0) {}
    State (int ord) : state(ord, 0), score(0) {}
};

class GO
{
public:
    std::vector<int> group;    
    int time;
    char score_status[80];
    ToddCoxeter::Graph *graph;
    std::vector<State> history;
    std::vector<bool> highlighted;
    
    GO (ToddCoxeter::Graph *_graph)
        : time(0),
          graph(_graph),
          history(1, graph->ord),
          highlighted(graph->ord, false)
    {}

    //status
    char& state (int v) { return history[time].state[v]; }
    int&  score ()      { return history[time].score; }
    char* get_score_status(void);

    //playing
    void play (int v,int s); //position, button number
    void random_play ();
    void highlight (int v);  //position

    //history traversal
    void back ();
    void forward ();
private:
    void _push_state ();
};

}

#endif

