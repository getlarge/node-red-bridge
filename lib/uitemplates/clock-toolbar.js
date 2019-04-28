// name: clock-toolbar
<script id="titleScript" type="text/javascript">

$(function() {
    if($('.md-toolbar-tools').length != 0){
        loadClock();
    }else setTimeout(loadClock, 500)
});

function loadClock(){
    $('#clock').remove();
    var toolbar = $('.md-toolbar-tools');
    
    var div = $('<div/>');
    var p = $('<p/ id="clock">');
    
    div.append(p);
    div[0].style.margin = '5px 5px 5px auto';
    toolbar.append(div);

    function displayTitle(lh) {
        p.text(lh); 
    }
    
    function upTime() {
        var d = new Date();
        p.text(d.toLocaleString());
    }

    if(document.clockInterval){ 
            clearInterval(document.clockInterval);
            document.clockInterval = null;
    }
        
    document.clockInterval = setInterval(upTime,1000);
}

</script>