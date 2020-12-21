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


#include "todd_coxeter.h"
#include "linalg.h"

#include <algorithm> //for sort

namespace ToddCoxeter
{

//[ coxeter group class ]----------
class Group
{
public:
    int ord;
    int **left;//left mult, inverse
    //std::vector<int[4]> left;
    std::vector<int> inv; //inverse table
    Group (std::vector<std::vector<int> > words);
    ~Group (void);
};

//[ coxeter matrix parsing ]----------

struct _CmpVectorSize
{
    bool operator()(const std::vector<int>& lhs, const std::vector<int>& rhs) const
    { return lhs.size() < rhs.size(); }
};
const _CmpVectorSize _cmpVectorSize = _CmpVectorSize();

typedef std::vector<std::vector<int> > Relations;
Relations words_from_coxeter(const int *coxeter)
{
    Relations words;
    int w=0;
    for (int i=0; i<3; ++i) {
        for (int j=i+1; j<4; ++j) {
            std::vector<int> word;
            for (int n=0; n<coxeter[w]; ++n) {
                word.push_back(i);
                word.push_back(j);
            }
            words.push_back(word);
            ++w;
        }
    }
    std::sort(words.begin(), words.end(), _cmpVectorSize);
    return words;
}

//[ processable collapsable vertex ]----------
class Vertex
{
public:
    Vertex *prev,*next;//process list structure
    Vertex *adj[4];//adjacency structure
    Vertex *rep;//equivalence structure
    int state;//additional sturcture
    Vertex *Beg(void);
    Vertex *End(void);
    Vertex *Rep(void);
    void move_before(Vertex *_next);
    void remove_before(void);
    int count(void);
    void equiv_to(Vertex *_v,Vertex *end);
    Vertex(void)
    {
        for(int i = 0;i<4;i++)
            adj[i]= NULL;
        prev = next = this;
        rep = this;
        state = 0;
    //logger.info() << "." |0;
    }
    Vertex(Vertex *_next)
    {
        for(int i = 0;i<4;i++)
            adj[i]= NULL;
        rep = this;
        state = 0;
        next =_next;
        prev = next->prev;//watch out for beg vertices
        next->prev = this;    
        prev->next = this;
    //logger.info() << "." |0;
    }
    ~Vertex(void)
    {
        if(next!= this) delete next;
    //logger.info() << "-" |0;
    }
};
void Vertex::move_before(Vertex *_next)
{
    if(this ==_next || this ==_next->prev) return;
    next->prev = prev;
    prev->next = next;
    prev =_next->prev;
    prev->next = this;
    next =_next;
    _next->prev = this;
}
void Vertex::remove_before(void)
{
    Vertex *v = prev;
    prev->prev->next = this;
    prev = prev->prev;
    v->next = NULL;
    delete v;
}
Vertex *Vertex::Beg(void)
{
    Vertex *beg = this;
    while(beg!= beg->prev) beg = beg->prev;
    return beg;
}
Vertex *Vertex::End(void)
{
    Vertex *end = this;
    while(end!= end->next) end = end->next;
    return end;
}
Vertex *Vertex::Rep(void)
{
    while(rep!= rep->rep) rep = rep->rep;
    return rep;
}          
int Vertex::count(void)//excluding end
{
    int i = 0;
    for(Vertex *v = Beg()->next;v!= v->next;v = v->next)
        i++;
    return i;
}
void Vertex::equiv_to(Vertex *_v,Vertex *end)
{ //function calling this must hold beg as reference
    if(_v == this) return;
    _v->rep = this;
    _v->move_before(end);
    //fill out equivs
    for(Vertex *v = end->prev;v!= v->next;v = v->next)
    {
        v->Rep();
        for(int r = 0;r<4;r++)
        {
            Vertex *var = v->adj[r];
            if(var!= NULL)
            {
                var = var->Rep();
                Vertex *vrar = v->rep->adj[r];
                if(vrar!= NULL)
                {
                    vrar = vrar->Rep();
                    if(vrar!= var)
                    {
                        if(var!= this)//can't suicide
                        {
                            var->rep = vrar;
                            var->move_before(end);
                        }
                        else
                        {
                            vrar->rep = var;
                            vrar->move_before(end);
                        }
                    }
                }
            }
        }
    }
    //collapse rep trees
    for(Vertex *v = end->prev;v!= v->rep;v = v->prev)
        v->Rep();
    //collapse adj and state structure
    for(Vertex *v = end->prev;v!= v->rep;v = v->prev)
    {
        v->rep->state|= v->state;
        for(int r = 0;r<4;r++)
            if(v->adj[r]!= NULL)
            {
                v->adj[r]->rep->adj[r]= v->rep;
                v->rep->adj[r]= v->adj[r]->rep;
            }
    }
    //delete removed vertices
    while(end->prev->rep!= end->prev)
        end->remove_before();
}

//[ tabular group ]----------
Group::Group(std::vector<std::vector<int> > words)
    : inv(0)
{
    //create vertex structure
    Vertex *v_beg,*v_end;
    try{ v_beg = new Vertex(); }
    catch(std::bad_alloc){ mem_err(); }
    try{ v_beg->next = new Vertex(); }
    catch(std::bad_alloc){ mem_err(); }
        v_beg->next->prev = v_beg;
    try{ v_beg->next->next = new Vertex(); }
    catch(std::bad_alloc){ mem_err(); }
        v_beg->next->next->prev = v_beg->next;
    v_end = v_beg->next->next;

    //build free graph of left-multiplication
    for (Vertex *v = v_beg->next;v!= v->next;v = v->next) {
        for (int w=0; w<6; ++w) {
            if (!(v->state & (1<<w))) {       //i'm so tired...
                std::vector<int>& word = words[w];
                Vertex *vnew = v;
                for (int i=0; i<word.size(); ++i) {
                    int j = word[i];
                    if (vnew->adj[j] == NULL) {
                        try{ vnew->adj[j]= new Vertex(v_end); }
                        catch(std::bad_alloc){ mem_err(); }
                        vnew->adj[j]->adj[j]= vnew;
                    }
                    vnew->state |= 1<<w;
                    vnew = vnew->adj[j];
                }
                v->equiv_to(vnew, v_end);
            }
        }
    }
    //states == 63.
    logger.info() << "free group built, order = " << v_beg->count() |0;

    //find largest element and collapse mod 2
    for (Vertex *v = v_end->prev; v != v->next; v = v->next) {
        for (int r=0; r<4; ++r) {
            if (v->adj[r]->state > 0) {
                v->adj[r]->state = 0;
                v->adj[r]->move_before(v_end);
            }
        }
        v->state = 0;
    }
    v_beg->next->equiv_to(v_end->prev, v_end);

    //count & name elements
    ord = 0;
    for (Vertex *v = v_beg->next; v != v->next; v = v->next) {
        v->state = ord++;
    }

    logger.debug() << "quotient built, order = " << ord |0;

    //build left mult table from graph
    try{ left = new int*[ord]; }
    catch(std::bad_alloc){ mem_err(); }
    for (int g = 0; g<ord; ++g) {
        try{ left[g] = new int[4]; }
        catch(std::bad_alloc){ mem_err(); }
    }
    for(Vertex *v = v_beg->next; v != v->next; v = v->next) {
        for(int j = 0; j<4; ++j) {
            left[v->state][j] = v->adj[j]->state;
        }
    }
    delete v_beg;
    logger.debug() << "left mult table built." |0;
    /*
    for(int c = 0;c<ord;c++)
    {
        logger.info() << "(" << left[c][0] |0;
        for(int j = 1;j<4;j++)
            logger.info() << " " << left[c][j] |0;
        logger.info() << ")" |0;
    }
    */

    //build inverse table
    std::vector<int> whence(ord, -1);
    std::vector<int> reached;
    reached.reserve(ord);

    //  start with identity element
    whence[0] = 0;
    reached.push_back(0);
    //  parse all other words
    for (int i=0; i<ord; ++i) {
        for (int j=0; j<4; ++j) {
            int v = reached[i];
            int g = left[v][j];
            if (whence[g] == -1) {
                whence[g] = j;
                reached.push_back(g);
            }
        }
    }
    //  trace back to identity
    std::vector<int>(ord, -1).swap(inv);
    for (int g=0; g<ord; ++g) {
        if (inv[g] == -1) { //for efficiency, traverse only half
            int g1 = g, g1_inv = 0;
            while (g1 != 0) {
                int j = whence[g1];
                g1_inv = left[g1_inv][j];
                g1     = left[g1]    [j];
            }
            inv[g] = g1_inv;
            inv[g1_inv] = g;
        }
    }
    logger.debug() << "inverse table built." |0;
    /*
    for (int c=0; c<ord; ++c) {
        logger.info() << inv[c] << " " |0;
    }
    */
}
Group::~Group(void)
{
    for(int g=0; g<ord; ++g) {
        delete left[g];
    }
    delete left;
}

//[ cayley coset graph with point reps ]----------
Graph::Graph(const int *coxeter, int gens)
{
    //define words
    std::vector<std::vector<int> > words = words_from_coxeter(coxeter);
    const Logging::fake_ostream& os = logger.debug();
    os << "relations =";
    for (int w=0; w<6; ++w) {
        std::vector<int> &word = words[w];
        os << "\n  ";
        for (int i=0; i<word.size(); ++i) {
            os << word[i];
        }
    }
    os |0;

    //build group
    Group *group = new Group(words);
    logger.debug() << "group->ord = " << group->ord |0;

    //build cosets and edge lists, and count ord
    std::vector<int> coset(group->ord, -1); //maps group elements to cosets
    ord = 0; //used as coset number
    std::vector<int> members;
    for (int g0=0; g0<group->ord; ++g0) {
        if (coset[g0] != -1) continue;

        int c0 = ord++;
        coset[g0] = c0;
        std::vector<int> members(1, g0);
        std::vector<int> others(0);
        for (int i=0; i<members.size(); ++i) {
            int g1 = members[i];
            for (int j=0; j<4; ++j) {
                int g2 = group->left[g1][j];
                int c2 = coset[g2];
                if (gens & (1<<j)) {
                    if (c2 == -1) {
                        coset[g2] = c0;
                        members.push_back(g2);
                    }
                } else {
                    if (c2 != -1) {
                        if (std::find(others.begin(), others.end(), c2)
                                == others.end()) {
                            others.push_back(c2);
                            adj[c2].push_back(c0);
                        }
                    }
                }
            }
        }
        adj.push_back(others);
    }
    deg = adj[0].size();
    logger.info() << "cosets & edge table built: "
        << " ord = " << ord
        << ", deg = " << deg |0;

    //build geometry
    float ***gen_reps;
    try{ gen_reps = new float**[4]; }
    catch(std::bad_alloc){ mem_err(); }
    for (int i=0; i<4; i++) {
        try{ gen_reps[i] = new float*[4]; }
        catch(std::bad_alloc){ mem_err(); }
        for (int j=0; j<4; ++j) {
            try { gen_reps[i][j] = new float[4]; }
            catch (std::bad_alloc) { mem_err(); }
        }
    }
    try { points = new float*[ord]; }
    catch(std::bad_alloc){ mem_err(); }
    for (int c=0; c<ord; ++c) {
        points[c] = new float[4];
    }
    std::vector<int> pointed(ord,0);
    build_geom(coxeter, gens, gen_reps, points[0]);
    pointed[0] = true;
    logger.debug() << "geometry built" |0;

    //build point sets
    std::vector<int> reached(0), is_reached(group->ord,0);
    reached.push_back(0);
    is_reached[0] = true;
    for (int i=0; i<group->ord; ++i) { //not efficient
        int v = reached[i];
        for (int j=0; j<4; ++j) {
            int g = group->inv[group->left[group->inv[v]][j]];
            if (not is_reached[g]) {
                if (not pointed[coset[g]]) {
                    vect_mult(gen_reps[j], points[coset[v]], points[coset[g]]);
                    pointed[coset[g]] = true;
                }
                reached.push_back(g);
                is_reached[g] = true;
            }
        }
    }

    //clean up
    delete group;
    for (int i=0; i<4; ++i) {
        for (int j=0; j<4; ++j) {
            delete gen_reps[i][j];
        }
        delete gen_reps[i];
    }
    delete gen_reps;
    logger.debug() << "point set built." |0;
}

}

