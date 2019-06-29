// name: image-text-out
<!DOCTYPE html>
<div id="{{'stream-view-'+$id}}" style="{{'text-align:center; max-height:100%'}}">
    <img id="{{'stream-viewer-'+$id}}"  style="{{'max-width:100%; max-height:90%'}}"  src="{{$imageUrl}}">
    <p style="{{'font-size:40px; color:white'}}"> {{ $albumName }}</p>
    <p style="{{'font-size:40px; color:white'}}"> {{ $groupName }}</p>
</div>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        //scope.$textValue = "test";
        //scope.$imageUrl = "";
        if (msg && msg.payload) {
             if (msg.topic.search("5527") !== -1) {
                const parts = msg.payload.split("-");
                scope.$albumName = parts[0];
                scope.$groupName = parts[1];
                return msg;
            } else if ( (msg.topic && msg.topic.search("5910") !== -1 ) || ( msg.sensor && msg.sensor.resource === 5910 )){
                let blob;
                let payload = msg.payload;
                let contentType = "jpg";
                if (msg.mimetype) contentType = msg.mimetype;
                console.log("new pic for pi-touch", payload, typeof payload);
                //console.log("isBuffer?", payload instanceof Buffer);
                if (payload && typeof payload === 'string') {
                    const base64Flag = `data:image/${contentType};base64,`;
                    blob = (fetch(`${base64Flag}${payload}`)).blob();
                } else if (payload.type && payload.type === 'Buffer') {
                    blob = new Blob([Uint8Array.from(payload.data)], { type: `image/${contentType}` });
                } else if (payload instanceof ArrayBuffer) {
                    blob = new Blob([payload], { type: `image/${contentType}` });
                } else if (payload instanceof Array){
                    blob = new Blob([Uint8Array.from(payload)], { type: `image/${contentType}`});
                } else {
                    throw new Error("No valid payload to transform to blob");
                }
                if (!blob) throw new Error("No Blob");
                blob.lastModifiedDate = new Date();
                blob.name =  "pi-touch";
                console.log("new blob ", blob)
                const urlCreator = window.URL || window.webkitURL;
                scope.$imageUrl = urlCreator.createObjectURL(blob);
                msg.payload = blob;
                return msg;
                
            }
          
        }
        return null;;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>
