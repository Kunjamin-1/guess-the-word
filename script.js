let wordDisplay = document.querySelector(".word-display");
let box = document.querySelector(".box")
let container = document.querySelector(".container")
let random = document.querySelector(".random")
let inputBoxes = document.querySelector(".input-boxes")
let inputLastBox;
let tries = 2;
let mistakeCount = 0
let wordUrl = "https://random-word-api.vercel.app/api";
let fetchedWord;

let word = async () => {
    let response = await fetch(wordUrl);
    let data = await response.json();
    fetchedWord = data[0];
}

function scrambleWord(fetchedWord) {
    let wordArray = Array.from(fetchedWord);
    for (let i = 0; i < wordArray.length - 1; i++) {
        let j = Math.floor(Math.random() * wordArray.length);
        let temp = wordArray[i];
        wordArray[i] = wordArray[j];
        wordArray[j] = temp;
    }
    wordDisplay.innerText = wordArray.join(" ");
}

window.addEventListener("DOMContentLoaded", game)
random.addEventListener("click", game)

async function boxGenerator() {
    await word();
    scrambleWord(fetchedWord);
    let template = `<input type="text" maxlength="1" class="input-box"></input>`;
    let loop = fetchedWord.length - inputBoxes.childElementCount;
    let loop2 = inputBoxes.childElementCount - fetchedWord.length;

    if (fetchedWord.length > inputBoxes.childElementCount) {
        for (let i = 0; i < loop; i++) {
            inputBoxes.insertAdjacentHTML("beforeend", template);
        }
    } else if (fetchedWord.length < inputBoxes.childElementCount) {
        for (let i = 0; i < loop2; i++) {
            inputBoxes.lastElementChild.remove();
        }
    }

    let inputBox = [];
    document.querySelectorAll(".input-box").forEach((box) => {
        inputBox.push(box);
        inputLastBox = inputBox.at(-1);
    });

    setInputListeners(); // Auto move cursor
}

function setInputListeners() {
    let boxes = document.querySelectorAll(".input-box");
    boxes.forEach((box, index) => {
        box.addEventListener("input", () => {
            if (box.value.length === 1 && index < boxes.length - 1) {
                boxes[index + 1].focus();
            }
        });

        box.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && box.value === "" && index > 0) {
                boxes[index - 1].focus();
            }
        });
    });
}

async function game() {
    await boxGenerator();

    inputLastBox.addEventListener("input", () => {
        let userWord = [];
        document.querySelectorAll(".input-box").forEach((box) => {
            userWord.push(box.value.toLowerCase());
        });


        if (userWord.join('') === fetchedWord) {
            boxGenerator();
            mistakeCount = 0; // reset mistakes

            // Reset all circles
            document.querySelectorAll(".circle-not-active").forEach(circle => {
                circle.style.backgroundColor = "";
            });

            document.querySelectorAll(".input-box").forEach((box) => {
                box.value = "";
            });
        } else {
            document.querySelector("span").innerText = userWord.join('');

            let circles = document.querySelectorAll(".circle-not-active");
            if (mistakeCount < circles.length) {
                circles[mistakeCount].style.backgroundColor = "#7429C6";
                document.querySelector(".tries").innerText = `tries (${tries}/5) :`
                tries++
                mistakeCount++;
            }
            

            document.querySelectorAll(".input-box").forEach((box) => {
                box.value = "";
            });

            if (mistakeCount === 4) {
                alert("you lost the game");
                boxGenerator();
            }
        }
    });
}
