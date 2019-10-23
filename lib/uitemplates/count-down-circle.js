// name: count-down-circle
<!DOCTYPE html>
<div class="timer-modes">
    <button id="timerMode-0" data-setter="0">0</button>
    <button id="timerMode-1" data-setter="1">1</button>
    <button id="timerMode-2" data-setter="2">2</button>
</div>

<div class="setters">
  <div class="minutes-set">
    <button id="timer-setter-0" data-setter="minutes-plus">+</button>
    <button id="timer-setter-1" data-setter="minutes-minus">-</button>
  </div>
  <div class="seconds-set">
    <button id="timer-setter-2" data-setter="seconds-plus">+</button>
    <button id="timer-setter-3" data-setter="seconds-minus">-</button>
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
  <div class="display-remain-time">{{setTimeString(wholeTime)}}</div>
  <button class="play" id="pause"></button>
  <button class="stop" id="break"></button>
</div>

<style>
    
    .timer-modes {
      position: absolute;
      left: 100px;
      top: 50px;
    }
    
    .timer-modes > button {
        width: 20%;
    }
    
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
      top: 85px;
    }
    
    .minutes-set {
      float: left;
      margin-right: 20px;
    }
    
    .seconds-set { float: right; }
    
    .controls {
      position: absolute;
      left: 65px;
      top: 115px;
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
  try {
    const timerModes = [0, 1, 2];
    const styles = {
      //  fontFamily: 'JosefinSlab-SemiBold',
      fontColor: '#1C1C1C',
      grey: '#565656',
      primaryColor: '#1dc0ff',
      secondaryColor: '#55ffb6',
      successColor: '#69ff4f',
      warningColor: '#fff62d',
      dangerColor: '#ff954d',
    };
    let length = Math.PI * 2 * 100;

    let progressBar = document.querySelector('.e-c-progress');
    const pointer = document.querySelector('.e-c-pointer');
    //  const pointerId = `e-pointer-${scope.$id}`;
    //  console.log('pointerId', pointerId);
    let pointerGroup = document.getElementById('e-pointer');

    let timerModeBtns = timerModes.map(mode =>
        //  document.getElementById(`timerMode-${scope.$id}-${mode}`),
        document.getElementById(`timerMode-${mode}`),
    );
    const displayOutput = document.querySelector('.display-remain-time');
    const stopBtn = document.getElementById('break');
    const pauseBtn = document.getElementById('pause');
    // const setterBtns = document.querySelectorAll('button[data-setter]');
    let setterBtns = [0,1,2,3].map(i =>
        //  document.getElementById(`timerMode-${scope.$id}-${mode}`),
        document.getElementById(`timer-setter-${i}`),
    );
    
    let toggleTimer;
    scope.intervalTimer = null;
    scope.isPaused = true;
    scope.isStarted = false;
    scope.wholeTime = 60 * 60;
    scope.timeLeft = 0;
    scope.timerOutput = 0;
    scope.timerState = 0;
    scope.timerMode = 1;

    timerModeBtns[scope.timerMode].style.fill = styles.primaryColor;
    //  pointer.style.transition = "transform 0.7s";
    progressBar.style.strokeDasharray = length;

    function DeltaTimer(cb, data, interval) {
      try {
        let timeout, lastTime;
        let count = 0;

        const loop = () => {
            count += 1;
            const thisTime = +new Date();
            const deltaTime = thisTime - lastTime;
            const delay = Math.max(interval - deltaTime, 0);
            timeout = setTimeout(loop, delay);
            lastTime = thisTime + delay;
            data.delay = delay;
            data.count = count;
            data.time = thisTime;
            data.lastTime = lastTime;
            if (count > 1) cb(data);
            return null;
        };

        const start = () => {
            timeout = setTimeout(loop, 0);
            lastTime = +new Date();
            return lastTime;
        };

        const stop = () => {
            clearTimeout(timeout);
            return lastTime;
        };

        this.start = start;
        this.stop = stop;
        return timeout;
      } catch (error) {
        throw error;
      }
    }

    function updateCronDisplay(value, timePercent) {
      const offset = -length - (length * value) / timePercent;
      progressBar.style.strokeDashoffset = offset;
      if (scope.isStarted && !scope.isPaused) {
        pointer.style.stroke = styles.successColor;
        progressBar.style.stroke = '#baff00';
      }
      pointerGroup.style.transform = `rotate(${(360 * value) / timePercent}deg)`;
    }

    scope.setTimeString = timeLeft => {
      //  let seconds = timeLeft % 60;
      //  let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      let timeIsValid = true;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      if (typeof seconds !== 'number' || seconds < 0 || seconds > 59) {
        timeIsValid = false;
      }
      if (typeof minutes !== 'number' || minutes < 0 || minutes > 500) {
        timeIsValid = false;
      }
      if (timeIsValid) {
        return `${minutes < 10 ? '0' : ''}${minutes}:${
          seconds < 10 ? '0' : ''
        }${seconds}`;
      }
      return setTimeString(0);
    };

    function displayTimeLeft(timeLeft) {
      // let minutes = Math.floor(timeLeft / 60);
      const displayString = scope.setTimeString(timeLeft);
      displayOutput.textContent = displayString;
      updateCronDisplay(timeLeft, scope.wholeTime);
    };

    function setWholeTime(seconds) {
      if (scope.wholeTime + seconds > 0) {
        scope.wholeTime += seconds;
        displayTimeLeft(scope.wholeTime);
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5521`,
          payload: scope.wholeTime,
        });
      }
    };

    function setTimeLeft(seconds) {
      if (scope.timeLeft + seconds > 0) {
        scope.timeLeft += seconds;
        displayTimeLeft(scope.timeLeft);
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5538`,
          payload: scope.timeLeft,
        });
      }
    };

    function setTimer(seconds) {
      if (scope.isStarted && scope.isPaused) {
        setTimeLeft(seconds);
      } else if (!scope.isStarted && scope.isPaused) {
        setWholeTime(seconds);
      }
    };

    for (let i = 0; i < setterBtns.length; i++) {
      setterBtns[i].addEventListener('click', function(event) {
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

    function setTimerMode(mode) {
        if (scope.isStarted) return null;
        switch (mode) {
          case 0:
            scope.timerMode = 0;
            break;
          case 1:
            scope.timerMode = 1;
            break;
          case 2:
            scope.timerMode = 2;
            break;
          default:
            throw new Error('Unsupported mode');
        }
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5526`,
          payload: mode,
        });
    };

    for (let i = 0; i < timerModeBtns.length; i++) {
      timerModeBtns[i].addEventListener('click', function(event) {
        // console.log("update Mode :", this.dataset.setter)
        const mode = this.dataset.setter;
        setTimerMode(Number(mode));
      });
    }
    
    function startCron() {
      // console.log('start cron ');
      scope.isStarted = true;
      scope.isPaused = false;
      scope.timerOutput = 0;
      scope.timeLeft = scope.wholeTime;
      scope.intervalTimer.start();
      pointer.style.stroke = styles.successColor;
      progressBar.style.stroke = styles.successColor;
      pauseBtn.classList.remove('play');
      pauseBtn.classList.add('pause');
      setterBtns.forEach(function(btn) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
      });
    };

    function restartCron() {
      // console.log('restart cron ');
      scope.isStarted = true;
      scope.isPaused = false;
      scope.timerOutput = 0;
      if (scope.timeLeft <= 0) {
        scope.timeLeft = scope.wholeTime;
      }
      scope.intervalTimer.start();
      pauseBtn.classList.remove('play');
      pauseBtn.classList.add('pause');
      pointer.style.stroke = styles.successColor;
      progressBar.style.stroke = styles.successColor;
      setterBtns.forEach(function(btn) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
      });
    };

    function pauseCron() {
      // console.log('pause cron');
      scope.isStarted = true;
      scope.isPaused = true;
      scope.intervalTimer.stop();
      //  progressBar.style.stroke = "#528FA2";
      pointer.style.stroke = styles.primaryColor;
      progressBar.style.stroke = styles.primaryColor;
      pauseBtn.classList.remove('pause');
      pauseBtn.classList.add('play');
      setterBtns.forEach(function(btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
      });
    };

    function stopCron() {
      // console.log('stop cron');
      scope.isStarted = false;
      scope.isPaused = true;
      scope.timeLeft = 0;
      scope.intervalTimer.stop();
      pointer.style.stroke = styles.primaryColor;
      progressBar.style.stroke = styles.primaryColor;
      pauseBtn.classList.remove('pause');
      pauseBtn.classList.add('play');
      setterBtns.forEach(function(btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
      });
      displayTimeLeft(scope.wholeTime);
    };

    function updateCron(data) {
      try {
        if (scope.timeLeft <= 0) {
          // stopCron();
        } else if (scope.timeLeft > 0) {
          scope.timeLeft -= 1;
          // console.log('updateCron', scope.timeLeft);
          displayTimeLeft(scope.timeLeft);
        }
        return data;
      } catch (error) {
        return error;
      }
    };

    function setClock(interval) {
      if (scope.intervalTimer && scope.intervalTimer !== null) {
        scope.intervalTimer.stop();
      }
      scope.intervalTimer = new DeltaTimer(updateCron, {}, interval);
      // console.log('Set clock :', start);
      return scope.intervalTimer;
    };

    function stopTimer() {
      //  scope.timerState = 0;
      scope.send({
        topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5523`,
        payload: 'stop',
      });
      stopCron();
    };

    function pauseTimer() {
      if (!scope.isStarted && scope.isPaused) {
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5523`,
          payload: 'start',
        });
        startCron();
      } else if (scope.isPaused && scope.isStarted) {
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5523`,
          payload: 'restart',
        });
        restartCron();
      } else if (!scope.isPaused && scope.isStarted) {
        scope.send({
          topic: `PUT/sensor/${scope.updatedSensor.type}/${scope.updatedSensor.nativeNodeId}/${scope.updatedSensor.nativeSensorId}/5523`,
          payload: 'pause',
        });
        pauseCron();
      }
    };

    //  updateCronDisplay(scope.wholeTime, scope.wholeTime);
    pauseBtn.addEventListener('click', pauseTimer);
    stopBtn.addEventListener('click', stopTimer);
    
    setClock(1000);
    displayTimeLeft(scope.wholeTime);
    
    
    scope.timeLeftUpdate = (value, oldValue) => {
        if (value !== oldValue && value !== null) {
            if (value < 0) value = 0;
            if (value > 0) {
                displayTimeLeft(value);
                if (!scope.timerOutput && scope.timerState && !scope.isStarted) {
                    restartCron();
                }
                //  setTimeString(value);
            } else if (scope.isStarted) {
                stopCron();
            }
        }
        return value;
    };

    scope.wholeTimeUpdate = (value, oldValue) => {
        if (value !== null) {
            if (value < 0) value = 0;
            if (!scope.isStarted) {
                displayTimeLeft(value);
            }
            return value;
        }
        return 0;
    };

    scope.timerOutputUpdate = (value, oldValue) => {
        if (!scope.isPaused && scope.isStarted && (value === true || value === 1)) {
            stopCron();
        }
        return value;
    };

    scope.timerStateUpdate = (value, oldValue) => {
      // console.log('TIMER STATE CHANGED:', value, oldValue);
        if (oldValue !== value && value === true || value === 1) {
            if (!scope.isStarted) {
                startCron();
            } else if (scope.isPaused && scope.isStarted) {
                restartCron();
            }
        }
        return value;
    };

    scope.timerModeUpdate = (value, oldValue) => {
      // console.log('TIMER MODE CHANGED:', value, oldValue);
        timerModeBtns.forEach((btn, index) => {
            if (index === value) {
                btn.style.fill = styles.primaryColor;
            } else {
                btn.style.fill = styles.secondaryColor;
            }
        });
        return value;
    };

    scope.eventUpdate = (value, oldValue) => {
      // console.log('NEW EVENT:', value, oldValue);
        switch (value) {
            case 'start': 
                if (!scope.isStarted) {
                    startCron();
                }
                break;
            case 'restart': 
                if (!scope.isStarted) {
                    restartCron();
                }
                break;
            case 'stop': 
                if (scope.isStarted) {
                    stopCron();
                }
                break;
            case 'pause': 
                if (scope.isStarted && !scope.isPaused) {
                    pauseCron();
                }
                break;
        }
        return value;
    };
    
    scope.switchButtonClass = () => {
        if (scope.timerState) {
            return `switch-button switched-on`;
        }
        return `switch-button switched-off`;
    };

    scope.playButton = () => {
        if (scope.isStarted && !scope.isPaused) {
            return '▮▮';
        }
        return '▶';
    };

    scope.$watch('msg', msg => {
      if (msg && msg.sensor && msg.sensor.resources) {
        scope.updatedSensor = JSON.parse(JSON.stringify(msg.sensor));
        scope.wholeTime = scope.wholeTimeUpdate(
          msg.sensor.resources['5521'],
          scope.wholeTime,
        );
        
        if (msg.method === "PUT" || msg.method === "POST" ) {
            scope.event = scope.eventUpdate(
              msg.sensor.resources['5523'],
              scope.event,
            );
            scope.timeLeft = scope.timeLeftUpdate(
              msg.sensor.resources['5538'],
              scope.timeLeft,
            );
            scope.timerOutput = scope.timerOutputUpdate(
              msg.sensor.resources['5543'],
              scope.timerOutput,
            );
            scope.timerState = scope.timerStateUpdate(
              msg.sensor.resources['5850'],
              scope.timerState,
            );
        }

        scope.timerMode = scope.timerModeUpdate(
          msg.sensor.resources['5526'],
          scope.timerMode,
        );
      }
        //  return msg;
    });
    
  } catch (error) {
    // console.log('COUNT DOWN ERR', error);
    throw error;
  }
})(scope);

</script>