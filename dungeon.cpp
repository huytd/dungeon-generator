#include <cstdlib>
#include <iostream>
#include <time.h>
#include <vector>
#include <stack>
#include <stdlib.h>

using namespace std;

const int SIZE = 40;
const int ROOM_COUNT = 8;
const int ROOM_MAX_WIDTH = 15;
const int ROOM_MAX_HEIGHT = 10;

void print_map(int map[][SIZE]) {
	for (int i = 0; i < SIZE; i++) {
		for (int j = 0; j < SIZE; j++) {
			auto color = map[i][j] == 0 ? "\033[90m" : ( map[i][j] == 1 ? "\033[97m" : "\033[32m" );
			auto reset = "\033[39m";
			cout << color << map[i][j] << reset << " ";
		}
		cout << endl;
	}
}

void place_room(int x, int y, int w, int h, int map[][SIZE]) {
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

int main() {
	srand(time(NULL));

	int map[SIZE][SIZE] = {0};

	vector<Room> rooms;

	// Randomly placing rooms
	for (int i = 0; i < ROOM_COUNT; i++) {
		while (true) {
			int x = gen_number(5, SIZE - 5);
			int y = gen_number(5, SIZE - 5);
			int w = gen_number(5, ROOM_MAX_WIDTH);
			int h = gen_number(5, ROOM_MAX_HEIGHT);
			Room room = {x, y, w, h};
			if (!overlap_with_exists_rooms(room, rooms) && room_within_map(room)) {
				rooms.push_back(room);
				place_room(x, y, w, h, map);
				break;
			}
		}
	}

	// Build corridors
	for (int i = 0; i < rooms.size(); i++) {
		for (int j = 0; j < rooms.size(); j++) {
			if (i != j) {
				// Horizontal paths
				if (rooms[i].y > rooms[j].y && rooms[i].y < (rooms[j].y + rooms[j].h)) {
					int y = rooms[i].y + 1;
					for (int x = min(rooms[i].x, rooms[j].x); x < max(rooms[i].x, rooms[j].x); x++) {
						map[y][x] = 1;
					}
				}

				// Vertical paths
				if (rooms[i].x > rooms[j].x && rooms[i].x < (rooms[j].x + rooms[j].w)) {
					int x = rooms[i].x + 1;
					for (int y = min(rooms[i].y, rooms[j].y); y < max(rooms[i].y, rooms[j].y); y++) {
						map[y][x] = 1;
					}
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

	print_map(map);

	return 0;
}
