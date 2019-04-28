// name: setting-status-icon
<!DOCTYPE html>
<svg viewBox="0 0 270 40" id="{{'aloes-status-'+ $id}}">
    <text x="0" y="25">{{'aloes status : ' + $statusText}}</text>
    <circle id="{{'aloes-status-icon-'+$id}}" x="0" y="0" cx="250" cy="20" r="15" fill="{{$statusColor}}" ></circle>
</svg>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try{
        scope.$statusText = "Waiting";
        scope.$statusColor = "#ff4500";
        if (msg && (msg.payload === true || msg.payload === "true")) {
            scope.$statusColor = "#baff00";
            scope.$statusText = "Ready";
        }
        return msg;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>