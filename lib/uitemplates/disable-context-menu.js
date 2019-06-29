// name: disable-context-menu
<script id="disableContextMenu" type="text/javascript">

$(function() {
    const board = document.querySelector("body");
    //  console.log("board", board);
    board.oncontextmenu = (event) => {
        event.preventDefault();
        //  console.log("prevented right click");
        return false;
    }
});

</script>