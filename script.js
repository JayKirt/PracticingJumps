document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
  
    const jumpHeight = 100;
    const jumpDuration = 800;
    const platformWidth = 100;
    const platformHeight = 15;
    const jumpInterval = 2000;
  
    let isJumping = false;
  
    // Ball position variables for left/right movement
    let ballX = gameContainer.clientWidth / 2;
    const ballSpeed = 5;
  
    // Ball position variables for jump
    let ballY = gameContainer.clientHeight - ball.offsetHeight;
    let ballVY = 0;
    const gravity = 0.5;
  
    function createPlatform() {
      const platform = document.createElement("div");
      platform.className = "platform";
      platform.style.width = platformWidth + "px";
      platform.style.height = platformHeight + "px";
      platform.style.backgroundColor = getRandomColor();
  
      const maxX = gameContainer.clientWidth - platformWidth;
      const randomX = Math.floor(Math.random() * maxX);
      platform.style.left = randomX + "px";
      platform.style.top = gameContainer.clientHeight - platformHeight + "px";
  
      gameContainer.appendChild(platform);
      movePlatform(platform);
    }
  
    function movePlatform(platform) {
      let posY = parseInt(platform.style.top);
      const moveInterval = setInterval(function () {
        if (isJumping) {
          clearInterval(moveInterval);
          return;
        }
        posY -= 5;
        platform.style.top = posY + "px";
        if (posY < -platformHeight) {
          platform.remove();
        }
      }, 20);
    }
  
    function jump() {
      if (isJumping) return;
      isJumping = true;
      const initialY = ballY;
      let currentY = initialY;
      const jumpStartTime = performance.now();
  
      function updateJumpPosition(timestamp) {
        const elapsedTime = timestamp - jumpStartTime;
        if (elapsedTime < jumpDuration) {
          currentY = initialY + jumpHeight - (jumpHeight / jumpDuration) * elapsedTime;
          ballVY = (jumpHeight / jumpDuration) * elapsedTime;
          ball.style.bottom = currentY + "px";
          requestAnimationFrame(updateJumpPosition);
        } else {
          ballVY = 0;
          ball.style.bottom = "0px";
          isJumping = false;
        }
      }
  
      requestAnimationFrame(updateJumpPosition);
    }
  
    function handleCollisions() {
      const ballRect = ball.getBoundingClientRect();
      const platforms = document.getElementsByClassName("platform");
  
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        const platformRect = platform.getBoundingClientRect();
  
        if (
          ballRect.left < platformRect.right &&
          ballRect.right > platformRect.left &&
          ballRect.bottom >= platformRect.top &&
          ballRect.bottom <= platformRect.bottom &&
          ballVY <= 0 // Only trigger collision when ball is moving upwards (jumping)
        ) {
          ballVY = 0;
          ballY = platformRect.top - ball.offsetHeight;
          isJumping = false;
        }
      }
    }
  
    function updateBallPosition() {
      ballX += ballSpeed * ballVX;
  
      // Prevent the ball from moving outside the game container horizontally
      if (ballX < 0) {
        ballX = 0;
      } else if (ballX > gameContainer.clientWidth - ball.offsetWidth) {
        ballX = gameContainer.clientWidth - ball.offsetWidth;
      }
  
      ball.style.left = ballX + "px";
  
      ballY += ballVY;
      ballVY -= gravity;
  
      // Prevent the ball from moving outside the game container vertically
      if (ballY < 0) {
        ballY = 0;
        ballVY = 0; // Reset vertical velocity when the ball reaches the top
      } else if (ballY > gameContainer.clientHeight - ball.offsetHeight) {
        ballY = gameContainer.clientHeight - ball.offsetHeight;
        ballVY = 0; // Reset vertical velocity when the ball reaches the bottom
        isJumping = false;
      }
  
      ball.style.bottom = ballY + "px";
  
      handleCollisions();
  
      requestAnimationFrame(updateBallPosition);
    }
  
    function getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  
    function gameLoop() {
      createPlatform();
      setTimeout(gameLoop, jumpInterval);
    }
  
    // Set initial ball position to the bottom of the screen
    ball.style.bottom = "0px";
    ball.style.left = ballX + "px"; // Use ballX for initial horizontal position
  
    gameContainer.addEventListener("mousemove", function (e) {
      const rect = gameContainer.getBoundingClientRect();
      ballX = e.clientX - rect.left - ball.offsetWidth / 2;
    });
  
    updateBallPosition();
    gameLoop();
  });