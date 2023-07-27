document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
  
    const jumpHeight = 100;
    const jumpDuration = 800;
    const platformInterval = 2000;
    const ballSpeed = 5;
    const gravity = 0.5;
  
    let isJumping = false;
    let ballX = gameContainer.clientWidth / 2;
    let ballY = gameContainer.clientHeight - ball.offsetHeight;
    let ballVY = 0;
    const platforms = [];
  
    function createPlatform() {
      const platform = document.createElement("div");
      platform.className = "platform";
  
      const platformWidth = 100;
      const platformHeight = 15;
      const maxX = gameContainer.clientWidth - platformWidth;
      const randomX = Math.floor(Math.random() * maxX);
      platform.style.width = platformWidth + "px";
      platform.style.height = platformHeight + "px";
      platform.style.left = randomX + "px";
      platform.style.top = gameContainer.clientHeight + "px";
  
      gameContainer.appendChild(platform);
      platforms.push(platform);
    }
  
    function movePlatforms() {
      platforms.forEach((platform) => {
        let posY = parseInt(platform.style.top);
        posY -= 5;
        platform.style.top = posY + "px";
        if (posY < -platform.offsetHeight) {
          platform.remove();
          const index = platforms.indexOf(platform);
          if (index > -1) {
            platforms.splice(index, 1);
          }
        }
      });
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
  
      platforms.forEach((platform) => {
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
      });
    }
  
    function updateBallPosition(mouseX) {
      ballX += (mouseX - ballX) * 0.1;
  
      ballY += ballVY;
      ballVY -= gravity;
  
      // Prevent the ball from moving outside the game container horizontally
      if (ballX < 0) {
        ballX = 0;
      } else if (ballX > gameContainer.clientWidth - ball.offsetWidth) {
        ballX = gameContainer.clientWidth - ball.offsetWidth;
      }
  
      ball.style.left = ballX + "px";
      ball.style.bottom = ballY + "px";
  
      handleCollisions();
  
      requestAnimationFrame(() => updateBallPosition(mouseX));
    }
  
    function getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  
    function gameLoop() {
      createPlatform();
      movePlatforms();
      setTimeout(gameLoop, platformInterval);
    }
  
    gameContainer.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
    });
  
    gameContainer.addEventListener("click", jump);
  
    updateBallPosition(ballX);
    gameLoop();
  });