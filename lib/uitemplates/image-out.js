// name: image-out
<!DOCTYPE html>
<div id="{{'stream-view-'+$id}}">
    <img id="{{'stream-viewer-'+$id}}"  style="{{'max-width:100%'}}" src="{{$imageUrl}}">
</div>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        scope.$imageUrl = "";
        if (msg && msg.payload) {
            let blob;
            let payload = msg.payload;
            let contentType = "png";
            const deviceName = "aloes-device";
            if (msg.mimetype) contentType = msg.mimetype;
            console.log(`new pic for ${deviceName}`, payload, typeof payload);
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
            blob.name =  deviceName;
            console.log(`new blob for ${deviceName}`, blob)
            const urlCreator = window.URL || window.webkitURL;
            scope.$imageUrl = urlCreator.createObjectURL(blob);
            msg.payload = blob;
            return msg;
        }
        return null;;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>