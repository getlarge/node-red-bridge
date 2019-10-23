// name: sequence-progression
<div>
    <label for="{{'progress-bar-'+ $id}}">Progress:</label>
    <progress id="{{'progress-bar-'+ $id}}" class="progress-bar" max="100" value="{{ $progression }}"></progress>
</div>
<style>
label {
    padding-right: 10px;
    font-size: 1rem;
    width: 40%;
}
.progress-bar {
  padding: 6px;
  border-radius: 30px;
  width: 60%;
  background: rgba(0, 0, 0, 0.25);  
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

</style>
<script>
(function(scope) {
    scope.$progression = 0;

    scope.$watch('msg', (msg) => {
        try {

            if (msg && msg.maxCounter !== undefined && msg.counter !== undefined) {
                // console.log("update progression", msg.maxCounter, msg.counter);
                scope.$progression = 100 / msg.maxCounter * msg.counter;
            }
            if (msg && msg.progress && typeof msg.progress === "number") {
                // scope.$progression = 100 / 6 * msg.counter;
                if (msg.progress > 100) {
                    scope.$progression = 100;
                } else if (msg.progress < 0) {
                    scope.$progression = 0;
                } else {
                    scope.$progression = msg.progress;
                }
            }
            //  return msg;
        } catch(error){
            throw error;
        }
    });
})(scope);
</script>