var height = 6; // Number of guesses
var width = 5; // Length of the word

var row = 0; // Current guess (attempt #)
var col = 0; // Current letter for that attempt

var gameOver = false;

var word = "";
console.log(word);

async function getWordFromAPI() {
    try {
        let response = await fetch("https://localhost:7278/api/wordle/random"); // Adjust URL if needed
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        word = data.word.toUpperCase(); // Store the fetched word
        console.log("Fetched Word:", word);
    } catch (error) {
        console.error("Error fetching word:", error);
        word = "ERROR"; // Fallback word if API fails
    }
}

window.onload = async function () {
    await getWordFromAPI()
    intialize();
}

function intialize() {
    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    let keyboardContainer = document.getElementById("keyboard-container");

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");
            let key = currRow[j];
            keyTile.innerText = key;
            if (j % 2 == 0) {
                keyTile.style.backgroundColor = "#ffb3b3";
            } else {
                keyTile.style.backgroundColor = "#73c883";
            }
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        keyboardContainer.appendChild(keyboardRow);
    }

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey() {
    e = { "code": this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    } else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    } else if (e.code == "Enter") {
        update();
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    // Form the guess string
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); // Case sensitive
    console.log(guess);

    // Check if the guess has the correct length
    if (guess.length !== width) {
        document.getElementById("answer").innerText = "Invalid word length. Please enter a 5-letter word.";
        return;
    }

    let correct = 0;
    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    // First iteration, check correct letters
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            correct += 1;
            letterCount[letter] -= 1;
        }
    }

    // Check if the guess is correct
    if (correct === width) {
        gameOver = true;
        document.getElementById("answer").innerText = "You Win!"; // Show win message
        disableKeyboard(); // Disable keyboard so no more input is allowed
        return;
    }

    // Second iteration, check letters that are present but in the wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.remove("absent");
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.remove("present");
            }
        }
    }

    row += 1; // Start new row
    col = 0; // Start at 0 for new row
}

// Disable the keyboard (prevent further input)
function disableKeyboard() {
    let keys = document.querySelectorAll('.key-tile, .enter-key-tile');
    keys.forEach(key => {
        key.removeEventListener('click', processKey);
        key.style.backgroundColor = '#ccc'; // Make keys look disabled
    });
}


