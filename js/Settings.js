

window.Settings = {};

let s = window.Settings;
//terrain
s.mapSize = 131072;
s.mapSizeHalf = s.mapSize/2;

s.seed = 688;

s.scale = 34320.0/2;
s.persistence = .9;
s.lacunarity  = .8;
s.height = 1;
s.octaves = 20;
s.exponentiation = 3;
s.frequency = 1;
s.amplitude = 1;
s.heightScale = 10000;
s.base = .9;

s.imageSize = 2048;

//testing
s.firstChunk = false;

s.flyMode = true;

//cells
s.cellSize = 1024;



//input settings
s.showKey = false;
s.keyBufferLength = 10;

//camera
s.cameraWidth = 1200;
s.cameraHeight = 800;



//keys
s.Moveright = 'ArrowRight';
//s.Moveright = 'KeyD';

s.MoveLeft = "ArrowLeft";

//keys

s.keys = new Map();




//Constants
s.Gravity = {};
s.Gravity.x = 0;
s.Gravity.y = 4;

//rendering
s.ShowBoundingBoxes = true;


//

