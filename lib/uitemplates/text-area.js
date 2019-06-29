// name: text-area
<!DOCTYPE html>
<div id="{{'text-area-'+$id}}">
    <textarea style="{{'max-width:100%; resize:none'}}" ng-model="$textContent" rows="4" cols="50">
    </textarea>
    <button style="{{'background-color:#528FA2 ; color:white ; border:none ; border-radius:2px; height:30px; width:25%'}}" 
    ng-click="sendText($event)">Send</button>
</div>
<script>
(function(scope) {
    //  scope.$textContent = "";
    scope.sendText = (event) => {
        if (event) {
            //  console.log("textContent", event, scope.$textContent);
            return scope.send({payload : scope.$textContent});
        }
    };
    scope.$watch('msg', (msg) => {
        if (msg && msg.payload ) {
            scope.$textContent = msg.payload;
        } else {
            scope.$textContent = "";
        }

    });
})(scope);
</script>