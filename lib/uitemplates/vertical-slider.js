// name: vertical-slider
    <input     
        id="slider-1"
        type="range" 
        min="0" 
        max="100" 
        step="1" 
        class="range1 vertical-highest-first">
<style type="text/css">
/*customised range*/ 
input[type="range"].range1 {
    cursor: pointer;
    width: 300px !important;
    -webkit-appearance: none;
    z-index: 200;
    width:50px;
    height:30px;
    margin:3px;
    margin-left:-135px;
    margin-top: 145px;
    border: 0px;
    background-color: transparent;
}

input[type=range].range1:focus {
  outline: none;
}
input[type=range].range1::-webkit-slider-runnable-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
  background: #ea1717;
  border-radius: 5.9px;
  border: 1.2px solid #ea1717;
}
input[type=range].range1::-webkit-slider-thumb {
  box-shadow: 2.9px 2.9px 3px rgba(0, 0, 0, 0), 0px 0px 2.9px rgba(13, 13, 13, 0);
  border: 1.4px solid #000000;
  height: 38px;
  width: 30px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6.45px;
}
input[type=range].range1:focus::-webkit-slider-runnable-track {
  background: rgba(253, 253, 253, 0.93);
}
input[type=range].range1::-moz-range-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
  background: #ea1717;
  border-radius: 5.9px;
  border: 1.2px solid #ea1717;
}
input[type=range].range1::-moz-range-thumb {
  box-shadow: 2.9px 2.9px 3px rgba(0, 0, 0, 0), 0px 0px 2.9px rgba(13, 13, 13, 0);
  border: 1.4px solid #000000;
  height: 38px;
  width: 30px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
}
input[type=range].range1::-ms-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range].range1::-ms-fill-lower {
  background: rgba(229, 231, 225, 0.93);
  border: 1.2px solid rgba(239, 237, 234, 0.91);
  border-radius: 11.8px;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
}
input[type=range].range1::-ms-fill-upper {
  background: rgba(241, 242, 239, 0.93);
  border: 1.2px solid rgba(239, 237, 234, 0.91);
  border-radius: 11.8px;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
}
input[type=range].range1::-ms-thumb {
  box-shadow: 2.9px 2.9px 3px rgba(0, 0, 0, 0), 0px 0px 2.9px rgba(13, 13, 13, 0);
  border: 1.4px solid #000000;
  height: 38px;
  width: 30px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  height: 27.5px;
}
input[type=range].range1:focus::-ms-fill-lower {
  background: rgba(241, 242, 239, 0.93);
}
input[type=range].range1:focus::-ms-fill-upper {
  background: rgba(253, 253, 253, 0.93);
}

/* set range from 1 - 0 vertically (highest on top) */ 
.vertical-highest-first{
     -webkit-transform:rotate(270deg);
     -moz-transform:rotate(270deg);
     -o-transform:rotate(270deg);
     -ms-transform:rotate(270deg);
     transform:rotate(270deg);
}
</style>
<script>
(function(scope) {
    scope.$watch('msg', (msg) => {
        try {
            scope.getSliderId = () => {
                return document.querySelector(`#slider-1`);
            }
                   
            const sliderDom = scope.getSliderId();
            sliderDom.onchange = changeValue;
            function changeValue(evt) {
                // console.log("NEW SLIDER VALUE", sliderDom.value, evt);
                if (sliderDom.value !== undefined) {
                    scope.send({payload: Number(sliderDom.value)});
                }            
            };
            if (msg && msg.payload && typeof msg.payload === "number") {
                sliderDom.value = msg.payload;
            }
            //  return msg;
        } catch(error){
            return error;
        }
    });
})(scope);
</script>
