// name: progress-bar
<!DOCTYPE html>
<div>
    <div  id="{{'progress-bar-'+$id}}" class="container" style="height:24px;width:0%">
    </div>
</div>

<p id="{{'label-'+$id}}">Passed <span id="{{'counter-'+$id}}">0</span> of 10 steps</p>

<style>
.animate-opacity {
    animation:opac 0.8s
}
.container {
    width : 100%;
    background-color: #528FA2;
}
@keyframes opac {
    from{opacity:0} to{opacity:1}
}
</style>

<script>
(function(scope) {
    scope.$progress = 0;
    scope.$move = () => {
        const elem = document.getElementById(`progress-bar-${scope.$id}`);   
        const id = setTimeout(frame(10), 50);
        function frame(interval) {
            if (scope.$progress >= 100) {
                clearInterval(id);
              //self.disabled = true;
                document.getElementById(`label-${scope.$id}`).className = "success animate-opacity";
                document.getElementById(`label-${scope.$id}`).innerHTML = "End of the game";
            } else {
          //	width++;
                scope.$progress += interval;
                elem.style.width = scope.$progress + '%'; 
                let num = scope.$progress * 1 / 10;
                num = num.toFixed(0)
                document.getElementById(`counter-${scope.$id}`).innerHTML = num;
        }
      }
    }
    scope.$watch('msg', (msg) => {
        try{
            if (msg) {
               if (msg.interval) {
                    scope.$move(msg.interval);
                }
                if (msg.progress) {
                    scope.$progress = msg.progress;
                }   
            }
        
            //  return msg;
        } catch(error){
            return error;
        }
    });
})(scope);
</script>