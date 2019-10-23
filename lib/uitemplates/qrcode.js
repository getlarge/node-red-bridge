// name: camera-2-qrcode
<!DOCTYPE html>
<div id="{{'qrcode-view-'+$id}}">
    <p> {{ $label }} </p>
    <img id="{{'qrcode-viewer-'+$id}}"  style="{{'max-width:100%'}}" src="{{$imageUrl}}">
</div>
<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        scope.$imageUrl = "";
        if (msg && msg.qrCodeAddress) {
            let blob;
            let payload = msg.qrCodeAddress;
            let contentType = "png";
            const deviceName = "aloes-device";
            scope.$label = 'IOTA address : ';
            scope.$deviceName = deviceName;
            if (msg.mimetype) contentType = msg.mimetype;
            //  console.log(`new pic for ${deviceName}`, payload, typeof payload);
            if (payload && typeof payload === 'string') {
                scope.$imageUrl = payload;
                return msg;
                //  const base64Flag = `data:image/${contentType};base64,`;
                //  blob = (fetch(`${base64Flag}${payload}`)).blob();
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
            //  console.log(`new blob for ${deviceName}`, blob)
            const urlCreator = window.URL || window.webkitURL;
            scope.$imageUrl = urlCreator.createObjectURL(blob);
            msg.payload = blob;
            //  return msg;
        } 
        if (msg && msg.transactions) {
            scope.$label = 'Transaction ongoing ...';
            scope.$imageUrl = `/icons/on.png`;
        }
        return null;;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>