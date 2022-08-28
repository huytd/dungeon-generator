import { generate_map } from './dungeon';
import { drawMap, drawDoors } from './graphics';

const { map, fog } = generate_map();

drawMap(map);
drawDoors(map);
