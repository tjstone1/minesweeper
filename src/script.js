document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");
  const flagsLeft = document.querySelector("#flags-left");
  const width = 30;
  const height = 16;
  let squares;
  let bombsLeft;
  let isGameOver;

  function init() {
    squares = [];
    bombsLeft = 99;
    isGameOver = false;
    createBoard();
  }
  function createBoard() {
    flagsLeft.innerHTML = bombsLeft;

    const bombArray = Array(bombsLeft).fill("bomb");
    const safeArray = Array(width * height - bombsLeft).fill("safe");
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

  function selectSquare(square) {
    console.log(square);
    if (
      isGameOver ||
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
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
    console.log("GAME OVER");
    isGameOver = true;
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }
});
