
//Con el siguiente codigo detectamos
//el navegador que se esta utilizando
var BrowserDetect = {
       init: function () {
          this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
          this.version = this.searchVersion(navigator.userAgent)
             || this.searchVersion(navigator.appVersion)
             || "an unknown version";
          this.OS = this.searchString(this.dataOS) || "an unknown OS";
       },
    searchString: function (data) {
       for (var i=0;i<data.length;i++) {
          var dataString = data[i].string;
          var dataProp = data[i].prop;
          this.versionSearchString = data[i].versionSearch || data[i].identity;
          if (dataString) {
             if (dataString.indexOf(data[i].subString) != -1)
                return data[i].identity;
          }
          else if (dataProp)
          return data[i].identity;
       }
    },
    searchVersion: function (dataString) {
       var index = dataString.indexOf(this.versionSearchString);
       if (index == -1) return;
       return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
       { string: navigator.userAgent,
          subString: "OmniWeb",
          versionSearch: "OmniWeb/",
          identity: "OmniWeb"
       },
    {
       string: navigator.vendor,
       subString: "Apple",
       identity: "Safari"
    },
    {
       prop: window.opera,
       identity: "Opera"
    },
    {
       string: navigator.vendor,
       subString: "iCab",
       identity: "iCab"
    },
    {
       string: navigator.vendor,
       subString: "KDE",
       identity: "Konqueror"
    },
    {
       string: navigator.userAgent,
       subString: "Firefox",
       identity: "Firefox"
    },
    {
       string: navigator.vendor,
       subString: "Camino",
       identity: "Camino"
    },
    { // for newer Netscapes (6+)
       string: navigator.userAgent,
       subString: "Netscape",
       identity: "Netscape"
    },
    {
       string: navigator.userAgent,
       subString: "MSIE",
       identity: "Explorer",
       versionSearch: "MSIE"
    },
    {
       string: navigator.userAgent,
       subString: "Gecko",
       identity: "Mozilla",
       versionSearch: "rv"
    },
    { // for older Netscapes (4-)
       string: navigator.userAgent,
       subString: "Mozilla",
       identity: "Netscape",
       versionSearch: "Mozilla"
    }
    ],
    dataOS : [
    {
       string: navigator.platform,
       subString: "Win",
       identity: "Windows"
    },
    {
       string: navigator.platform,
       subString: "Mac",
       identity: "Mac"
    },
    {
       string: navigator.platform,
       subString: "Linux",
       identity: "Linux"
    }
]

};
BrowserDetect.init(); 


//Aqui inicia el codigo del juego
var direccionDefecto = 'Down';
var eljuego;
var reloj;
var puntuacion = 0;
var nextShape,preview_shape;
var paused = false;
var sound, sound_score, sound_pause, sound_game_over;
var tablero = new Array();
var iniciar = false;
var boton;
var nombre;
var points;
var nombres;
var gameover = false;

//Esta función permite ordenar el array con las 
//puntuaciónes por orden numérico en vez de 
//alfabetico
function fucionDeComaparacion(elem1, elem2){ return elem1 - elem2;}

//Esta función forma parte de la refractorización,
//añade una pieza(sus bloques) a el array de bloques
function addToArray(shape){
	for (block in shape.blocks)
	{
		tablero.push(shape.blocks[block]);
	}
}

//Esta funcíón es la encargada de dibujar todo el 
//tablero cada vez que se mueve una pieza
function drawTablero()
{
	ctx.rect(0, 0, 300, 600);
    ctx.stroke();
    ctx.fillStyle = Tetris.BOARD_COLOR;
    ctx.fill();
	
	for (block in tablero)
	{
		tablero[block].draw();
	}
}
	
// ============== Point =======================

function Point (x, y) {
    this.x = x;
    this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
    this.px = p1.x;
    this.py = p1.y;
    this.width = p2.x - p1.x;
    this.height = p2.y - p1.y;
    this.lineWidth= 1;
    this.color = 'black';
}

