const SIZE = 40;
const ROOM_COUNT = 8;
const ROOM_MAX_WIDTH = 15;
const ROOM_MAX_HEIGHT = 10;

const place_room = (x, y, w, h, map) => {
	for (let i = y; i < y + h; i++) {
		for (let j = x; j < x + w; j++) {
			map[i][j] = 1;
		}
	}
};

const gen_number = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const room_within_map = (room) => {
	return ((room.x + room.w) < SIZE) && ((room.y + room.h) < SIZE);
};

const between = (value, min, max) => {
	return (value >= min) && (value <= max);
};

const overlap = (A, B) => {
    const xo = between(A.x, B.x, B.x + B.w) ||
              between(B.x, A.x, A.x + A.w);

    const yo = between(A.y, B.y, B.y + B.h) ||
              between(B.y, A.y, A.y + A.h);

    return xo && yo;
};

const overlap_with_exists_rooms = (room, rooms) => {
	for (const r of rooms) {
		if (overlap(room, r)) {
			return true;
		}
	}
	return false;
};

const map = Array(SIZE).fill(0).map(_ => Array(SIZE).fill(0));
const rooms = [];

// Placing rooms randomly
while (rooms.length < ROOM_COUNT) {
	const x = gen_number(2, SIZE - 2);
	const y = gen_number(2, SIZE - 2);
	const w = gen_number(5, ROOM_MAX_WIDTH);
	const h = gen_number(5, ROOM_MAX_HEIGHT);
	const room = {x, y, w, h};
	if (!overlap_with_exists_rooms(room, rooms) && room_within_map(room)) {
		rooms.push(room);
		place_room(x, y, w, h, map);
	}
}

// Build corridors
for (let i = 0; i < rooms.length; i++) {
	for (let j = 0; j < rooms.length; j++) {
		if (i != j) {
			// Horizontal paths
			if (rooms[i].y > rooms[j].y && rooms[i].y < (rooms[j].y + rooms[j].h)) {
				let y = rooms[i].y + 1;
				for (let x = Math.min(rooms[i].x, rooms[j].x); x < Math.max(rooms[i].x, rooms[j].x); x++) {
					map[y][x] = 1;
				}
			}

			// Vertical paths
			if (rooms[i].x > rooms[j].x && rooms[i].x < (rooms[j].x + rooms[j].w)) {
				let x = rooms[i].x + 1;
				for (let y = Math.min(rooms[i].y, rooms[j].y); y < Math.max(rooms[i].y, rooms[j].y); y++) {
					map[y][x] = 1;
				}
			}
		}
	}
}

// Placing stairs
const in_x = rooms[0].x + Math.floor(rooms[0].w/2);
const in_y = rooms[0].y + Math.floor(rooms[0].h/2);
const out_x = rooms[ROOM_COUNT-1].x + Math.floor(rooms[ROOM_COUNT-1].w/2);
const out_y = rooms[ROOM_COUNT-1].y + Math.floor(rooms[ROOM_COUNT-1].h/2);

map[in_y][in_x] = 2;
map[out_y][out_x] = 3;

const rc = rough.canvas(document.getElementById("canvas"));

const CANVAS_SIZE = 800;
const CELL_SIZE = CANVAS_SIZE / SIZE;

for (let i = 0; i <= SIZE; i++) {
	rc.line(i * CELL_SIZE, 0, i * CELL_SIZE, CANVAS_SIZE, {
		roughness: 0.25,
		stroke: '#da8a41'
	});
	rc.line(0, i * CELL_SIZE, CANVAS_SIZE, i * CELL_SIZE, {
		roughness: 0.25,
		stroke: '#da8a41'
	});
}

for (let row = 0; row < SIZE; row++) {
	for (let col = 0; col < SIZE; col++) {
		if (map[row][col] === 1) {
			rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE, {
				fill: '#e48126',
				fillStyle: 'dots',
				strokeWidth: 5,
				stroke: 'transparent'
			});
			if (map[row][col-1] === 0) {
				rc.rectangle(col * CELL_SIZE - 20, row * CELL_SIZE, 20, CELL_SIZE, {
					fill: '#703907',
					stroke: 'transparent'
				});
				rc.line(col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
					stroke: '#432204',
					strokeWidth: 5
				});
			}
			if (map[row][col+1] === 0) {
				rc.rectangle(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, 20, CELL_SIZE, {
					fill: '#703907',
					stroke: 'transparent'
				});
				rc.line(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
					stroke: '#432204',
					strokeWidth: 5
				});
			}
			if (map[row-1][col] === 0) {
				rc.rectangle(col * CELL_SIZE, row * CELL_SIZE - 20, CELL_SIZE, 20, {
					fill: '#703907',
					stroke: 'transparent'
				});
				rc.line(col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, {
					stroke: '#432204',
					strokeWidth: 5
				});
			}
			if (map[row+1][col] === 0) {
				rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, CELL_SIZE, 20, {
					fill: '#703907',
					stroke: 'transparent'
				});
				rc.line(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
					stroke: '#432204',
					strokeWidth: 5
				});
			}
		} else {
			rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE, {
				fill: '#703907',
				fillStyle: 'cross-hatch',
				strokeWidth: 1,
				stroke: 'transparent'
			});
		}
	}
}
