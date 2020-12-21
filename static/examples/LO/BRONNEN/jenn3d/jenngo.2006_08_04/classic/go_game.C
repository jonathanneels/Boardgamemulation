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


#include "go_game.h"

namespace GoGame
{

struct Group
{
    std::vector<int> members, liberties, neighbors;
    int state;
    Group (int v, GO* go);
    void remove (GO* go);
    void highlight (GO* go, int value=true);
    bool in_atari () { return liberties.size() == 1; }
};

inline bool safe_insert (int i, std::vector<int>& v)
{
    if (find(v.begin(), v.end(), i) == v.end()) {
        v.push_back(i);
        return true;
    }
    return false;
}
Group::Group (int v, GO* go)
    : members(1,v),
      liberties(0),
      neighbors(0),
      state(go->state(v))
{
    for (int i=0; i<members.size(); ++i) {
        int v1 = members[i];
        for (int j=0; j<go->graph->deg; ++j) {
            int v2 = go->graph->adj[v1][j];
            int s2 = go->state(v2);
            if (s2 == state) {
                safe_insert(v2, members);
                continue;
            }
            if (s2 == 0) {
                safe_insert(v2, liberties);
                continue;
            }
            if (s2 == other(state)) {
                safe_insert(v2, neighbors);
            }
        }
    }
    if (state && liberties.empty()) remove(go);
}
inline int weight (int s) { return (s == 2)?1:-1; }
void Group::remove (GO* go)
{
    go->score() += 2 * members.size() * weight(state);
    for (int i=0; i<members.size(); ++i) {
        go->state(members[i]) = 0;
    }
}
void Group::highlight (GO* go, int value)
{
    for (int i=0; i<members.size(); ++i) {
        go->highlighted[members[i]] = value;
    }
}

void GO::back ()
{
    if (time == 0) return;

    logger.debug() << "skipping back one frame" |0;
    --time;

    if (time) {
        //highlight differences
        std::vector<char> &now = history[time].state;
        std::vector<char> &then = history[time-1].state;
        for (int i=0; i<graph->ord; ++i) {
            highlighted[i] = !!(now[i] ^ then[i]);
        }
    } else {
        //highlight nothing
        for (int i=0; i<graph->ord; ++i) {
            highlighted[i] = false;
        }
    }
}
void GO::forward ()
{
    if (time+1 == history.size()) return;

    logger.debug() << "skipping back one frame" |0;
    ++time;

    //highlight differences
    std::vector<char> &now = history[time].state;
    std::vector<char> &then = history[time-1].state;
    for (int i=0; i<graph->ord; ++i) {
        highlighted[i] = !!(now[i] ^ then[i]);
    }
}
void GO::_push_state ()
{
    history.resize(++time);
    history.push_back(history.back());

    //highlight nothing
    for (int i=0; i<graph->ord; ++i) {
        highlighted[i] = false;
    }
}
void GO::play (int v, int s)
{
    if (s!=1 and s!=2) return;
    if (state(v) != 0) return;

    _push_state();

    if (s == 1) score() += 1;
    else        score() -= 1;
    state(v) = s;

    for (int j=0; j<graph->deg; ++j) {
        int v1 = graph->adj[v][j];
        if (state(v1) == other(s)) {
            //remove dead groups and highlight atari'd groups
            Group g(v1, this);
            if (g.in_atari()) g.highlight(this);
        }
    }

    //highlight played stone or its group if in atari
    Group g(v, this);
    if (g.in_atari()) g.highlight(this);
    else              highlighted[v] = true;
}
void GO::random_play ()
{
    static bool blacks_turn = true;

    //find empty space
    int empty = 0;
    do {
#ifdef CYGWIN_HACKS
        empty = rand() % graph->ord;
#else
        empty = lrand48() % graph->ord;
#endif
    } while (state(empty));

    if (blacks_turn) play(empty, 1);
    else             play(empty, 2);
    blacks_turn = not blacks_turn;
}
void GO::highlight (int v)
{
    Group(v,this).highlight(this, not highlighted[v]);
}
char* GO::get_score_status(void)
{
    if (score() == 0)
        sprintf(score_status,"Jenn: move %i, tie game", time);
    if (score() > 0)
        sprintf(score_status,"Jenn: move %i, black winning by %i", time, score());
    if (score() < 0)
        sprintf(score_status,"Jenn: move %i, white winning by %i", time, -score());
    return score_status;
}

}

