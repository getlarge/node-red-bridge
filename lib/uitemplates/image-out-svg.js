// name: image-out-svg
<!DOCTYPE html>
<svg
    id="{{'stream-view-'+$id}}"
    height="200"
    width="200"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <text
      transform="translate(50, 100)"
      text-anchor="middle"
      x="0"
    >
      {{ $textValue }}
    </text>
    <image
      id="{{'stream-viewer-'+$id}}" 
      transform="translate(10, 20)"
      height="150"
      width="150"
      xlink:href="{{ $imageUrl }}"
/>
</svg>

<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        scope.$imageUrl = ""
        scope.$textValue = "test";
        if (msg && msg.payload && msg.topic) {
            if (msg.topic.search("5527") !== -1) {
                scope.$textValue = msg.payload;
                return msg;
            }
            if (msg.sensor && msg.sensor.resource === 5527) { 
                scope.$textValue = msg.sensor.value;
                return msg;
            }
            let blob;
            let payload = msg.payload;
            let contentType = msg.mimetype || 'jpg';
            //  console.log("new message", msg.payload, typeof msg.payload)
            if (payload && typeof payload === 'string') {
                const base64Flag = `data:image/${contentType};base64,`;
                blob = (fetch(`${base64Flag}${payload}`)).blob();
            } else if (payload.type && payload.type === 'Buffer') {
                //  blob = new Blob([payload.data], {type: "image/png"});
                blob = new Blob([new Uint8Array(payload.data)],  {type: `image/${contentType}`});
            } else {
                blob = new Blob([payload],  {type: `image/${contentType}`});
            }
            if (!blob || blob === null) throw new Error("no blob");
            //  console.log("new blob", blob)
            const fReader = new FileReader();
            fReader.onload = () => {
                if (!fReader.result) throw new Error('no result from file reader');
                scope.$imageUrl = fReader.result;
                //  return fReader.result;
            };
            fReader.readAsDataURL(blob);
        } 
        return msg;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>