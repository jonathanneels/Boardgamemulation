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


#include "definitions.h"

#include <sys/time.h>

//================================ logging ================================

namespace Logging
{
#ifdef LOG_FILE
//std::ofstream logFile(LOG_FILE, std::ios_base::app);
std::ofstream logFile(LOG_FILE);
#endif

//title/section label
void title (std::string name)
{
    live_out << "\033[32m================ " << name
             << " ================\033[37m" |0; //green
}

//indentation stuff
int indentLevel(0);

//time measurement
timeval g_begin_time, g_current_time;
const int g_time_is_available(gettimeofday(&g_begin_time, NULL));
inline void update_time () { gettimeofday(&g_current_time, NULL); }
inline float elapsed_time ()
{
    update_time();
    float result = g_current_time.tv_sec - g_begin_time.tv_sec;
    static const int res = 10; //in milliseconds
    result += (res*1e-6) * ((g_current_time.tv_usec - g_begin_time.tv_usec)/res);
    return result;
}

//log channels
const fake_ostream& Logger::active_log (LogLevel level) const
{
    return live_out << elapsed_time() << '\t'
                    << levelNames[level] << '\t'
                    << m_name << '\t'
                    << indentation();
}

}

//[ time measurement ]----------------------------------
long time_seed ()
{
    timeval now;
    gettimeofday(&now, NULL);
    long result = 1000000L * now.tv_sec;
    result += now.tv_usec;
    return result;
}
float elapsed_time ()
{
    static timeval start, now;
    static int started(gettimeofday(&start, NULL));
    gettimeofday(&now, NULL);
    float result = now.tv_sec - start.tv_sec;
    result += 1e-6 * (now.tv_usec - start.tv_usec);
    return result;
}
float time_difference ()
{
    static timeval g_this_time, g_last_time;
    static int g_time_is_available(gettimeofday(&g_last_time, NULL));
    gettimeofday(&g_this_time, NULL);
    float result = g_this_time.tv_sec - g_last_time.tv_sec;
    result += 1e-6 * (g_this_time.tv_usec - g_last_time.tv_usec);
    gettimeofday(&g_last_time, NULL);
    return result;
}

