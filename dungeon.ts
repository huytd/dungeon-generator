import { SIZE, ROOM_COUNT, ROOM_MAX_WIDTH, ROOM_MAX_HEIGHT } from './constants';

interface Room {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface GeneratedMap {
	map: number[][];
	rooms: Room[];
}

const place_room = (x: number, y: number, w: number, h: number, map: number[][]) => {
	for (let i = y; i < y + h; i++) {
		for (let j = x; j < x + w; j++) {
			map[i][j] = 1;
		}
	}
};

const gen_number = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const room_within_map = (room: Room) => {
	return ((room.x + room.w) < SIZE) && ((room.y + room.h) < SIZE);
};

const between = (value: number, min: number, max: number) => {
	return (value >= min) && (value <= max);
};

const overlap = (A: Room, B: Room) => {
    const xo = between(A.x, B.x, B.x + B.w) ||
              between(B.x, A.x, A.x + A.w);

    const yo = between(A.y, B.y, B.y + B.h) ||
              between(B.y, A.y, A.y + A.h);

    return xo && yo;
};

const overlap_with_exists_rooms = (room: Room, rooms: Room[]) => {
	for (const r of rooms) {
		if (overlap(room, r)) {
			return true;
		}
	}
	return false;
};

const point_within_room = (point: { x: number, y: number }, room: Room) => {
	return overlap({ x: point.x, y: point.y, w: 1, h: 1 }, room);
};

export const generate_map = (): GeneratedMap => {
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
	const connectedList = [];
	for (let i = 0; i < rooms.length; i++) {
		for (let j = 0; j < rooms.length; j++) {
			if (i != j) {
				// Horizontal paths
				if (between(rooms[i].y, rooms[j].y, rooms[j].y + rooms[j].h)) {
					let y = rooms[i].y + Math.floor(rooms[i].h / 2);
					for (let x = Math.min(rooms[i].x, rooms[j].x); x < Math.max(rooms[i].x, rooms[j].x); x++) {
						if (map[y-1][x] !== 1 && map[y+1][x] !== 1) {
							map[y][x] = 1;
						}
					}
				}

				// Vertical paths
				if (between(rooms[i].x, rooms[j].x, rooms[j].x + rooms[j].w)) {
					let x = rooms[i].x + Math.floor(rooms[i].w / 2);
					for (let y = Math.min(rooms[i].y, rooms[j].y); y < Math.max(rooms[i].y, rooms[j].y); y++) {
						if (map[y][x+1] !== 1 && map[y][x-1] !== 1) {
							map[y][x] = 1;
						}
					}
				}
			}
		}
	}

	// Door generating
	for (let row = 1; row < SIZE - 1; row++) {
		for (let col = 1; col < SIZE - 1; col++) {
			if (map[row][col] === 1 && map[row-1][col] === 1 && map[row+1][col] === 1 && map[row][col+1] === 1 && map[row][col-1] === 1) {
            	if (map[row-1][col-1] === 0 || map[row-1][col+1] === 0 || map[row+1][col-1] === 0 || map[row+1][col+1] === 0) {
            		if (rooms.some(room => point_within_room({ x: col, y: row }, room))) {
                		map[row][col] = 8;
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

	return { map, rooms };
};
