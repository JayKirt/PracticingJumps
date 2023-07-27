document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
  
    const jumpHeight = 100;
    const jumpDuration = 800;
    const platformWidth = 100;
    const platformHeight = 15;
    const jumpInterval = 2000;
  
    let isJumping = false;
  
    function createPlatform() {
      const platform = document.createElement("div");
      platform.className = "platform";
      platform.style.width = platformWidth + "px";
      platform.style.height = platformHeight + "px";
      platform.style.backgroundColor = getRandomColor();
  
      const maxX = gameContainer.clientWidth - platformWidth;
      const randomX = Math.floor(Math.random() * maxX);
      platform.style.left = randomX + "px";
      platform.style.top = gameContainer.clientHeight + "px";
  
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
          const jumpProgress = (elapsedTime / jumpDuration) * Math.PI;
          currentY = initialY + jumpHeight * Math.sin(jumpProgress);
          ball.style.bottom = currentY + "px";
          requestAnimationFrame(updateJumpPosition);
        } else {
          ball.style.bottom = initialY + "px";
          isJumping = false;
        }
      }
  
      requestAnimationFrame(updateJumpPosition);
    }
  
    function getRandomColor() {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
  
    function gameLoop() {
      createPlatform();
      setTimeout(gameLoop, jumpInterval);
    }
  
    gameContainer.addEventListener("click", jump);
    gameLoop();
  });