import { Tile } from './dungeon';
import rough from 'roughjs/bundled/rough.esm';
import { SIZE, CELL_SIZE, CANVAS_SIZE, Direction, GRID_COLOR, SHADOW_COLOR, DOOR_CLOSED_COLOR, DOOR_OPENED_COLOR, WALL_COLOR } from './constants';

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const rc = rough.canvas(canvas);

export const drawMap = (map: number[][]) => {
	for (let i = 0; i <= SIZE; i++) {
		rc.line(i * CELL_SIZE, 0, i * CELL_SIZE, CANVAS_SIZE, {
			roughness: 0.25,
			stroke: GRID_COLOR
		});
		rc.line(0, i * CELL_SIZE, CANVAS_SIZE, i * CELL_SIZE, {
			roughness: 0.25,
			stroke: GRID_COLOR
		});
	}

	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			if (map[row][col] === Tile.Floor) {
				if (map[row][col-1] === Tile.Wall) {
					rc.rectangle(col * CELL_SIZE - 20, row * CELL_SIZE, 20, CELL_SIZE, {
						fill: SHADOW_COLOR,
						stroke: 'transparent'
					});
					rc.line(col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
						stroke: WALL_COLOR,
						strokeWidth: 5
					});
				}
				if (map[row][col+1] === Tile.Wall) {
					rc.rectangle(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, 20, CELL_SIZE, {
						fill: SHADOW_COLOR,
						stroke: 'transparent'
					});
					rc.line(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
						stroke: WALL_COLOR,
						strokeWidth: 5
					});
				}
				if (map[row-1][col] === Tile.Wall) {
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE - 20, CELL_SIZE, 20, {
						fill: SHADOW_COLOR,
						stroke: 'transparent'
					});
					rc.line(col * CELL_SIZE, row * CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, {
						stroke: WALL_COLOR,
						strokeWidth: 5
					});
				}
				if (map[row+1][col] === Tile.Wall) {
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, CELL_SIZE, 20, {
						fill: SHADOW_COLOR,
						stroke: 'transparent'
					});
					rc.line(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE, col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE + CELL_SIZE, {
						stroke: WALL_COLOR,
						strokeWidth: 5
					});
				}
			}
			if (map[row][col] === Tile.Wall) {
				// Unwalkable
				rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE, {
					fill: SHADOW_COLOR,
					fillStyle: 'cross-hatch',
					strokeWidth: 1,
					stroke: 'transparent'
				});
			}
		}
	}
};

const drawDoor = (direction: Direction, opened: boolean, row: number, col: number) => {
    switch (direction) {
        case Direction.NORTH:
            if (opened) {
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_OPENED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_OPENED_COLOR,
                    strokeWidth: 2
                });
                rc.rectangle(col * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            } else {
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            }
            break;
         case Direction.SOUTH:
            if (opened) {
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_OPENED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_OPENED_COLOR,
                    strokeWidth: 2
                });
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            } else {
                 rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            }
            break;
         case Direction.WEST:
            if (opened) {
                // closed
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_OPENED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_OPENED_COLOR,
                    strokeWidth: 2
                });
                // open
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            } else {
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            }
            break;
         case Direction.EAST:
            if (opened) {
                // closed
                rc.rectangle(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_OPENED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_OPENED_COLOR,
                    strokeWidth: 2
                });
                // open
                rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            } else {
                rc.rectangle(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
                    fill: DOOR_CLOSED_COLOR,
                    fillStyle: 'cross-hatch',
                    stroke: DOOR_CLOSED_COLOR,
                    strokeWidth: 2
                });
            }
            break;
    }
};

export const drawDoors = (map: number[][]) => {
	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			if (map[row][col] === Tile.Door) {
				// Door to up
				if (map[row-1][col-1] === Tile.Wall && map[row-1][col+1] === Tile.Wall) {
                    drawDoor(Direction.NORTH, false, row, col);
				}
				// Door to down
				if (map[row+1][col+1] === Tile.Wall && map[row+1][col-1] === Tile.Wall) {
                    drawDoor(Direction.SOUTH, false, row, col);
				}
				// Door to left
				if (map[row+1][col-1] === Tile.Wall && map[row-1][col-1] === Tile.Wall) {
                    drawDoor(Direction.WEST, false, row, col);
				}
				// Door to right
				if (map[row+1][col+1] === Tile.Wall && map[row-1][col+1] === Tile.Wall) {
                    drawDoor(Direction.EAST, false, row, col);
				}
			} else if (map[row][col] === Tile.StairUp) {
				// Stair Up
			} else if (map[row][col] === Tile.StairDown) {
				// Stair Down
			} else {
			}
		}
	}
};

export const clearScreen = () => {
	ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};
