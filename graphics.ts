import rough from 'roughjs/bundled/rough.esm';
import { SIZE, CELL_SIZE, CANVAS_SIZE } from './constants';

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const rc = rough.canvas(canvas);

export const drawMap = (map: number[][]) => {
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
			}
			if (map[row][col] === 0) {
				// Unwalkable
				rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE, {
					fill: '#703907',
					fillStyle: 'cross-hatch',
					strokeWidth: 1,
					stroke: 'transparent'
				});
			}
		}
	}
};

export const drawDoors = (map: number[][]) => {
	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			if (map[row][col] === 8) {
				// Door to up
				if (map[row-1][col-1] === 0 && map[row-1][col+1] === 0) {
					// closed
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
						fill: '#9b0d0344',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d0344',
						strokeWidth: 2
					});
					// open
					rc.rectangle(col * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
						fill: '#9b0d03',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d03',
						strokeWidth: 2
					});
				}
				// Door to down
				if (map[row+1][col+1] === 0 && map[row+1][col-1] === 0) {
					// closed
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
						fill: '#9b0d0344',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d0344',
						strokeWidth: 2
					});
					// open
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
						fill: '#9b0d03',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d03',
						strokeWidth: 2
					});
				}
				// Door to left
				if (map[row+1][col-1] === 0 && map[row-1][col-1] === 0) {
					// closed
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
						fill: '#9b0d0344',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d0344',
						strokeWidth: 2
					});
					// open
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE / 4, {
						fill: '#9b0d03',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d03',
						strokeWidth: 2
					});
				}
				// Door to right
				if (map[row+1][col+1] === 0 && map[row-1][col+1] === 0) {
					// closed
					rc.rectangle(col * CELL_SIZE + CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 4, CELL_SIZE, {
						fill: '#9b0d0344',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d0344',
						strokeWidth: 2
					});
					// open
					rc.rectangle(col * CELL_SIZE, row * CELL_SIZE + CELL_SIZE - CELL_SIZE / 4, CELL_SIZE, CELL_SIZE / 4, {
						fill: '#9b0d03',
						fillStyle: 'cross-hatch',
						stroke: '#9b0d03',
						strokeWidth: 2
					});
				}
			} else if (map[row][col] === 2) {
				// Stair Up
			} else if (map[row][col] === 3) {
				// Stair Down
			} else {
			}
		}
	}
};

export const clearScreen = () => {
	ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};
