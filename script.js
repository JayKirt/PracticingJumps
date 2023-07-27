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
    let ballY = gameContainer.clientHeight;
    let ballVY = 0;
  
    function createPlatform() {
      const platform = document.createElement("div");
      platform.className = "platform";
      platform.style.width = platformWidth + "px";
      platform.style.height = platformHeight + "px";
      platform.style.backgroundColor = getRandomColor();
  
      const maxX = gameContainer.clientWidth - platformWidth;
      const randomX = Math.floor(Math.random() * maxX);
      platform.style.left = randomX + "px";
      platform.style.top = gameContainer.clientHeight - platformHeight + "px"; // Set initial platform position
  
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
  
      function handleMouseJump(e) {
        if (isJumping) return;
        isJumping = true;
    
        const mouseX = e.clientX;
        const mouseY = e.clientY;
    
        const deltaX = mouseX - ballX;
        const deltaY = gameContainer.clientHeight - mouseY; // Invert Y-coordinate for proper jumping
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
        ballVX = (deltaX / distance) * ballSpeed;
        ballVY = (deltaY / distance) * ballSpeed;
    
        const jumpStartTime = performance.now();
    
        function updateJumpPosition(timestamp) {
          const elapsedTime = timestamp - jumpStartTime;
          if (elapsedTime < jumpDuration) {
            ballX += ballVX;
            ballY -= ballVY;
            ball.style.left = ballX + "px";
            ball.style.bottom = ballY + "px";
            requestAnimationFrame(updateJumpPosition);
          } else {
            ball.style.bottom = "0px";
            isJumping = false;
          }
        }
    
        requestAnimationFrame(updateJumpPosition);
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
      ball.style.bottom = "0px";
      ball.style.left = ballX + "px"; // Use ballX for initial horizontal position
    
      gameContainer.addEventListener("mousemove", handleMouseJump);
    
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
    
      function updateBallPosition() {
        ballX += ballVX;
        if (ballX < 0) {
          ballX = 0;
        } else if (ballX > gameContainer.clientWidth - ball.offsetWidth) {
          ballX = gameContainer.clientWidth - ball.offsetWidth;
        }
        ball.style.left = ballX + "px";
        requestAnimationFrame(updateBallPosition);
      }
    
      updateBallPosition();
      gameLoop();
    });