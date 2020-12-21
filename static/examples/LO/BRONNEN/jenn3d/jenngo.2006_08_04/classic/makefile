#makefile for Jenn

CC = g++

#OPT = -O3 -funroll-loops -pipe
OPT = -O3 -malign-double -fomit-frame-pointer -funroll-loops -pipe
#OPT = -O3 -m32 -march=prescott -mcpu=prescott -mmmx -msse -msse2 -msse3 -malign-double -fomit-frame-pointer -funroll-loops -fprefetch-loop-arrays -pipe
WARNINGS = -Wall
GL_LINUX = -lglut -lGLU -lGL
GL_MAC = -framework OpenGL -framework Glut
GL_CYGWIN = -lglut32 -lglu32 -lopengl32

current_target: jenn

##### switch this to whatever is appropriate for your platform #####

COMPILE_TYPE = mac
#COMPILE_TYPE = mac_debug
#COMPILE_TYPE = cygwin
#COMPILE_TYPE = linux
#COMPILE_TYPE = debug
#COMPILE_TYPE = profile

###### leave everything else the same #####

#compiler flags
ifeq ($(COMPILE_TYPE), mac)
	CPPFLAGS = -I/sw/include -DDEBUG_LEVEL=0 -DMAC_HACKS
	CXXFLAGS = -I/sw/include
	LDFLAGS  = -I/sw/include
	LIBS = $(GL_MAC)
endif
ifeq ($(COMPILE_TYPE), mac_debug)
	CPPFLAGS = -I/sw/include -DDEBUG_LEVEL=2 -DMAC_HACKS
	CXXFLAGS = -I/sw/include -ggdb
	LDFLAGS  = -I/sw/include -rdynamic -ggdb
	LIBS = $(GL_MAC)
endif
ifeq ($(COMPILE_TYPE), cygwin)
	CPPFLAGS = -DDEBUG_LEVEL=0 -DCYGWIN_HACKS
	CXXFLAGS = -static -mno-cygwin -mwin32
	LDFLAGS  = -static -mno-cygwin -mwin32
	LIBS = $(GL_CYGWIN)
endif
ifeq ($(COMPILE_TYPE), linux)
	CPPFLAGS = -DDEBUG_LEVEL=0
	CXXFLAGS = $(OPT)
	LDFLAGS  = $(OPT)
	LIBS = $(GL_LINUX)
endif
ifeq ($(COMPILE_TYPE), debug)
	CPPFLAGS = -DDEBUG_LEVEL=2
	CXXFLAGS = $(WARNINGS) -ggdb
	LDFLAGS  = -rdynamic -ggdb
	LIBS = $(GL_LINUX)
endif
ifeq ($(COMPILE_TYPE), profile)
	CPPFLAGS = -DDEBUG_LEVEL=0
	CXXFLAGS = -O2 -pg -ftest-coverage -fprofile-arcs
	LDFLAGS  = -O2 -pg -ftest-coverage -fprofile-arcs
	LIBS = $(GL_LINUX)
endif


#modules
definitions.o: definitions.C definitions.h
linalg.o: linalg.C linalg.h definitions.h
todd_coxeter.o: todd_coxeter.C todd_coxeter.h linalg.h definitions.h
go_game.o: go_game.C go_game.h linalg.h todd_coxeter.h definitions.h
drawing.o: drawing.C drawing.h linalg.h go_game.h definitions.h
animation.o: animation.C animation.h linalg.h definitions.h

#final product
JENN_O = jenn.o linalg.o todd_coxeter.o go_game.o animation.o drawing.o definitions.o
jenn.o: jenn.C linalg.h todd_coxeter.h drawing.h go_game.h animation.h definitions.h
jenn: $(JENN_O)
	$(CC) $(CXXFLAGS) -o jenn $(JENN_O) $(LIBS)

profile: jenn
	./jenn
	gcov drawing.C
	gprof -l -b jenn > jenn.prof
	gvim jenn.prof &
test: test.C
	$(CC) -o test test.C $(LIBS)

clean:
	rm -f core *.o jenn temp.*
