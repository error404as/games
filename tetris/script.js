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
	document.addEventListener('keyup', control);

	const grid = document.querySelector('.grid');
	let squares = Array.from(grid.querySelectorAll('div'));
	const width = 10;
	let timerId;

	let fig1 = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	];

	let currentPos = 4;
	let rotateIndex = 0;
	let currentFig = fig1[rotateIndex]
	draw();
	timerId = setInterval(moveDown, 200);

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
		const edgeLeft = currentFig.some(ind => (currentPos + ind) % width === 0);
		const takenLeft = currentFig.some(ind => squares[currentPos + ind - 1].classList.contains('taken'));
		if (!edgeLeft && !takenLeft) {
			currentPos -= 1;
		}
		draw();
	}
	function moveRight() {
		undraw();
		const edgeLeft = currentFig.some(ind => (currentPos + ind) % width === 9);
		const takenLeft = currentFig.some(ind => squares[currentPos + ind + 1].classList.contains('taken'));
		if (!edgeLeft && !takenLeft) {
			currentPos += 1;
		}
		draw();
	}
	function rotate() {
		rotateIndex++;
		undraw();
		currentFig = fig1[rotateIndex % fig1.length];
		draw();
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
			}
		}
	}
	function freeze() {
		if (currentFig.some(ind => squares[currentPos + ind + width].classList.contains('taken'))) {
			currentFig.forEach(ind => squares[currentPos + ind].classList.add('taken'));
			currentPos = 4;
			draw();
			erase();
			gameOver();
		}
	}
	function draw() {
		currentFig.forEach(ind => {
			squares[currentPos + ind].classList.add('fig')
		});
	}
	function undraw() {
		currentFig.forEach(ind => {
			squares[currentPos + ind].classList.remove('fig')
		});
	}
	function gameOver() {
		if (currentFig.some(ind => squares[currentPos + ind].classList.contains('taken'))) {
			clearInterval(timerId);
		}
	}

});