Rectangle.prototype.draw = function() {
/*   TU CÓDIGO AQUÍ: pinta un rectángulo del color actual en pantalla 
     en la posición px,py, con la anchura y altura actual y una línea
     de anchura=lineWidth. Observa que en este ejemplo, ctx es el nombre
     de la variable global contexto */
	  ctx.lineWidth = this.lineWidth;
	//Dibjujamos los cuadrados de colores
	 ctx.fillStyle = this.color;
	 ctx.fillRect(this.px, this.py, this.width,this.height);
	  //Dibujamos las lineas del contorno
	 ctx.strokeStyle = 'black';
	 ctx.strokeRect(this.px, this.py, this.width,this.height);
	
}

// ESTE CÓDIGO VIENE DADO
Rectangle.prototype.move = function(x,y){
   
	
	 this.rec.px += x;
    this.rec.py += y;
	
   
}

// ESTE CÓDIGO VIENE DADO
Rectangle.prototype.erase = function(){
    ctx.beginPath();
 
    ctx.lineWidth = this.lineWidth+2;
    ctx.strokeStyle = Tetris.BOARD_COLOR;
    ctx.rect(this.px, this.py, this.width, this.height);
    ctx.stroke();
    ctx.fillStyle = Tetris.BOARD_COLOR;
    ctx.fill()

}

Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

// ============== Block ===============================

function Block (pos, color) {

   this.x = pos.x;
   this.y = pos.y;

   var p1 = new Point(this.x*Block.BLOCK_SIZE,this.y*Block.BLOCK_SIZE);
	var p2 = new Point(this.x*Block.BLOCK_SIZE + Block.BLOCK_SIZE,this.y*Block.BLOCK_SIZE + Block.BLOCK_SIZE);

	this.rec = new Rectangle();
	this.rec.init(p1,p2);
	this.rec.setLineWidth(Block.OUTLINE_WIDTH);
	this.rec.setFill(color);
}

Block.prototype = new Rectangle;
Block.prototype.constructor= Block;




Block.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;

    Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;


Block.prototype.draw = function(){
	this.rec.draw();
}



Block.prototype.can_move = function(board, dx, dy) {
	var nx = this.x + dx;
    var ny = this.y + dy;
	return board.can_move(nx,ny);
}

Block.prototype.erase = function(){
	this.rec.erase();
}


function Shape() {}


Shape.prototype.init = function(coords, color) {
	this.blocks = [];
	for (var i = 0; i < coords.length;i++)
	{
		this.blocks[i] = new Block(coords[i], color);
	}
     // hemos añadido este atributo
     this.rotation_dir = 1;
};


Shape.prototype.draw = function() {
var i;
	for (var i = 0; i < this.blocks.length; i++)
	{
		this.blocks[i].draw();
	}
};




Shape.prototype.can_move = function(board,dx,dy) {
	for (var i = 0; i < this.blocks.length; i++)
	{
		if (!	this.blocks[i].can_move(board,dx,dy))
		return false;
	}
	return true;
};

Shape.prototype.can_rotate = function(board) {


	var dx,dy;
    for (var i = 0; i < this.blocks.length; i++)
	{
		dx = this.center_block.x - (this.rotation_dir*this.center_block.y) + this.rotation_dir*this.blocks[i].y;
		dy = this.center_block.y + (this.rotation_dir*this.center_block.x) - this.rotation_dir*this.blocks[i].x;

		if (!this.blocks[i].can_move(board,dx - this.blocks[i].x,dy - this.blocks[i].y))
		return false;
	}

    return true;
}


Shape.prototype.move = function(dx, dy) {
	
    for (block in this.blocks) {
        this.blocks[block].move(dx,dy);
    }
};

Shape.prototype.rotate = function() {

  
    for (block in this.blocks) {
        this.blocks[block].erase();
    }

    for (block in this.blocks) {
		dx = this.center_block.x - (this.rotation_dir*this.center_block.y) + this.rotation_dir*this.blocks[block].y;
		dy = this.center_block.y + (this.rotation_dir*this.center_block.x) - this.rotation_dir*this.blocks[block].x;       

	   this.blocks[block].move(dx - this.blocks[block].x, dy - this.blocks[block].y);
    }
	

		if (this.shift_rotation_dir)
            this.rotation_dir *= -1;

}



