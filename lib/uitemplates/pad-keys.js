// name: pad-keys
<!DOCTYPE html>
<svg 
    id="{{'pad-keys-'+ $id}}" 
    ng-if="items && items.length > 1">
    <text x="10" y="20" fill="black" style="{{'font-size:20px'}}">
        Reference GL4000 : 
    </text>
    <g ng-repeat="item in items track by $index">
        <rect 
            x="{{getX($index)}}" 
            y="25"
            width="10" 
            height="10"
            fill="{{getColor(item)}}" >
        </rect>
        <text ng-bind="$index + 1" 
            x="{{getX($index)}}" 
            y="40" 
            fill="black" 
            style="{{'font-size:8px'}}">
        </text>
    </g>
</svg>
<script>
(function(scope) {
    // scope.items = [1, 0, 0, 1, 0, 0];
    scope.getColor = (value) => {
        // console.log("getColor", value);
        if (value === 1 || value === "1") {
            return '#baff00';
        }
        return '#ff4500';
    };
    
    scope.getX = (index) => {
        if (index !== undefined) {
            return 20 * index;
        }
        return 0;
    };
    
    scope.$watch('msg', (msg) => {
        if (msg && msg.payload) {
            scope.items = msg.payload;
        }
        //  return msg;
    });
})(scope);
</script>
