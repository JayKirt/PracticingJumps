document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
  
    const platformWidth = 100;
    const platformHeight = 15;
    const jumpHeight = 100;
    const jumpDuration = 800;
    const ballSpeed = 5;
    const gravity = 0.5;
  
    let isJumping = false;
    let isOnPlatform = true; // Start the ball on a platform
    let ballX = gameContainer.clientWidth / 2;
    let ballY = gameContainer.clientHeight - ball.offsetHeight; 
    let ballVY = 0; // Set the initial vertical velocity to 0
    let mouseX = ballX;
  
    function createPlatform() {
      const platform = document.createElement("div");
      platform.className = "platform";
  
      const maxX = gameContainer.clientWidth - platformWidth;
      const randomX = Math.floor(Math.random() * maxX);
      platform.style.width = platformWidth + "px";
      platform.style.height = platformHeight + "px";
      platform.style.left = randomX + "px";
      platform.style.top = gameContainer.clientHeight + "px";
  
      gameContainer.appendChild(platform);
      movePlatform(platform);
    }
  
    function movePlatform(platform) {
      let posY = gameContainer.clientHeight;
  
      function updatePosition() {
        posY -= 5;
        platform.style.top = posY + "px";
  
        if (posY > -platformHeight) {
          requestAnimationFrame(updatePosition);
        } else {
          platform.remove();
        }
      }
  
      requestAnimationFrame(updatePosition);
    }
  
    function jump() {
      if (isJumping || !isOnPlatform) return;
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
          ballVY <= 0 
        ) {
          ballVY = 0;
          ballY = platformRect.top - ball.offsetHeight;
          isJumping = false;
          isOnPlatform = true; 
          break;
        } else {
          isOnPlatform = false; 
        }
      }
    }
  
    function updateBallPosition(mouseX) {
        ballX = mouseX; // Update the ball's X position to follow the mouse
    
        ballY += ballVY;
        ballVY -= gravity;
    
        // Prevent the ball from moving outside the game container horizontally
        if (ballX < 0) {
          ballX = 0;
        } else if (ballX > gameContainer.clientWidth - ball.offsetWidth) {
          ballX = gameContainer.clientWidth - ball.offsetWidth;
        }
    
        // Keep the ball at the bottom of the screen
        if (ballY > gameContainer.clientHeight - ball.offsetHeight) {
          ballY = gameContainer.clientHeight - ball.offsetHeight;
          ballVY = 0;
          isJumping = false;
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
        setTimeout(gameLoop, 2000);
      }
    
      gameContainer.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
      });
    
      gameContainer.addEventListener("click", jump);
    
      ball.style.left = ballX + "px"; // Set the ball's initial horizontal position
      ball.style.bottom = ballY + "px"; // Set the ball's initial vertical position
    
      gameLoop();
      updateBallPosition(ballX); // Call updateBallPosition after initializing ballY and ballVY
    });