// ============= I_Shape ================================
function I_Shape(center) {
     var coords = [new Point(center.x - 2, center.y),
               new Point(center.x - 1, center.y),
               new Point(center.x , center.y),
               new Point(center.x + 1, center.y)];
    
     Shape.prototype.init.call(this, coords, "blue");   

     // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
     this.shift_rotation_dir = true;
     this.center_block = this.blocks[2];
}

// TU CÓDIGO: I_Shape hereda de Shape
I_Shape.prototype = new Shape;
I_Shape.prototype.constructor = I_Shape;

// =============== J_Shape =============================
function J_Shape(center) {
 // TU CÓDIGO: para J_Shape... básate en I_Shape
var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x +1, center.y),
               new Point(center.x + 1, center.y + 1)];
    
     Shape.prototype.init.call(this, coords, "orange");

	  this.shift_rotation_dir = false;
     this.center_block = this.blocks[1];
}
// TU CÓDIGO: J_Shape hereda de Shape
J_Shape.prototype = new Shape;
J_Shape.prototype.constructor = J_Shape;


// ============ L Shape ===========================
function L_Shape(center) {
 // TU CÓDIGO: para L_Shape... básate en I_Shape
 var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x +1, center.y),
               new Point(center.x - 1, center.y + 1)];
    
     Shape.prototype.init.call(this, coords, "cyan");
	 
	  this.shift_rotation_dir = false;
     this.center_block = this.blocks[1];
}
// TU CÓDIGO: L_Shape hereda de Shape
L_Shape.prototype = new Shape;
L_Shape.prototype.constructor = L_Shape;


// ============ O Shape ===========================
function O_Shape(center) {
// TU CÓDIGO: O_Shape... básate en I_Shape
var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x , center.y + 1),
               new Point(center.x - 1, center.y + 1)];
    
     Shape.prototype.init.call(this, coords, "red");
	 
	  this.shift_rotation_dir = false;
     this.center_block = this.blocks[1];
}
// TU CÓDIGO: O_Shape hereda de Shape
	O_Shape.prototype = new Shape;
	O_Shape.prototype.constructor = O_Shape;

	O_Shape.prototype.can_rotate = function(board){
		return false;
	}

// ============ S Shape ===========================
function S_Shape(center) {
// TU CÓDIGO: S_Shape... básate en I_Shape
var coords = [new Point(center.x - 1, center.y +1),
               new Point(center.x, center.y +1),
               new Point(center.x , center.y),
               new Point(center.x + 1, center.y)];
    
     Shape.prototype.init.call(this, coords, "green");
	 
	  this.shift_rotation_dir = true;
     this.center_block = this.blocks[2];
}
// TU CÓDIGO: S_Shape hereda de Shape
S_Shape.prototype = new Shape;
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
function T_Shape(center) {
// TU CÓDIGO: T_Shape... básate en I_Shape
var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x , center.y + 1),
               new Point(center.x + 1, center.y)];
    
     Shape.prototype.init.call(this, coords, "yellow");
	  
	 this.shift_rotation_dir = false;
     this.center_block = this.blocks[1];
}
// TU CÓDIGO: T_Shape hereda de Shape
T_Shape.prototype = new Shape;
T_Shape.prototype.constructor = T_Shape;


// ============ Z Shape ===========================
function Z_Shape(center) {
// TU CÓDIGO: Z_Shape... básate en I_Shape
var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x , center.y + 1),
               new Point(center.x + 1, center.y + 1)];
    
     Shape.prototype.init.call(this, coords, "magenta");
	  
	 this.shift_rotation_dir = true;
     this.center_block = this.blocks[1];
}

// TU CÓDIGO: Z_Shape hereda de Shape
Z_Shape.prototype = new Shape;
Z_Shape.prototype.constructor = Z_Shape;



// ====================== BOARD ================
function Board(width, height) {
    this.width = width;
    this.height = height;
    // NUEVO ATRIBUTO  
    this.grid = {};

}

Board.prototype.add_shape = function(shape){
   // TU CÓDIGO AQUÍ
   var t;
   var block;
   for (var i = 0 ; i < shape.blocks.length; i++)
   {
	  	   t = new String(shape.blocks[i].x + ',' + shape.blocks[i].y);
	this.grid[t] = shape.blocks[i];
   }
   this.remove_complete_rows();
}
        
