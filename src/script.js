document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector(".result");
  const resetBtn = document.querySelector(".reset");
  const timeDisplay = document.querySelector("#time");
  resetBtn.addEventListener("click", init);
  let width = 30;
  document.querySelector(":root").style.setProperty("--width", width);
  let height = 16;
  let flags;
  let squares;
  let bombs;
  let isGameOver;
  let time;
  let timer;

  function init() {
    board.innerHTML = "";
    result.innerHTML = "";
    time = 0;
    timeDisplay.innerText = 0;
    squares = [];
    bombs = Math.floor(width * height * 0.20625);
    flags = bombs;
    isGameOver = false;
    createBoard();
    clearInterval(timer);
    startCounter();
  }

  function incrementCounter() {
    time++;
    timeDisplay.innerText = time;
  }

  function startCounter() {
    timer = setInterval(incrementCounter, 1000);
  }
  function createBoard() {
    flagsLeft.innerHTML = bombs;

    const bombArray = Array(bombs).fill("bomb");
    const safeArray = Array(width * height - bombs).fill("safe");
    const gameArray = safeArray.concat(bombArray);
    const shuffledArray = gameArray
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let i = 0; i < width * height; i++) {
      const button = document.createElement("button");
      button.id = i;
      button.classList.add(shuffledArray[i]);
      button.addEventListener("click", () => selectSquare(button));
      button.addEventListener("contextmenu", (e) => toggleFlag(button, e));
      board.appendChild(button);
      squares.push(button);
    }

    //calculate number of surrounding bombs
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("safe")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > width - 1 && squares[i - width].classList.contains("bomb"))
          total++;
        if (i > width && squares[i - width - 1].classList.contains("bomb"))
          total++;
        if (!isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
        if (
          i < (height - 1) * width &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < (height - 1) * width &&
          squares[i + width].classList.contains("bomb")
        )
          total++;
        if (
          i < (height - 1) * width &&
          !isLeftEdge &&
          squares[i + width - 1].classList.contains("bomb")
        )
          total++;
        squares[i].setAttribute("data", total);
      }
    }
  }

  init();

  //check if win conditions have been met
  function checkWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("checked") &&
        squares[i].classList.contains("safe")
      ) {
        matches++;
      }
    }
    if (matches == width * height - bombs) {
      isGameOver = true;
      result.innerHTML = "You Win!";
      clearInterval(timer);
      console.log(time, matches);
    }
  }

  function toggleFlag(square, e) {
    e.preventDefault();
    if (square.classList.contains("checked") || isGameOver) return;
    if (square.classList.contains("flag")) {
      flags++;
      flagsLeft.innerHTML = flags;
      square.classList.remove("flag");
      square.innerHTML = "";

      return;
    }
    if (flags == 0) return;
    flags--;
    flagsLeft.innerHTML = flags;
    square.classList.add("flag");
    square.innerHTML = "🚩";
  }

  function selectSquare(square) {
    if (
      isGameOver ||
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    ) {
      checkWin();
      return;
    }

    if (square.classList.contains("bomb")) {
      gameOver();
    } else {
      square.classList.add("checked");
      let total = square.getAttribute("data");
      if (total != 0) {
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        if (total == 5) square.classList.add("five");
        if (total == 6) square.classList.add("six");
        if (total == 7) square.classList.add("seven");
        if (total == 8) square.classList.add("eight");
        square.innerHTML = total;
        checkWin();
        return;
      }
      findSafeSquares(square);
    }
  }

  //check for safe neighbouring squares
  function findSafeSquares(square) {
    const currentId = square.id;
    const isLeftEdge = square.id % width === 0;
    const isRightEdge = square.id % width === width - 1;

    if (currentId > 0 && !isLeftEdge) {
      const newId = parseInt(currentId) - 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId > width - 1 && !isLeftEdge) {
      const newId = parseInt(currentId) - width - 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId > width - 1) {
      const newId = parseInt(currentId) - width;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId > width - 1 && !isRightEdge) {
      const newId = parseInt(currentId) - width + 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (!isLeftEdge) {
      const newId = parseInt(currentId) - 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (!isRightEdge) {
      const newId = parseInt(currentId) + 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId < (height - 1) * width && !isLeftEdge) {
      const newId = parseInt(currentId) + width - 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId < (height - 1) * width) {
      const newId = parseInt(currentId) + width;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }

    if (currentId < (height - 1) * width && !isRightEdge) {
      const newId = parseInt(currentId) + width + 1;
      const newSquare = document.getElementById(newId);
      selectSquare(newSquare);
    }
  }

  function gameOver() {
    isGameOver = true;
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
    result.innerHTML = "You Lose!";
    clearInterval(timer);
  }
});
