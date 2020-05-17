//https://www.youtube.com/watch?v=rAUn1Lom6dw
document.addEventListener('DOMContentLoaded', () => {
	let cells = '';
	for (let i = 0; i < 200; i++) {
		cells += '<div></div>'
	}
	for (let i = 0; i < 10; i++) {
		cells += '<div class="taken"></div>'
	}
	document.querySelector('.grid').innerHTML = cells;
	let cellsN = '';
	for (let i = 0; i < 16; i++) {
		cellsN += '<div></div>'
	}
	document.querySelector('.grid-next').innerHTML = cellsN;

	document.addEventListener('keyup', control);

	const grid = document.querySelector('.grid');
	const gridNext = document.querySelector('.grid-next');
	const gridNextName = document.querySelector('.grid-next__name');
	const gameScoreElem = document.querySelector('.game-score__value');
	let squares = Array.from(grid.querySelectorAll('div'));
	let squaresPreview = Array.from(gridNext.querySelectorAll('div'));
	const width = 10;
	const widthPreview = 4;
	let timerId;

	let figures = [
		{
			name: 'type-L',
			path: [
				[1, width + 1, width * 2 + 1, 2],
				[width, width + 1, width + 2, width * 2 + 2],
				[2, width + 2, width * 2 + 2, width * 2 + 1],
				[width, width * 2, width * 2 + 1, width * 2 + 2],
			],
		},
		{
			name: 'type-L2',
			path: [
				[1, 2, width + 2, width * 2 + 2],
				[width, width + 1, width + 2, 2],
				[1, width + 1, width * 2 + 1, width * 2 + 2],
				[width, width * 2, width + 1, width + 2],
			],
		},
		{
			name: 'type-Z',
			path: [
				[0, 1, width + 1, width + 2],
				[1, width + 1, width, width * 2],
			],
		},
		{
			name: 'type-Z2',
			path: [
				[1, 2, width, width + 1],
				[0, width, width+1, width * 2 + 1],
			],
		},
		{
			name: 'type-T',
			path: [
				[0, 1, 2, width + 1],
				[2, width + 2, width*2 + 2, width + 1],
				[width*2, width*2 + 1, width*2 + 2, width + 1],
				[0, width, width * 2, width + 1],
			],
		},
		{
			name: 'type-S',
			path: [
				[0, 1, width, width+1],
			],
		},
		{
			name: 'type-I',
			path: [
				[1, width+1, width*2+1, width*3+1],
				[width, width+1, width+2, width+3],
			],
		},
	];
	let figuresPreview = [
		{
			name: 'type-L',
			path: [
				[1, widthPreview + 1, widthPreview * 2 + 1, 2],
			],
		},
		{
			name: 'type-L2',
			path: [
				[1, 2, widthPreview + 2, widthPreview * 2 + 2],
			],
		},
		{
			name: 'type-Z',
			path: [
				[0, 1, widthPreview + 1, widthPreview + 2],
			],
		},
		{
			name: 'type-Z2',
			path: [
				[1, 2, widthPreview, widthPreview + 1],
			],
		},
		{
			name: 'type-T',
			path: [
				[0, 1, 2, widthPreview + 1],
			],
		},
		{
			name: 'type-S',
			path: [
				[0, 1, widthPreview, widthPreview+1],
			],
		},
		{
			name: 'type-I',
			path: [
				[1, widthPreview+1, widthPreview*2+1, widthPreview*3+1],
			],
		},
	];

	let gameScore = 0;
	let currentPos = 0;
	let figureIndex = 6;
	let rotateIndex = 0;
	let currentFigure;
	let currentView;
	let nextFigure;

	gameScoreElem.innerHTML = gameScore;

	document.querySelector('.btn-start').addEventListener('click', () => {
		if(timerId){
			clearInterval(timerId);
			timerId = null;
		} else {
			if(!currentFigure){ selectFigure(); }
			draw();
			timerId = setInterval(moveDown, 200);
		}
	});
	function selectFigure() {
		currentPos = 4;
		rotateIndex = 0;
		figureIndex = typeof nextFigure === 'undefined' ? Math.floor(Math.random()*figures.length) : nextFigure;
		currentFigure = figures[figureIndex];
		currentView = currentFigure.path[rotateIndex];
		nextFigure = Math.floor(Math.random()*figures.length);
		drawNext();
	}
	function control(e) {
		if (e.keyCode === 37) {
			moveLeft();
		} else if (e.keyCode === 39) {
			moveRight();
		} else if (e.keyCode === 38) {
			rotate();
		}
	}
	function moveDown() {
		undraw();
		currentPos += width;
		draw();
		freeze();
	}
	function moveLeft() {
		undraw();
		const edgeLeft = currentView.some(ind => (currentPos + ind) % width === 0);
		const takenLeft = !edgeLeft && currentView.some(ind => squares[currentPos + ind - 1].classList.contains('taken'));
		if (!edgeLeft && !takenLeft) {
			currentPos -= 1;
		}
		draw();
	}
	function moveRight() {
		undraw();
		const edgeLeft = currentView.some(ind => (currentPos + ind) % width === 9);
		const takenLeft = currentView.some(ind => squares[currentPos + ind + 1].classList.contains('taken'));
		if (!edgeLeft && !takenLeft) {
			currentPos += 1;
		}
		draw();
	}
	function rotate() {
		rotateIndex++;
		undraw();
		currentView = currentFigure.path[rotateIndex % currentFigure.path.length];
		draw();
		if(isFigureBroken()){
			rotateIndex--;
			undraw();
			currentView = currentFigure.path[rotateIndex % currentFigure.path.length];
			draw();
		}
	}
	function isFigureBroken() {
		let inds = currentView.map(ind => (currentPos + ind) % width);
		console.log(inds)
		return inds.some(el => el === 0) && inds.some(el => el === width-1)
	}
	function erase() {
		for (let i = 0; i < 199; i += width) {
			const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
			if (row.every(ind => squares[ind].classList.contains('taken'))) {
				row.forEach(ind => {
					squares[ind].classList.remove('taken')
					squares[ind].classList.remove('fig')
				});
				let theRow = squares.splice(i, width);
				squares = theRow.concat(squares);
				squares.forEach(cell => grid.appendChild(cell));
				gameScore += 10;
				gameScoreElem.innerHTML = gameScore;
			}
		}
	}
	function freeze() {
		if (currentView.some(ind => squares[currentPos + ind + width].classList.contains('taken'))) {
			currentView.forEach(ind => squares[currentPos + ind].classList.add('taken'));
			selectFigure();
			draw();
			erase();
			gameOver();
		}
	}
	function draw() {
		currentView.forEach(ind => {
			squares[currentPos + ind].classList.add('fig')
		});
	}
	function drawNext() {
		squaresPreview.forEach(el => {
			el.classList.remove('fig');
		});
		figuresPreview[nextFigure].path[0].forEach(ind => {
			squaresPreview[ind].classList.add('fig')
		});
		gridNextName.innerHTML = figuresPreview[nextFigure].name;
	}
	function undraw() {
		currentView.forEach(ind => {
			squares[currentPos + ind].classList.remove('fig')
		});
	}
	function gameOver() {
		if (currentView.some(ind => squares[currentPos + ind].classList.contains('taken'))) {
			clearInterval(timerId);
		}
	}

});