// Si la pieza puede moverse a la posición actual (es decir, con un desplazamiento de 0,0),
//  dibujarla y devolver true. En caso contrario, devolver false.
Board.prototype.draw_shape = function(shape){

 
   shape.draw();

}

// TU CÓDIGO AQUÍ: comprobar si el movimiento a x,y es posible
Board.prototype.can_move = function(x,y){
	if (x < Tetris.BOARD_WIDTH && x >= 0)
	{
		if (y < Tetris.BOARD_HEIGHT && y >= 0)
		{
			
			if(new String(x + ',' + y) in this.grid)
				return false;
			else 
				return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

Board.prototype.is_row_complete = function(y){
	
for (var x = 0; x < Tetris.BOARD_WIDTH; x++)
{
	if(new String(x + ',' + y) in this.grid){
	}
	else
		return false;
}
	return true;
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa (en cuyo caso, devuelve true) o no (en cuyo caso, devuelve false). Para ello, se busca que esa línea del grid tenga bloques en todas las casillas.
};

Board.prototype.move_down_rows = function(y_start){
var i = y_start;
var key,key2;
while ( i >= 0 )
{
	for (var x = 0; x < Tetris.BOARD_WIDTH; x++)
	{
		key = new String(x + ',' + i);
		key2 = new String(x + ',' + (i+1));
		block = this.grid[key];
		
		if(block != null)
		{
			this.grid[key2] = block;
			block.erase()
		block.move(0,1);
		delete this.grid[key];
	}
	}
	i--;
}
//  empezando en la fila y_start y hasta la fila 0
//  para todas las casillas de esa fila
//  si la casilla está en el grid  (hay bloque en esa casilla)
//  borrar el bloque del grid
//          
//  mientras se pueda mover el bloque hacia abajo
//  mover el bloque hacia abajo
//          
//  meter el bloque en la nueva posición del grid
};
 
Board.prototype.delete_row = function(y){
	var block, key;
	var index;
	for (var x = 0; x < Tetris.BOARD_WIDTH; x++)
{
	key = new String(x + ',' + y);
block = this.grid[key];
	this.grid[key].erase();
		delete this.grid[key];
		index = tablero.indexOf(block)
		tablero.splice(index,1);
	}
	puntuacion += 100;
	this.updatePoint();
	sound_score.play();
	

    // TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los 
    // bloques de la fila y que le llega como parámetro
};

Board.prototype.remove_complete_rows = function(){
// TU CÓDIGO AQUÍ:
var i = 19;
while ( i >= 0 )
{
	if (this.is_row_complete(i))
	{
		this.delete_row(i);
		this.move_down_rows(i - 1)
	}
	else{
		i--;
	}
}

// Para toda fila y del tablero
//   si la fila y está completa
//      borrar fila y
//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
};

// ==================== Tetris ==========================

Board.prototype.game_over = function(){
	eljuego.stop();
	gameover = true;
	var game_over = document.getElementById("game_over");
	var background = document.getElementById("background")
	game_over.style.visibility = 'visible';
	background.style.visibility = 'visible';
	sound_game_over.play()
	document.getElementById("record").style.visibility = 'visible';
}
//Guardmos las puntuaciones y 
//los nombres ordenadas de mayor
//a menor
Board.prototype.guardarRecord = function(){
	var name, point;
	name = nombre.value;
	point = puntuacion;
	points.reverse();
	nombres.reverse();
	var n,p;
	if (points.length!=0){
	for (i = 0; points.length!=0; i++)
	{
		if (p == null)
		{
		n = nombres.pop();
		p = points.pop();
		}
		if(point != null){
		if (point > p)
		{
			console.log(point);
			localStorage["ranking" + i] =point;
			localStorage["ranking-nombre" + i] = name;
			name = null;
			point = null;
		}
		else
		{
			console.log(p);
			localStorage["ranking" + i] = p;
			localStorage["ranking-nombre" + i] = n;
			n = null;
			p = null;
	}}
	else{
		console.log(p);
		localStorage["ranking" + i] = p;
			localStorage["ranking-nombre" + i] = n;
			n = null;
			p = null;
	}
	}
	}
	else{
	console.log(point);
	localStorage["ranking" + 0] = point;
	localStorage["ranking-nombre" + 0] = name;
	name = null;
	point = null;
	}
	
	if(point != null)
	{
		console.log(point);
		var length = localStorage.length /2;
		localStorage["ranking" + length] = point;
		localStorage["ranking-nombre" + length] = name;
	}
	//Refrescamos la pagina
	nombre.value ="";
	location.reload();
}

Board.prototype.updatePoint = function()
{
ctx.fillStyle = 'white';
ctx.fillRect(320,200,130,-20); 
//ctx.fillRect(320,100,130,50);
ctx.font = "bold 20px arial";
ctx.fillStyle = 'black';
ctx.fillText(puntuacion + " \n Points",320,200);
ctx.fillStyle = 'white';
}

Board.prototype.records = function(){
ctx.fillStyle = 'white';
ctx.fillRect(320,250,130,-20); 
var salto = 22;
var altura = 250;
ctx.font = "bold 22px arial";	
ctx.fillStyle = 'black';
ctx.fillText("Ranking",320,altura);
points = new Array();
nombres = new Array();
var length ;
if (localStorage == null)
length = 0;
else
length = localStorage.length / 2;
for(var i = 0; i < length; i++)
{
	points.push(parseInt(localStorage["ranking"+i]));
	nombres.push(localStorage["ranking-nombre"+i])
}
/*	points.sort(fucionDeComaparacion);

	points.reverse();
*/
	altura += salto;
	salto = 20;
	ctx.font = "20px arial";
	length = points.length;
	if (length > 10)
		length = 10;
for( var i = 0;i < length; i++)
{
	ctx.fillText( (i+1) + ": " + nombres[i] + " - " + points[i] ,320,altura);
	altura += salto;
}
ctx.fillStyle = 'white';
}

	
function Tetris() {
    this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
	
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';

Tetris.prototype.create_new_shape = function(){
         // TU CÓDIGO AQUÍ
		var shape = Tetris.SHAPES[Math.floor((Math.random() * 7))];
	 	var newWidth = (Tetris.BOARD_WIDTH/2);
		ctx.fillStyle = 'white';
		ctx.fillRect(300,0,200,150); 
		preview_shape = new shape(new Point(13, 1));
		preview_shape.draw();
		return  new shape(new Point(newWidth, 0));
}

Tetris.prototype.do_rotate = function(){

if (this.current_shape.can_rotate(this.board))
	this.current_shape.rotate();
// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar en el tablero,
// efectuar la rotación.
drawTablero()
}

Tetris.prototype.init = function(){
	sound = document.getElementsByTagName("audio")[0];
	sound_score = document.getElementsByTagName("audio")[1];
	sound_game_over = document.getElementsByTagName("audio")[2];
	sound_pause = document.getElementsByTagName("audio")[3];
	sound.volume = 0.1;
	eljuego = this;
	boton = document.getElementById("boton");
	nombre = document.getElementById("nombre");
	boton.addEventListener("click", eljuego.board.guardarRecord);
	
	this.all_loaded();
	
	
}

Tetris.prototype.iniciar =  function(){
	document.getElementById("loading").style.visibility = 'hidden';
	document.getElementById("background").style.visibility = 'hidden';
       // obtener una nueva pieza al azar y asignarla como pieza actual
    this.current_shape = this.create_new_shape();
	addToArray(this.current_shape);
	nextShape = this.create_new_shape();
    // Pintar la pieza actual en el tablero
    // TU CÓDIGO AQUÍ 
	
	Board.prototype.draw_shape.call(this,this.current_shape);
	
	this.board.updatePoint();
	this.board.records();
	sound.play();
	this.animate_shape();
    // Pista: (board tiene un método para pintar...)
	
    
    // TU CÓDIGO AQUÍ
    // inicializar gestor de eventos de teclado añadiéndole un 
    // callback al método key_pressed
	document.addEventListener("keydown",this.key_pressed.bind(this));
}

Tetris.prototype.key_pressed = function(e) {
if (gameover == false){
if (e.keyCode == '80')
		{
		this.pause_game();
		}

if(paused == false)
{
switch(parseInt(e.keyCode)) {
case 38:
this.do_rotate();
break;

case 37:
this.do_move("Left");
break;

case 39:
this.do_move("Right");
break;

case 40:
this.do_move("Down");
break;
case 32:
this.kamikaze();
break;
}
}
}

 
 // TU CÓDIGO AQUÍ: Añade a tu código anterior
  // una condición para que si el jugador
  // pulsa la tecla "Flecha arriba", la pieza rote
};

Tetris.prototype.do_move = function(direction){
      var direc = Tetris.DIRECTION[direction];
	if (this.current_shape.can_move(this.board,direc[0],direc[1]))
	{
		this.current_shape.move(direc[0],direc[1]);
		drawTablero();
	}
	else
	{
		if(direction == 'Down')
		{

			this.board.add_shape(this.current_shape);
			this.current_shape = nextShape;
			addToArray(this.current_shape);
			nextShape = this.create_new_shape();
			if (this.current_shape.can_move(this.board, 0, 0))
			{
				drawTablero();
			}
			else{
				this.board.game_over();
			}
		}
	}
	// TU CÓDIGO AQUÍ. 2ª versión
    // si la pieza que estaba cayendo no puede seguir moviéndose,
    // añadirla al tablero (usando Board.add_shape) 
    // crear una nueva pieza, y dibujarla en la parte superior
    // recuerda que ya tienes métodos que hacen esto
};

Tetris.prototype.kamikaze = function(){
	while (this.current_shape.can_move(this.board,0,1))
	{
		this.do_move('Down');
	}
	this.do_move('Down');
};

Tetris.prototype.animate_shape = function(){
	reloj =  setInterval(eljuego.animate_shape_bis, 1000);
// TU CÓDIGO AQUÍ: genera un timer que mueva hacia abajo la pieza actual cada segundo. Recuerda añadir una llamada a esta función desde el método Tetris.init
};

Tetris.prototype.animate_shape_bis = function(){
	eljuego.do_move(direccionDefecto);
};

Tetris.prototype.stop = function(){
sound.pause();
	clearInterval(reloj);
};

Tetris.prototype.pause_game = function(){
var pause = document.getElementById("pause");
var background = document.getElementById("background");

if (paused== true)
{
	//Pausamos la musica de pausa
	//y ocultamos el div con el 
	//mensaje de pausa
sound_pause.pause();
pause.style.visibility = 'hidden';
background.style.visibility = 'hidden';

	paused = false;
	this.continue_game();
}
else
{
	//Pausamos la musica del juego,
	//hacemos visible la capa con 
	//el mensaje de pausa y reproducimos
	//la musica de pausa
	//mensaje de pausa
pause.style.visibility = 'visible';
background.style.visibility = 'visible';

	paused = true;
	this.stop();
	sound_pause.play();
}
};

Tetris.prototype.continue_game = function(){	
	//Continuamos la reproducción de la 
	//musica y reactivamos el descenso
	//automático de las piezas
	sound.play();
	reloj =  setInterval(eljuego.animate_shape_bis, 1000);
}

Tetris.prototype.all_loaded = function(){
	/*
	Si no se hace esto al acceder desde otra
	maquina firefox no carga ningun elemento
	audio (readyState = 2, solo tiene cargados
	los datos necesarios para el frame actual)
	, de esta forma se le fuerza a que 
	carge el audio (en IE y Chrome no es 
	necesario hacer esto)
	*/
	if (BrowserDetect.browser == "Firefox")
	{
		sound.play();
		sound.pause();
		sound_game_over.play()
		sound_game_over.pause()
		sound_pause.play();
		sound_pause.pause();
		sound_score.play();
		sound_score.pause();
	}
	//readyState = 4 significa que se dispone
	//de datos y velocidad suficientes como
	//para reproducir el elemento multimedia
	//sin interrupciones
	if ( sound.readyState == 4 &&  sound_score.readyState == 4 && sound_pause.readyState == 4
	&& sound_game_over.readyState == 4){
	eljuego.iniciar();
	}
	else
	{
	setTimeout(game.all_loaded,1000); 
	}
}