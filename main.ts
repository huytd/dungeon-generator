import { generate_map } from './dungeon';
import { drawMap, drawDoors } from './graphics';

const { map, rooms } = generate_map();

drawMap(map);

drawDoors(map);
