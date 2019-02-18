const message = document.querySelector('#message')
const h1 = document.querySelector('h1')
const state = {
	numSquares: 4,
	maxAttempts: 2,
	baseDifficultyBonus: 20,
	pickedColor: '',
	colorIndex: 0,
	currentScore: 0
}

const pickColorIndex = colorsArray => {
	return Math.floor(Math.random() * colorsArray.length)
}

const randomColor = mode => {
	const red = Math.floor(Math.random() * 256),
		green = Math.floor(Math.random() * 256),
		blue = Math.floor(Math.random() * 256)
	//added hex support for future mode switching
	if (mode === 'RGB') {
		return `rgb(${red}, ${green}, ${blue})`
	} else {
		return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}}`
	}
}

const generateRandomColors = num => {
	const arr = []

	for (let i = 0; i < num; i++) {
		arr.push(randomColor('RGB'))
	}
	return arr
}

const changeColors = (squares, color) => {
	//Assigns all squares and the header the picked color when the player wins
	for (let i = 0; i < squares.length; i++) {
		squares[i].style.background = color
	}
	h1.style.background = color
}

const appendScore = score => {
	//appends the player score to the screen
	const scoreContainer = document.querySelector('#scoreContainer')
	const div = document.createElement('div')
	div.className = 'scoreElement'
	div.textContent = score
	scoreContainer.appendChild(div)
}

const setupSquares = squares => {
	let attempts = state.maxAttempts
	const livesList = document.querySelectorAll('.lives')
	const span = document.querySelector('#currentScore')
	const resetButton = document.querySelector('#reset')

	for (let i = 0; i < squares.length; i++) {
		//add click listeners to squares
		squares[i].addEventListener('click', () => {
			//get color of clicked square
			const clickedColor = squares[i].style.background

			if (attempts > 0 && squares[i].style.background != 'transparent') {
				if (clickedColor === state.pickedColor) {
					message.textContent = 'Correct! You win!'
					changeColors(squares, state.pickedColor)
					resetButton.textContent = 'Play Again?'
					state.currentScore += state.baseDifficultyBonus + 10 * attempts
					span.textContent = state.currentScore
					attempts = 0
				} else {
					message.textContent = 'Wrong. Try Again.'
					squares[i].style.background = 'transparent'
					livesList[attempts - 1].style.display = 'none'
					attempts--
					if (attempts === 0) {
						resetButton.textContent = 'Play Again?'
						message.textContent = 'You lost the game.'
						//play an animation around the winning square
						squares[state.colorIndex].classList.add('animation')
						appendScore(state.currentScore)
						state.currentScore = 0
						span.textContent = state.currentScore
					}
				}
			}
		})
	}
}

const initGameData = () => {
	// remove previous loaded squares
	const container = document.querySelector('#squareContainer')
	while (container.firstChild) {
		container.removeChild(container.firstChild)
	}
	//load new squares on the DOM based on chosen difficulty
	let div = null
	for (let i = 0; i < state.numSquares; i++) {
		div = document.createElement('div')
		div.className = 'square'
		container.appendChild(div)
	}
	//remove previously rendered attempts
	const attemptsContainer = document.querySelector('.attempts')
	while (attemptsContainer.firstChild) {
		attemptsContainer.removeChild(attemptsContainer.firstChild)
	}
	//load new attempts based on difficulty
	let span = null
	for (let i = 0; i < state.maxAttempts; i++) {
		span = document.createElement('span')
		span.className = 'lives'
		span.innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>'
		attemptsContainer.appendChild(span)
	}
}

const reset = () => {
	initGameData()
	h1.style.background = 'rgb(85, 133, 245)'
	let colors = generateRandomColors(state.numSquares)
	console.log(colors)
	state.colorIndex = pickColorIndex(colors)
	state.pickedColor = colors[state.colorIndex]
	document.getElementById('goalColor').textContent = state.pickedColor
	const resetButton = document.querySelector('#reset')
	resetButton.textContent = 'New Colors'
	message.textContent = ''

	const squares = document.querySelectorAll('.square')
	for (let i = 0; i < squares.length; i++) {
		squares[i].style.background = colors[i]
	}
	setupSquares(squares)
}

const setupButtons = () => {
	const resetButton = document.querySelector('#reset')
	resetButton.addEventListener('click', function() {
		reset()
	})

	const diffButtons = document.querySelectorAll('.difficulty')
	//difficulty buttons event listeners
	for (let i = 0; i < diffButtons.length; i++) {
		diffButtons[i].addEventListener('click', () => {
			diffButtons[0].classList.remove('selected')
			diffButtons[1].classList.remove('selected')
			diffButtons[2].classList.remove('selected')
			diffButtons[i].classList.add('selected')
			switch (diffButtons[i].textContent) {
				case 'Easy':
					state.numSquares = 4
					state.maxAttempts = 2
					state.baseDifficultyBonus = 20
					break
				case 'Medium':
					state.numSquares = 8
					state.maxAttempts = 3
					state.baseDifficultyBonus = 50
					break
				default:
					state.numSquares = 16
					state.maxAttempts = 4
					state.baseDifficultyBonus = 100
					break
			}
			reset()
		})
	}
}

const init = () => {
	setupButtons()
	reset()
}

init()
