// name: stream-out
<!DOCTYPE html>
<div id="{{'stream-view-'+$id}}" style="{{'text-align:center; max-height:100%'}}">
    <p ng-style="{{$fontStyle}}"> {{ $textValue }}</p>
    <img id="{{'stream-viewer-'+$id}}"  style="{{'max-width:100%; max-height:90%'}}"  src="{{$imageUrl($msg)}}">
</div>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        scope.$msg = msg;
        //scope.$imageUrl = "";"
        //  scope.$imageUrl = "http://192.168.1.219:8080/?action=stream";
        scope.$textValue = "stream :";
        scope.$fontStyle = {
            'font-size': '20px',
            'color': '#FFF',
            'font-weight': 'bold'
        };
        scope.$imageUrl = (msg) => {
            //  console.log("msg", msg)
            //  return msg && msg.url ? msg.url : null
            return "http://test:test@192.168.1.219:8080/?action=stream";
        }
    } catch(error){
        return error;
    }
  });
})(scope);
</script>