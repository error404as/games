//https://www.youtube.com/watch?v=rAUn1Lom6dw

document.addEventListener('DOMContentLoaded', () => {
	new Tetris({ container: '#tetris' });
});
var Tetris = function(params) {
	if(typeof params.container !== 'string'){ return }
	this.container = document.querySelector(params.container);
	if(!this.container){ return }

	this.width = 10;
	this.widthPreview = 4;
	this.gameScore = 0;
	this.currentPos = 0;
	this.figureIndex = 6;
	this.rotateIndex = 0;
	this.isGameOver = false;
	this.timerId;
	this.currentFigure;
	this.currentView;
	this.nextFigure;
	this.listen = {};

	this.container.classList.add('tetris__container');
	this.container.innerHTML = '<div class="tetris__grid"></div>' + 
		'<div class="tetris__aside">' +
			'<div class="tetris__next"></div>' +
			'<div class="tetris__score">Score: <span class="tetris__score-value"></span></div>' +
			'<button type="button" class="tetris__start">Start/Pause</button>' +
			'<br>' +
			'<button type="button" class="tetris__reset">Reset</button>' +
		'</div>';
	this.grid = this.container.querySelector('.tetris__grid');
	this.gridNext = this.container.querySelector('.tetris__next');
	this.gameScoreElem = this.container.querySelector('.tetris__score-value');
	this.gameScoreElem.innerHTML = this.gameScore;
	this.btnStart = this.container.querySelector('.tetris__start');
	this.btnReset = this.container.querySelector('.tetris__reset');
	this.cTaken = 'tetris__taken';
	this.cFig = 'tetris__fig';

	this.figures = tetrisFigures(this.width);
	this.figuresPreview = tetrisFiguresPreview(this.widthPreview);

	this.initialDraw();
	this.squares = Array.from(this.grid.querySelectorAll('div'));
	this.squaresPreview = Array.from(this.gridNext.querySelectorAll('div'));

	this.btnStart.addEventListener('click', () => {
		if(this.isGameOver){
			this.reset();
		}
		if(this.timerId){
			clearInterval(this.timerId);
			this.timerId = null;
		} else {
			if(!this.currentFigure){ this.selectFigure(); }
			this.draw();
			this.timerId = setInterval(this.moveDown.bind(this), 200);
		}
	});
	this.btnReset.addEventListener('click', this.reset.bind(this));

	document.addEventListener('keyup', this.control.bind(this));
	
};

var tetrisFigures = function(w) {
	return [
		{
			name: 'type-L',
			path: [
				[1, w + 1, w * 2 + 1, 2],
				[w, w + 1, w + 2, w * 2 + 2],
				[2, w + 2, w * 2 + 2, w * 2 + 1],
				[w, w * 2, w * 2 + 1, w * 2 + 2],
			],
		},
		{
			name: 'type-L2',
			path: [
				[1, 2, w + 2, w * 2 + 2],
				[w, w + 1, w + 2, 2],
				[1, w + 1, w * 2 + 1, w * 2 + 2],
				[w, w * 2, w + 1, w + 2],
			],
		},
		{
			name: 'type-Z',
			path: [
				[0, 1, w + 1, w + 2],
				[1, w + 1, w, w * 2],
			],
		},
		{
			name: 'type-Z2',
			path: [
				[1, 2, w, w + 1],
				[0, w, w+1, w * 2 + 1],
			],
		},
		{
			name: 'type-T',
			path: [
				[0, 1, 2, w + 1],
				[2, w + 2, w*2 + 2, w + 1],
				[w*2, w*2 + 1, w*2 + 2, w + 1],
				[0, w, w * 2, w + 1],
			],
		},
		{
			name: 'type-S',
			path: [
				[0, 1, w, w+1],
			],
		},
		{
			name: 'type-I',
			path: [
				[1, w+1, w*2+1, w*3+1],
				[w, w+1, w+2, w+3],
			],
		},
	]
};
var tetrisFiguresPreview = function(w) {
	return [
		{
			name: 'type-L',
			path: [
				[1, w + 1, w * 2 + 1, 2],
			],
		},
		{
			name: 'type-L2',
			path: [
				[1, 2, w + 2, w * 2 + 2],
			],
		},
		{
			name: 'type-Z',
			path: [
				[0, 1, w + 1, w + 2],
			],
		},
		{
			name: 'type-Z2',
			path: [
				[1, 2, w, w + 1],
			],
		},
		{
			name: 'type-T',
			path: [
				[0, 1, 2, w + 1],
			],
		},
		{
			name: 'type-S',
			path: [
				[0, 1, w, w+1],
			],
		},
		{
			name: 'type-I',
			path: [
				[1, w+1, w*2+1, w*3+1],
			],
		},
	]
};

