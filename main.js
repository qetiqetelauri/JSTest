let wordleContainer = document.querySelector('.wordleContainer')
let keyboard = document.querySelector('.keyboard')

let words = ["APPLE", "LOGIC", "MAGIC", "NOTES", "ANGEL", "TOAST", "BOAST", "LOADS", "ENTER", "CLEAR"]
let solutionWord = words[Math.floor(Math.random() * words.length)]

let currentRow = 0
let currentColumn = 0

for (let i = 0; i < 6; i++) {
    let rowDiv = document.createElement('div')
    rowDiv.classList.add('row')
    for (let j = 0; j < 5; j++) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        rowDiv.appendChild(cell)
    }
    wordleContainer.appendChild(rowDiv)
}

let keys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM",
]
keys.forEach((row, rowIndex) => {
    let rowDiv = document.createElement('div')
    rowDiv.classList.add('keyboard-row')

    row.split('').forEach(key => {
        let button = document.createElement('button')
        button.textContent = key
        button.classList.add('key')
        button.dataset.key = key
        rowDiv.appendChild(button)
    })

    if (rowIndex === 2) {
        let backspace = document.createElement('button')
        backspace.textContent = 'Backspace'
        backspace.classList.add('key', 'backspace')
        backspace.dataset.key = 'Backspace'
        rowDiv.prepend(backspace)

        let enter = document.createElement('button')
        enter.textContent = 'Enter'
        enter.classList.add('key', 'enter')
        enter.dataset.key = 'Enter'
        rowDiv.appendChild(enter)
    }

    keyboard.appendChild(rowDiv)
})

function handleInput(event) {
    const key = event.type === 'keydown' ? event.key.toUpperCase() : event.target.dataset.key

    if (key === 'BACKSPACE' && currentColumn > 0) {
        currentColumn--
        let row = wordleContainer.children[currentRow]
        row.children[currentColumn].textContent = ''
    } else if (key === 'ENTER') {
        if (currentColumn === 5) {
            checkRow()
        } else {
            alert('Fill the row before submitting!')
        }
    } else if (/^[A-Z]$/.test(key) && currentColumn < 5) {
        let row = wordleContainer.children[currentRow]
        row.children[currentColumn].textContent = key
        currentColumn++
    }
}

function checkRow() {
    let row = wordleContainer.children[currentRow]
    let guess = Array.from(row.children).map(cell => cell.textContent).join('')

    if (guess.length !== 5) {
        alert('Complete the row!')
        return
    }

    const solutionArray = solutionWord.split('')
    const guessArray = guess.split('')

    const solutionLetterCounts = {}
    solutionArray.forEach(letter => {
        solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1
    })

    guessArray.forEach((letter, index) => {
        const cell = row.children[index]
        const key = keyboard.querySelector(`[data-key="${letter}"]`)

        if (solutionArray[index] === letter) {
            cell.style.backgroundColor = 'green'
            key.style.backgroundColor = 'green'
            solutionArray[index] = null
            solutionLetterCounts[letter]--
        }
    })

    guessArray.forEach((letter, index) => {
        const cell = row.children[index]
        const key = keyboard.querySelector(`[data-key="${letter}"]`)

        if (solutionArray[index] !== letter && solutionLetterCounts[letter] > 0) {
            if (cell.style.backgroundColor !== 'green') {
                cell.style.backgroundColor = 'yellow'
                key.style.backgroundColor = key.style.backgroundColor !== 'green' ? 'yellow' : 'green'
                solutionLetterCounts[letter]--
            }
        } else if (cell.style.backgroundColor !== 'green') {
            cell.style.backgroundColor = '#d0d4dd'
            if (key.style.backgroundColor !== 'green' && key.style.backgroundColor !== 'yellow') {
                key.style.backgroundColor = '#d0d4dd'
            }
        }
    })

    if (guess === solutionWord) {
        alert('Congratulations! You guessed the word!')
        document.removeEventListener('keydown', handleInput)
        keyboard.removeEventListener('click', handleInput)
    } else if (currentRow === 5) {
        alert(`Game over! The word was: ${solutionWord}`)
        document.removeEventListener('keydown', handleInput)
        keyboard.removeEventListener('click', handleInput)
    } else {
        currentRow++
        currentColumn = 0
    }
}


document.addEventListener('keydown', handleInput) 

keyboard.addEventListener('click', event => {
    if (event.target.classList.contains('key')) {
        handleInput(event) 
    }
})
