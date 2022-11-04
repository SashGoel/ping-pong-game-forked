var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");

const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
  maxScore,
  movement,
  rodName,
  ball_Speed_X = 2,
  ball_Speed_Y = 2;

// boolean variable used to play/stop the game
let gameOn = false;

// Using IIFE for self calling
(function () {
  rodName = localStorage.getItem("rodName");
  maxScore = localStorage.getItem("rodMaxScore");

  // checking if there is no data in the localstorage or not
  if (rodName === "null" || maxScore === "null") {
    alert("Welcome to the game !! Press Enter to start the game !!");
    maxScore = 0;
    rodName = "Rod1";
  } else {
    alert(rodName + " has maximum score of " + maxScore * 100);
  }

  // resetting the game by bringing rods and ball at the middle
  resetGame(rodName);
})();

function resetGame(rodName) {
  // bringing ball and rods to the middle
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  // The person who looses get the ball
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ball_Speed_Y = 4;
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ball_Speed_Y = -4;
  }

  //marking score to 0
  score = 0;
  gameOn = false;
}

function storeData(rodName, score) {
  // this fucntion will store the data in localstorage
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem("rodName", rodName);
    localStorage.setItem("rodMaxScore", maxScore);
  }

  clearInterval(movement);
  resetGame(rodName);
  // displaying score
  alert(
    rodName +
      " wins with a score of " +
      score * 100 +
      "\n" +
      "Max score is  " +
      maxScore * 100
  );
}

// binding events on keypress
window.addEventListener("keypress", function (event) {
  let rodSpeed = 20;

  let rodRect = rod1.getBoundingClientRect();

  // Key D :- LEFT and key A :- RIGHT
  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  // Enter key to start the game
  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      movement = setInterval(function () {
        // Move ball
        ballX += ball_Speed_X;
        ballY += ball_Speed_Y;

        let rod1X = rod1.getBoundingClientRect().x;
        let rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDia > window.innerWidth || ballX < 0) {
          // Reverse the direction when colliding with leftmost side or rightmost side
          ball_Speed_X = -ball_Speed_X;
        }

        let ballPos = ballX + ballDia / 2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ball_Speed_Y = -ball_Speed_Y; // Reverses the direction
          score++;

          // Check if the game ends then store the data and display al
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeData(rod2Name, score);
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= window.innerHeight - rod2Height) {
          ball_Speed_Y = -ball_Speed_Y; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeData(rod1Name, score);
          }
        }
      }, 10);
    }
  }
});
