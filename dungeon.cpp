#include <cstdlib>
#include <iostream>
#include <time.h>
#include <vector>
#include <stack>
#include <stdlib.h>
#include <emscripten.h>

using namespace std;

const int SIZE = 40;
const int ROOM_COUNT = 8;
const int ROOM_MAX_WIDTH = 15;
const int ROOM_MAX_HEIGHT = 10;

void print_map(int** map) {
	for (int i = 0; i < SIZE; i++) {
		for (int j = 0; j < SIZE; j++) {
			auto color = map[i][j] == 0 ? "\033[90m" : ( map[i][j] == 1 ? "\033[97m" : ( map[i][j] == 8 ? "\033[34m" : "\033[32m" ));
			auto reset = "\033[39m";
			cout << color << map[i][j] << reset << " ";
		}
		cout << endl;
	}
}

void place_room(int x, int y, int w, int h, int** map) {
	for (int i = y; i < y + h; i++) {
		for (int j = x; j < x + w; j++) {
			map[i][j] = 1;
		}
	}
}

struct Room {
	int x;
	int y;
	int w;
	int h;
};

bool between(int value, int min, int max)
{ return (value >= min) && (value <= max); }

bool overlap(Room A, Room B)
{
    bool xo = between(A.x, B.x, B.x + B.w) ||
              between(B.x, A.x, A.x + A.w);

    bool yo = between(A.y, B.y, B.y + B.h) ||
              between(B.y, A.y, A.y + A.h);

    return xo && yo;
}

bool overlap_with_exists_rooms(Room room, vector<Room> rooms) {
	for (Room r : rooms) {
		if (overlap(room, r)) {
			return true;
		}
	}
	return false;
}

bool room_within_map(Room room) {
	return ((room.x + room.w) < SIZE) && ((room.y + room.h) < SIZE);
}

int gen_number(int min, int max) {
	return rand() % max + min;
}

EMSCRIPTEN_KEEPALIVE
int** generate_map() {
	srand(time(NULL));

	int** map;
	map = new int*[SIZE];
	for (int i = 0; i < SIZE; i++) {
		map[i] = new int[SIZE];
	}

	vector<Room> rooms;

	// Randomly placing rooms
	while (rooms.size() < ROOM_COUNT) {
		int x = gen_number(5, SIZE - 5);
		int y = gen_number(5, SIZE - 5);
		int w = gen_number(5, ROOM_MAX_WIDTH);
		int h = gen_number(5, ROOM_MAX_HEIGHT);
		Room room = {x, y, w, h};
		if (!overlap_with_exists_rooms(room, rooms) && room_within_map(room)) {
			rooms.push_back(room);
			place_room(x, y, w, h, map);
		}
	}

	// Build corridors
	for (int i = 0; i < rooms.size(); i++) {
		for (int j = 0; j < rooms.size(); j++) {
			if (i != j) {
				// Horizontal paths
				if (between(rooms[i].y, rooms[j].y, rooms[j].y + rooms[j].h)) {
					int y = rooms[i].y + rooms[i].h / 2;
					for (int x = min(rooms[i].x, rooms[j].x); x < max(rooms[i].x, rooms[j].x); x++) {
						if (map[y-1][x] != 1 && map[y+1][x] != 1) {
							map[y][x] = 1;
						}
					}
				}

				// Vertical paths
				if (between(rooms[i].x, rooms[j].x, rooms[j].x + rooms[j].w)) {
					int x = rooms[i].x + rooms[i].w / 2;
					for (int y = min(rooms[i].y, rooms[j].y); y < max(rooms[i].y, rooms[j].y); y++) {
						if (map[y][x+1] != 1 && map[y][x-1] != 1) {
							map[y][x] = 1;
						}
					}
				}
			}
		}
	}

	// Door generating
	for (int row = 1; row < SIZE-1; row++) {
		for (int col = 1; col < SIZE-1; col++) {
			if (map[row][col] == 1 && map[row-1][col] == 1 && map[row+1][col] == 1 && map[row][col+1] == 1 && map[row][col-1] == 1) {
				if (map[row-1][col-1] == 0 || map[row-1][col+1] == 0 || map[row+1][col-1] == 0 || map[row+1][col+1] == 0) {
					map[row][col] = 8;
				}
			}
		}
	}

	// Placing stairs
	int in_x = rooms[0].x + rooms[0].w/2;
	int in_y = rooms[0].y + rooms[0].h/2;
	int out_x = rooms[ROOM_COUNT-1].x + rooms[ROOM_COUNT-1].w/2;
	int out_y = rooms[ROOM_COUNT-1].y + rooms[ROOM_COUNT-1].h/2;

	map[in_y][in_x] = 2;
	map[out_y][out_x] = 3;

	return map;
}

int main() {

	int** map = generate_map();
	print_map(map);

	return 0;
}
