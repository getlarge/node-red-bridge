// name: image-out-svg
<!DOCTYPE html>
<svg
    id="{{'stream-view-'+$id}}"
    height="300"
    width="300"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <image
      id="{{'stream-viewer-'+$id}}" 
      x="0"
      y="0"
      width="100%" 
      height="100%"
      preserveAspectRatio="xMidYMin slice"
      xlink:href="{{ $getImageUrl() }}"></image>
    <text
      transform="translate(100, 150)"
      text-anchor="middle"
      x="0"
      class="custom-text"
    >
      {{ $getText(1) }}
    </text>
    <text
      transform="translate(120, 200)"
      text-anchor="middle"
      x="0"
      class="custom-text"
    >
      {{ $getText(2) }}
    </text>
</svg>

<style>
@import url('https://fonts.googleapis.com/css?family=Lobster&display=swap');

text.custom-text {
  font-family: 'Lobster', cursive;  
  font-size: 35px;
  fill: white;
}
</style> 

<script>
(function(scope) {
  scope.$watch('msg', (msg) => {
    try {
        scope.$getImageUrl = () => {
            const url = scope.$imageUrl || "";
            return url;
        }
        scope.$getText = (number) => {
            return scope[`$text${number}`];
        }
        
        if (msg && msg.payload && msg.topic) {
            if ((msg.topic && msg.topic.search("5527") !== -1) || (msg.sensor && Number(msg.sensor.resource) === 5527)) {
                const parts = msg.payload.split('-');
                scope.$text1 = parts[0];
                scope.$text2 = parts[1];
                //  return msg;
            } else if ((msg.topic && msg.topic.search("5910") !== -1) || (msg.sensor && Number(msg.sensor.resource) === 5910)){
                let blob;
                let payload = msg.payload;
                let contentType = msg.mimetype || 'jpg';
                if (payload && typeof payload === 'string') {
                    console.log("new image base64", typeof msg.payload)
                    const base64Flag = `data:image/${contentType};base64,`;
                    blob = (fetch(`${base64Flag}${payload}`)).blob();
                } else if (payload.type && payload.type === 'Buffer') {
                    console.log("new image JSON buffer", typeof msg.payload)
                    //  blob = new Blob([payload.data], {type: "image/png"});
                    blob = new Blob([new Uint8Array(payload.data)],  {type: `image/${contentType}`});
                }  else if (payload instanceof ArrayBuffer) {
                    console.log("new image Array buffer", typeof msg.payload)
                    blob = new Blob([payload], { type: `image/${contentType}` });
                } else if (payload instanceof Array){
                    console.log("new image Array bits", typeof msg.payload)
                    blob = new Blob([Uint8Array.from(payload)], { type: `image/${contentType}`});
                } else {
                    console.log("new image unfiltered type/instance", typeof msg.payload)
                    blob = new Blob([new Uint8Array(payload)],  {type: `image/${contentType}`})
                //throw new Error("No valid payload to transform to blob");
                }
                if (!blob || blob === null) throw new Error("no blob");
                console.log("new blob", blob);
                const fReader = new FileReader();
                fReader.onload = () => {
                    if (!fReader.result) throw new Error('no result from file reader');
                    scope.$imageUrl = fReader.result;
                    //  console.log("new file", scope.$imageUrl)
                    //  return fReader.result;
                };
                fReader.readAsDataURL(blob); 
                return msg;
            }
           
        } 
        //  return msg;
    } catch(error){
        return error;
    }
  });
})(scope);
</script>