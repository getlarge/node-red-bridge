// name: count-down-circle
<!DOCTYPE html>
<div class="setters">
  <div class="minutes-set">
    <button data-setter="minutes-plus">+</button>
    <button data-setter="minutes-minus">-</button>
  </div>
  <div class="seconds-set">
    <button data-setter="seconds-plus">+</button>
    <button data-setter="seconds-minus">-</button>
  </div>
</div>

<div class="circle">
  <svg width="300" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
     <g transform="translate(110,110)">
        <circle r="100" class="e-c-base"/>
        <g transform="rotate(-90)">
           <circle r="100" class="e-c-progress"/>
           <g id="e-pointer">
              <circle cx="100" cy="0" r="8" class="e-c-pointer"/>
           </g>
        </g>
     </g>
  </svg>
</div>

<div class="controls">
  <div class="display-remain-time">60:00</div>
  <button class="play" id="pause"></button>
  <button class="stop" id="break"></button>
</div>

<style>
    button[data-setter] {
      outline: none;
      background: transparent;
      border: none;
      font-weight: 300;
      font-size: 20px;
      width: 34px;
      height: 30px;
      color: #528FA2;
      cursor: pointer;
    }
    
    button[data-setter]:hover { opacity: 0.5; }
    
    .setters {
      position: absolute;
      left: 75px;
      top: 75px;
    }
    
    .minutes-set {
      float: left;
      margin-right: 20px;
    }
    
    .seconds-set { float: right; }
    
    .controls {
      position: absolute;
      left: 65px;
      top: 105px;
      text-align: center;
    }
    
    .display-remain-time {
      font-weight: 100;
      font-size: 75px;
      color: #528FA2;
    }
    
    #pause {
      outline: none;
      background: transparent;
      border: none;
      margin-top: 10px;
      width: 50px;
      height: 50px;
      position: relative;
    }
    
    .pause::after {
      content: "▮▮";
      color: #528FA2;
      font-size: 45px;
      position: absolute;
      top: 0px;
      left: 2px;
      width: 15px;
      height: 30px;
      background-color: transparent;
      border-radius: 1px;
    }
    
    .play::before {
      display: block;
      content: "▶";
      color: #528FA2;
      font-size: 45px;
      position: absolute;
      top: 0px;
      left: 2px;
    }
    
    #pause:hover { opacity: 0.8; }
    
    #break {
      outline: none;
      background: transparent;
      border: none;
      margin-top: 10px;
      width: 50px;
      height: 50px;
      position: relative;
    }
    
    .stop::before {
      display: block;
      content: "■";
      color: #528FA2;
      font-size: 45px;
      position: absolute;
      top: 0px;
      left: 2px;
    }
    
    #break:hover { opacity: 0.8; }
    
    .e-c-base {
      fill: none;
      stroke: #B6B6B6;
      stroke-width: 4px
    }
    
    .e-c-progress {
      fill: none;
      stroke: #528FA2;
      stroke-width: 4px;
      transition: stroke-dashoffset 0.7s;
    }
    
    .e-c-pointer {
      fill: #FFF;
      stroke: #528FA2;
      stroke-width: 2px;
    }
    
    #e-pointer { transition: transform 0.7s; } 
</style>

<script>
//      content: "\002E";

