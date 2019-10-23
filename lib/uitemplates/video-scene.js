// name: video-scene
<!DOCTYPE html>
<div class="video-player">
    <video 
        width="100%" 
        autoplay>
      <source src="{{$videoUrl}}" type="video/mp4">
    Your browser does not support the video tag.
    </video> 
    <button id="{{'video-player-btn-'+$id}}" class="video-player-btn" ></button>
</div>
<style>
    button.video-player-btn {
        background: transparent;
        border: none !important;
        font-size:0;
        width: 220px;
        height: 220px;
        position: absolute;
        top: 105px;
        left: 280px;
    }
    .video-player {
        overflow: hidden;
    }
</style>
<script>
(function(scope) {
    scope.$videoUrl = "http://shazam-1:8000/app/startup-video";
    
    function getBtnId() {
        return document.querySelector(`#video-player-btn-${scope.$id}`);
    }
    
    let mainButton = getBtnId();
    
    function onClick(evt) {
        console.log("Button clicked", evt);
        scope.send({payload: true});
    }
    
    setTimeout(() => {
        if (!mainButton) {
            mainButton = getBtnId();
            // console.log("Button", `#video-player-btn-${scope.$id}`, mainButton);
            mainButton.addEventListener("click", onClick);
        }
    }, 1000);
    
    scope.$watch('msg', (msg) => {
        try {
            if (msg && msg.url) {
                scope.$videoUrl = msg.url;
            }
        } catch(error){
            return error;
        }
   });
})(scope);
</script>
