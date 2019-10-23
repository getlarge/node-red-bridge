// name: horizontal-slider
      <input     
        id="slider-7"
        type="range" 
        min="0" 
        max="100" 
        step="1" 
        class="range4">
<style type="text/css">
/*customised range*/ 
input[type="range"].range4 {
    cursor: pointer;
    width: 380px !important;
    -webkit-appearance: none;
    z-index: 200;
    width:50px;
    height:30px;
    margin:3px;
    margin-left: 5px;
    margin-top: 5px;
    border: 0px;
    background-color: transparent;
}

input[type=range].range4:focus {
  outline: none;
}
input[type=range].range4::-webkit-slider-runnable-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
  background: #0ae60a;
  border-radius: 5.9px;
  border: 1.2px solid #0ae60a;
}
input[type=range].range4::-webkit-slider-thumb {
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
input[type=range].range4:focus::-webkit-slider-runnable-track {
  background: #0ae60a;
}
input[type=range].range4::-moz-range-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
  background: #0ae60a;
  border-radius: 5.9px;
  border: 1.2px solid #0ae60a;
}
input[type=range].range4::-moz-range-thumb {
  box-shadow: 2.9px 2.9px 3px rgba(0, 0, 0, 0), 0px 0px 2.9px rgba(13, 13, 13, 0);
  border: 1.4px solid #000000;
  height: 38px;
  width: 30px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
}
input[type=range].range4::-ms-track {
  width: 100%;
  height: 27.5px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range].range4::-ms-fill-lower {
  background: #0ae60a;
  border: 1.2px solid #0ae60a;
  border-radius: 11.8px;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
}
input[type=range].range4::-ms-fill-upper {
  background: #0ae60a;
  border: 1.2px solid #0ae60a;
  border-radius: 11.8px;
  box-shadow: 1.4px 1.4px 1.1px #000000, 0px 0px 1.4px #0d0d0d;
}
input[type=range].range4::-ms-thumb {
  box-shadow: 2.9px 2.9px 3px rgba(0, 0, 0, 0), 0px 0px 2.9px rgba(13, 13, 13, 0);
  border: 1.4px solid #000000;
  height: 38px;
  width: 30px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  height: 27.5px;
}
input[type=range].range4:focus::-ms-fill-lower {
  background: #0ae60a;
}
input[type=range].range4:focus::-ms-fill-upper {
  background: #0ae60a;
}

</style>
<script>
(function(scope) {
    scope.$watch('msg', (msg) => {
        try {
            scope.getSliderId = () => {
                return document.querySelector(`#slider-7`);
            }
                   
            const sliderDom = scope.getSliderId();
            sliderDom.onchange = changeValue;
            function changeValue(evt) {
                // console.log("NEW SLIDER VALUE", sliderDom.value, evt);
                if (sliderDom.value !== undefined) {
                    scope.send({payload: sliderDom.value});
                }            };
            //  return msg;
        } catch(error){
            return error;
        }
    });
})(scope);
</script>