(function(scope) {
    try{
        let progressBar = document.querySelector('.e-c-progress');
        let indicator = document.getElementById('e-indicator');
        let pointer = document.getElementById('e-pointer');
        let length = Math.PI * 2 * 100;
        
        progressBar.style.strokeDasharray = length;
        
        function update(value, timePercent) {
            var offset = - length - length * value / (timePercent);
            progressBar.style.strokeDashoffset = offset; 
            if (isStarted && !isPaused) {
                progressBar.style.stroke = "#baff00";
            } 
            progressBar.style.strokeDashoffset = offset; 
            pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`; 
        };
        
        //circle ends
        const displayOutput = document.querySelector('.display-remain-time')
        const stopBtn = document.getElementById('break');
        const pauseBtn = document.getElementById('pause');
        const setterBtns = document.querySelectorAll('button[data-setter]');
        
        let toggleTimer;
        let intervalTimer;
        let wholeTime = 60 * 60; 
        let timeLeft = 0;
        let isPaused = false;
        let isStarted = false;

        function displayTimeLeft(timeLeft) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            displayOutput.textContent = displayString;
            update(timeLeft, wholeTime);
        }
        
        update(wholeTime,wholeTime);

        function setWholeTime(seconds) {
            if ((wholeTime + seconds) > 0){
                wholeTime += seconds;
                scope.send({event: 'updated', wholeTime, resources : {"5521": wholeTime}});
                displayTimeLeft(wholeTime);
            }
        }
        
        function setTimeLeft(seconds) {
            if ((timeLeft + seconds) > 0){
                timeLeft += seconds;
                console.log('changeTimeLeft', timeLeft, wholeTime);
                displayTimeLeft(timeLeft);
                scope.send({event: 'ticked', timeLeft, resources : {"5538": wholeTime}});
            }
        }
        
        function setTimer(seconds) {
            console.log('changeTime', seconds, isPaused);
            if (isPaused) {
                setTimeLeft(seconds);
            } else {
                setWholeTime(seconds);
            }
        }
        
        for (let i = 0; i < setterBtns.length; i++) {
            setterBtns[i].addEventListener("click", function(event) {
                const param = this.dataset.setter;
                switch (param) {
                    case 'minutes-plus':
                        setTimer(1 * 60);
                        break;
                    case 'minutes-minus':
                        setTimer(-1 * 60);
                        break;
                    case 'seconds-plus':
                        setTimer(1);
                        break;
                    case 'seconds-minus':
                        setTimer(-1);
                        break;
                }
                //  displayTimeLeft(wholeTime);
            });
        }
        
        function timer (seconds) { //counts time, takes seconds
            let remainTime = Date.now() + (seconds * 1000);
            displayTimeLeft(seconds);
            scope.send({event :"update_timer", remainTime});
        }
        
        function startCron() {
            console.log("start cron ");
            timer(wholeTime);
            scope.send({event: 'started', wholeTime, resources : {"5850": true}});
            isStarted = true;
            isPaused = false;
            pauseBtn.classList.remove('play');
            pauseBtn.classList.add('pause');
            setterBtns.forEach(function(btn){
                btn.disabled = true;
                btn.style.opacity = 0.5;
            });
        }
        
        function restartCron() {
            console.log("restart cron ");
            //clearInterval(intervalTimer);
            timer(timeLeft);
            scope.send({event: 'restarted', timeLeft, resources : {"5538": timeLeft, "5850": true}});
            pauseBtn.classList.remove('play');
            pauseBtn.classList.add('pause');
            setterBtns.forEach(function(btn){
                btn.disabled = true;
                btn.style.opacity = 0.5;
            });
            //  isPaused = isPaused ? false : true;
            isPaused = false;
            isStarted = true;
        }
        
        function pauseCron() {
            console.log("pause cron");
            isPaused = true;
            //  isStarted = true;
            scope.send({event: 'paused', timeLeft, resources : {"5538": timeLeft, "5850": false}});
            progressBar.style.stroke = "#528FA2"; 
            pauseBtn.classList.remove('pause');
            pauseBtn.classList.add('play');
            setterBtns.forEach(function(btn) {
                btn.disabled = false;
                btn.style.opacity = 1;
            });
            //  isPaused = isPaused ? false : true ;
        }
        
        function stopCron() {
            console.log("stop cron");
            timeLeft = 0;
            scope.send({event: 'stopped', wholeTime, resources : {"5850": false}});
            //  scope.send({event :"clear_timer"})
            progressBar.style.stroke = "#528FA2"; 
            isStarted = false;
            isPaused = false;
            setterBtns.forEach(function(btn) {
                btn.disabled = false;
                btn.style.opacity = 1;
            });
            displayTimeLeft(wholeTime);
            pauseBtn.classList.remove('pause');
            pauseBtn.classList.add('play');
        }
        
        function pauseTimer(event){
            console.log("pauseTimer", toggleTimer, isStarted, isPaused, timeLeft);
            if (toggleTimer) {
                if(isStarted === false && !timeLeft){
                    startCron();
                } else if(isPaused || isStarted === false && timeLeft > 0){
                    restartCron();
                } else {
                    pauseCron();
                }  
            } else {
                scope.send({payload: "Can't start the game now, check services status before trying again."})
            }
        }
        
        displayTimeLeft(wholeTime);
        pauseBtn.addEventListener('click', pauseTimer);
        stopBtn.addEventListener('click', stopCron);

        scope.$watch('msg', (msg) => {
            if (msg) {
                if (msg.event) {
                    if (msg.event === "tick") {
                        //  console.log("update intervalTimer", msg.intervalTimer)
                    }
                    if (msg.event === "stop") {
                        stopCron();
                    }                    
                }
                if (msg.timeLeft && msg.timeLeft > 0) {
                    //  console.log("update timeLeft", msg.timeLeft);
                    timeLeft = msg.timeLeft;
                    scope.send({event: 'ticked', timeLeft, resources : {"5538": timeLeft}});
                    displayTimeLeft(timeLeft);   
                }                
                if (msg.wholeTime && msg.wholeTime > 0) {
                    console.log("update wholeTime", msg.wholeTime)
                    wholeTime = msg.wholeTime;
                    scope.send({event: 'updated', wholeTime, resources : {"5521": wholeTime}});
                    //if (timeLeft) {
                    //    displayTimeLeft(timeLeft);
                    //} else {
                    //    displayTimeLeft(wholeTime);
                        //  update(wholeTime, wholeTime);
                    //}
                }
                if (msg.status === true) {
                    console.log("update timer status", msg.status)
                    toggleTimer = true;
                } else if (msg.status === false) {
                    console.log("update timer status", msg.status)
                    toggleTimer = false;
                } 
                if (msg.gameStatus === true) {
                    console.log("update game status", msg.gameStatus, isStarted)
                    if (!isStarted) {
                        isStarted = true;
                        //  isStarted = msg.gameStatus;
                        restartCron();
                        //  pauseTimer();
                    }
                } else if (msg.gameStatus === false) {
                    console.log("update game status", msg.gameStatus, isStarted);
                    if (!isStarted) {
                        if (timeLeft > 5) {
                            pauseCron();
                            //isStarted = true; 
                            //isPaused = true;
                        } else {
                            stopCron();
                            //isStarted = false; 
                            //isPaused = false; 
                        }
                    } else if (isStarted) {
                        if (timeLeft > 5) {
                            pauseCron();
                        } else {
                            stopCron();
                        }
                    }
                } 
            }
        });
        return msg;
    } catch(error){
        return error;
    }
})(scope);
</script>