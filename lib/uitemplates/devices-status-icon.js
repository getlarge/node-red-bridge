// name: devices-status-icon
<svg viewBox="(0 0 300 50)" id="{{'devices-status-'+ $id}}">
    <text x="10" y="25" style="{{'font-weight:700'}}" >{{$deviceName}}</text>
    <circle id="{{'devices-status-icon-'+$id}}" x="0" y="0" cx="290" cy="20" r="15" fill="{{$statusColor}}" ></circle>
</svg>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try{
        scope.$statusText = "Waiting";
        scope.$deviceName = "";
        scope.$statusColor = "#ff4500";
        if (msg && msg.device) {
            scope.$deviceName = msg.device.name;
            if (msg && (msg.device.status === true || msg.device.status === "true")) {
                scope.$statusColor = "#baff00";
                scope.$statusText = "Ready";
            }
        }
        return msg;
    } catch(error){
        return error;
    }
   
  });
})(scope);
</script>