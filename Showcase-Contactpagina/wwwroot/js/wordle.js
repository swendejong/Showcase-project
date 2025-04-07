var height = 6; // Number of guesses
var width = 5; // Length of the word

var row = 0; // Current guess (attempt #)
var col = 0; // Current letter for that attempt

var gameOver = false;
var word = "";

var gameMode = "";
var gameCode;
var playerId;
var pollingInterval;  // Store polling interval to clear it when game ends

window.onload = async function () {
    gameMode = localStorage.getItem("gameMode");
    const opponentword = localStorage.getItem("word");
    gameCode = localStorage.getItem("gameCode");
    playerId = localStorage.getItem("playerId");

    if (gameMode === "multiplayer") {
        word = opponentword.toString().toUpperCase();
    } else {
        // For single-player, fetch a random word as usual
        await getWordFromAPI();
    }
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

    if (gameMode === "multiplayer") {
        startPollingOpponentProgress(gameCode, playerId)
        document.getElementById("opponent-tracker-wrapper").style.display = "block";

        const tracker = document.getElementById("opponent-tracker");
        tracker.innerHTML = ""; // Clear if reloaded

        for (let i = 0; i < height; i++) {
            let tile = document.createElement("div");
            tile.classList.add("tracker-tile");
            tile.id = "opponent-guess-" + i;
            tracker.appendChild(tile);
        }
    }

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
        stopPolling(); // Stop polling when the game is over
    }
}

let progress = [0, 0, 0, 0, 0, 0]; // Progress array
let opponentProgress;
let currentGuessIndex = 0; // Keeps track of which guess we're on

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
        if (gameMode === "multiplayer") {
            progress[currentGuessIndex] = 2;
            sendProgressToAPI().then(() => {
                // Handle any logic after the progress is sent
            }).catch((error) => {
                console.error("Error sending progress:", error);
            });
        }
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

    if (gameMode === "multiplayer") {
        progress[currentGuessIndex] = 1;
        currentGuessIndex++;
        sendProgressToAPI().then(() => {
            // Handle any logic after the progress is sent
        }).catch((error) => {
            console.error("Error sending progress:", error);
        });
    }


    row += 1; // Start new row
    col = 0; // Start at 0 for new row
}

async function startPollingOpponentProgress(gameCode, playerId) {
    async function poll() {
        try {
            const response = await fetch(`https://localhost:7278/api/wordle/progress?gameCode=${gameCode}&playerId=${playerId}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.opponentProgress) {
                    updateOpponentTracker(data.opponentProgress);
                    opponentProgress = data.opponentProgress;

                    // Check if both players have finished
                    if (checkIfGameFinished(progress) && checkIfGameFinished(opponentProgress)) {
                        gameOver = true; // Game over if both are finished
                        document.getElementById("answer").innerText = "Game Over";
                        setTimeout(5000)
                        stopPolling(); // Stop polling
                        disableKeyboard(); // Disable the keyboard
                    }
                }
            }
        } catch (err) {
            console.error("Error polling opponent progress:", err);
        }
    }

    pollingInterval = setInterval(poll, 1500); // Start polling every 1.5 sec
}

function checkIfGameFinished(progressArray) {
    return progressArray.includes(2); // Return true if there's a '2', meaning the game is finished
}

function stopPolling() {
    clearInterval(pollingInterval); // Stop the polling when game is over or won
}

// Update opponent progress tracker
function updateOpponentTracker(progressArray) {
    for (let i = 0; i < progressArray.length; i++) {
        const tile = document.getElementById("opponent-guess-" + i);
        tile.classList.remove("progress-0", "progress-1", "progress-2"); // clear old

        if (progressArray[i] === 1) {
            tile.classList.add("progress-1");
        } else if (progressArray[i] === 2) {
            tile.classList.add("progress-2");
        }
    }
}

// Disable the keyboard (prevent further input)
function disableKeyboard() {
    let keys = document.querySelectorAll('.key-tile, .enter-key-tile');
    keys.forEach(key => {
        key.removeEventListener('click', processKey);
        key.style.backgroundColor = '#ccc'; // Make keys look disabled
    });
}

async function sendProgressToAPI() {
    const body = {
        gameCode: gameCode,
        playerId: playerId,
        progress: progress
    };

    try {
        const response = await fetch("https://localhost:7278/api/wordle/progress/update", { // Updated URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error("Error sending progress to server:", response.status);
        }
    } catch (error) {
        console.error("Failed to send progress:", error);
    }
}

async function getWordFromAPI() {
    try {
        let url = "https://localhost:7278/api/wordle/random"; // Single Player

        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("HTTP error! Status: ${response.status}");
        }

        let data = await response.json();
        word = data.word.toUpperCase();  // Accessing 'word' from response
    } catch (error) {
        console.error("Error fetching word:", error);
        word = "ERROR"; // Fallback word if API fails
    }
}
