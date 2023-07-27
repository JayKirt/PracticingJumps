document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
  
    const jumpHeight = 100;
    const jumpDuration = 800;
    const platformWidth = 100;
    const platformHeight = 15;
    const jumpInterval = 2000;
  
    let isJumping = false;
  
    // Ball position and velocity variables for left/right movement
    let ballX = gameContainer.clientWidth / 2;
    let ballVX = 0;
    const ballSpeed = 5;
  
    // Ball position variables for mouse jump
    let ballY = 0;
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
      const initialY = parseInt(ball.style.bottom);
      let currentY = initialY;
      const jumpStartTime = performance.now();
  
      function updateJumpPosition(timestamp) {
        const elapsedTime = timestamp - jumpStartTime;
        if (elapsedTime < jumpDuration) {
          currentY = initialY + jumpHeight - (jumpHeight / jumpDuration) * elapsedTime;
          ballVY = jumpHeight - (jumpHeight / jumpDuration) * elapsedTime;
          ball.style.bottom = currentY + "px";
          requestAnimationFrame(updateJumpPosition);
        } else {
          ballVY = 0;
          ball.style.bottom = initialY + "px";
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
          ballRect.bottom <= platformRect.bottom
        ) {
          ballVY = 0;
          ballY = platformRect.top - ball.offsetHeight;
          isJumping = false;
        }
      }
    }
  
    function updateBallPosition() {
        ballX += ballVX;
        ballY -= ballVY;
        ballVY -= gravity;
    
        if (ballX < 0) {
          ballX = 0;
        } else if (ballX > gameContainer.clientWidth - ball.offsetWidth) {
          ballX = gameContainer.clientWidth - ball.offsetWidth;
        }
    
        if (ballY < 0) {
          ballY = 0;
          ballVY = 0;
          isJumping = false; // Reset isJumping flag when the ball reaches the ground
        }
    
        ball.style.left = ballX + "px";
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
    
      gameContainer.addEventListener("click", jump);
    
      // Set initial ball position
      ballY = 0;
      ball.style.bottom = ballY + "px";
      ball.style.left = ballX + "px"; // Use ballX for initial horizontal position
    
      gameContainer.addEventListener("mousemove", function (e) {
        const rect = gameContainer.getBoundingClientRect();
        ballX = e.clientX - rect.left - ball.offsetWidth / 2;
      });
    
      // Event listener for left/right arrow keys
      document.addEventListener("keydown", function (e) {
        if (isJumping) return;
        if (e.key === "ArrowLeft") {
          ballVX = -ballSpeed;
        } else if (e.key === "ArrowRight") {
          ballVX = ballSpeed;
        }
      });
    
      // Event listener for releasing left/right arrow keys
      document.addEventListener("keyup", function (e) {
        if (isJumping) return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          ballVX = 0;
        }
      });
    
      updateBallPosition();
      gameLoop();
    });