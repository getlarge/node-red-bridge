// name: device-status
<!DOCTYPE html>
<svg viewBox="0 0 270 40" id="{{'devices-status-'+ $id}}">
    <text
      id="{{'device-name-'+$id}}" 
      x="0"
      y="25" 
      style="{{'font-weight:700'}}" 
    >
        {{$getDeviceName()}}
    </text>
    <image
      id="{{'device-icon-'+$id}}" 
      x="200"
      y="2"
      width="35px" 
      height="35px"
      preserveAspectRatio="xMidYMin slice"
      xlink:href="{{ $getImageUrl() }}"></image>
    <circle id="{{'devices-status-icon-'+$id}}" x="0" y="0" cx="265" cy="20" r="15" fill="{{$statusColor}}" ></circle>
</svg>
<script>
(function(scope) {
    scope.$statusText = "Waiting";
    scope.$deviceName = "";
    scope.$statusColor = "#ff4500";
    scope.$getImageUrl = () => {
        const icon =  scope.$deviceIcon || "";
        return `https://aloes.io/${icon}`;
    }
    scope.$getDeviceName = () => {
        return scope.$deviceName || "";
    }
    
    scope.$watch('msg', (msg) => {
    if (msg && msg.device) {
        scope.$deviceName = msg.device.name;
        scope.$deviceIcon = msg.device.icons[0];
        const deviceIcon = document.getElementById(`device-icon-${scope.$id}`);
        if (deviceIcon) {
            deviceIcon.setAttribute('xlink:href', msg.device.icons[0]); 
        }
        $("#device-name-"+scope.$id).html(msg.device.name);

        if (msg && (msg.device.status === true || msg.device.status === "true")) {
            scope.$statusColor = "#baff00";
            scope.$statusText = "Ready";
        }
    }
    //  return msg;

  });
})(scope);
</script>