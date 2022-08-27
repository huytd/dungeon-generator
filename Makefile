all: remove build

build:
	g++ -std=c++17 dungeon.cpp -o dungeon

remove:
	rm -f ./dungeon

gif:
	./dungeon | convert -scale 500% -delay 1x30 ppm:- gif:- | gifsicle -O3 > dungeon.gif
