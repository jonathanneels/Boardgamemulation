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

#ifndef JENN_TODD_COXETER_H
#define JENN_TODD_COXETER_H

#include "definitions.h"
#include <vector>

namespace ToddCoxeter
{

const Logging::Logger logger("t/c", Logging::INFO);

//cayley coset graph
class Graph
{
public:
    int ord, deg;
    std::vector<std::vector<int> > adj; //[coset][edge]
    float **points;
    Graph (const int *coxeter, int gens);
  
};

}

#endif