Tetris.prototype.reset = function() {
	clearInterval(this.timerId);
	this.gameScore = 0;
	this.currentPos = 0;
	this.figureIndex = 6;
	this.rotateIndex = 0;
	this.currentFigure = undefined;
	this.currentView = undefined;
	this.nextFigure = undefined;
	this.timerId = undefined;
	this.isGameOver = false;
	this.gameScoreElem.innerHTML = this.gameScore;
	for (let i = 0; i < this.squares.length - this.width; i += 1) {
		this.squares[i].classList.remove(this.cTaken);
		this.squares[i].classList.remove(this.cFig);
	}
	for (let i = 0; i < this.squaresPreview.length; i += 1) {
		this.squaresPreview[i].classList.remove(this.cFig);
	}
}
Tetris.prototype.initialDraw = function() {
	let cells = '';
	for (let i = 0; i < 200; i++) {
		cells += '<div></div>'
	}
	for (let i = 0; i < 10; i++) {
		cells += '<div class="' + this.cTaken + '"></div>'
	}
	this.grid.innerHTML = cells;

	let cellsN = '';
	for (let i = 0; i < 16; i++) {
		cellsN += '<div></div>'
	}
	this.gridNext.innerHTML = cellsN;
}
Tetris.prototype.selectFigure = function() {
	this.currentPos = 4;
	this.rotateIndex = 0;
	this.figureIndex = typeof this.nextFigure === 'undefined' ? Math.floor(Math.random()*this.figures.length) : this.nextFigure;
	this.currentFigure = this.figures[this.figureIndex];
	this.currentView = this.currentFigure.path[this.rotateIndex];
	this.nextFigure = Math.floor(Math.random()*this.figures.length);
	this.drawNext();
	this.event('new-figure');
}
Tetris.prototype.control = function(e) {
	if(!this.timerId) { return }
	if (e.keyCode === 37) {
		this.moveLeft();
	} else if (e.keyCode === 39) {
		this.moveRight();
	} else if (e.keyCode === 38) {
		this.rotate();
	}
}
Tetris.prototype.moveDown = function() {
	this.undraw();
	this.currentPos += this.width;
	this.draw();
	this.freeze();
}
Tetris.prototype.moveLeft = function() {
	this.undraw();
	const edgeLeft = this.currentView.some(ind => (this.currentPos + ind) % this.width === 0);
	const takenLeft = !edgeLeft && this.currentView.some(ind => this.squares[this.currentPos + ind - 1].classList.contains(this.cTaken));
	if (!edgeLeft && !takenLeft) {
		this.currentPos -= 1;
	}
	this.draw();
}
Tetris.prototype.moveRight = function() {
	this.undraw();
	const edgeLeft = this.currentView.some(ind => (this.currentPos + ind) % this.width === 9);
	const takenLeft = this.currentView.some(ind => this.squares[this.currentPos + ind + 1].classList.contains(this.cTaken));
	if (!edgeLeft && !takenLeft) {
		this.currentPos += 1;
	}
	this.draw();
}
Tetris.prototype.rotate = function() {
	this.rotateIndex++;
	this.undraw();
	this.currentView = this.currentFigure.path[this.rotateIndex % this.currentFigure.path.length];
	this.draw();
	if(this.isFigureBroken()){
		this.rotateIndex--;
		this.undraw();
		this.currentView = this.currentFigure.path[this.rotateIndex % this.currentFigure.path.length];
		this.draw();
	}
}
Tetris.prototype.isFigureBroken = function() {
	let inds = this.currentView.map(ind => (this.currentPos + ind) % this.width);
	return inds.some(el => el === 0) && inds.some(el => el === this.width-1)
}
Tetris.prototype.erase = function() {
	for (let i = 0; i < 199; i += this.width) {
		const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
		if (row.every(ind => this.squares[ind].classList.contains(this.cTaken))) {
			row.forEach(ind => {
				this.squares[ind].classList.remove(this.cTaken)
				this.squares[ind].classList.remove(this.cFig)
			});
			let theRow = this.squares.splice(i, this.width);
			this.squares = theRow.concat(this.squares);
			this.squares.forEach(cell => this.grid.appendChild(cell));
			this.gameScore += 10;
			this.gameScoreElem.innerHTML = this.gameScore;
			this.event('score-up');
		}
	}
}
Tetris.prototype.freeze = function() {
	if (this.currentView.some(ind => this.squares[this.currentPos + ind + this.width].classList.contains(this.cTaken))) {
		this.currentView.forEach(ind => this.squares[this.currentPos + ind].classList.add(this.cTaken));
		this.selectFigure();
		this.draw();
		this.erase();
		this.gameOver();
	}
}
Tetris.prototype.draw = function() {
	this.currentView.forEach(ind => {
		this.squares[this.currentPos + ind].classList.add(this.cFig)
	});
}
Tetris.prototype.drawNext = function() {
	this.squaresPreview.forEach(el => {
		el.classList.remove(this.cFig);
	});
	this.figuresPreview[this.nextFigure].path[0].forEach(ind => {
		this.squaresPreview[ind].classList.add(this.cFig)
	});
}
Tetris.prototype.undraw = function() {
	this.currentView.forEach(ind => {
		this.squares[this.currentPos + ind].classList.remove(this.cFig)
	});
}
Tetris.prototype.gameOver = function() {
	if (this.currentView.some(ind => this.squares[this.currentPos + ind].classList.contains(this.cTaken))) {
		clearInterval(this.timerId);
		this.isGameOver = true;
		this.event('game-over');
	}
}

Tetris.prototype.on = function(name, fn) {
	if(typeof name !== 'string' || typeof fn !== 'function'){
		console.error('Incorrect event listener added: ', name, fn);
		return;
	}
	if(!this.listen[name]){ this.listen[name] = []; }
	this.listen[name].push(fn);
}
Tetris.prototype.off = function(name, fn) {
	if(typeof name !== 'string' || typeof fn !== 'function'){
		console.error('Incorrect event listener remover: ', name, fn);
		return;
	}
	if(!this.listen[name]){ return }
	let index = null;
	this.listen[name].forEach((el, i) => {
		if(el === fn){
			index = i;
		}
	});
	if(index !== null){
		this.listen[name].splice(index, 1);
	}
}
Tetris.prototype.event = function(name) {
	if(this.listen[name]){
		this.listen[name].forEach(fn => fn());
	}
}




