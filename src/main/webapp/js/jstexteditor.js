define([], function () {

    function init() {
        console.log("init");
        initToolbarButtons();
    }

    function initToolbarButtons() {
        document.getElementById('edit').contentWindow.document.designMode = "on";

//        var edit = document.getElementById('edit');
//        document.getElementById('edit').contentWindow.document.designMode = "on";
//        try {
//            document.getElementById('edit').contentWindow.document.execCommand("undo", false, null);
//        }  catch (e) {
//            alert("This demo is not supported on your level of Mozilla.");
//        }

        var uibuttons = document.getElementsByClassName('uibutton');

        for (var i=0; i < uibuttons.length; i++) {
            uibuttons[i].onmouseover = btnMouseOver;
            uibuttons[i].onmouseout = btnMouseOut;
            uibuttons[i].onmousedown = btnMouseDown;
            uibuttons[i].onmouseup = btnMouseUp;
            uibuttons[i].onclick = btnClick;
        }
    }

    function btnMouseOver() {
        this.style.border="outset 1px";
    }

    function btnMouseOut() {
        this.style.border="none";
    }

    function btnMouseDown(event) {
        var evt = event ? event : window.event;

        this.style.border="inset 1px";

        if (evt.returnValue) { // IE
            evt.returnValue = false;
        } else if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            return false;
        }
    }

    function btnMouseUp() {
        this.style.border="outset 1px";
    }

    function btnClick() {
        if (this.id == "print") {
            console.log("print");
        } else if (this.id == "link") {
            console.log("link");
        } else if (this.id == "image") {
            console.log("image");
        } else if (this.id == "table") {
            console.log("table");
        } else {
            console.log("else");
            var edit = document.getElementById('edit2');
            edit.contentWindow.document.execCommand(this.id, false, null);



//            document.getElementById('edit').contentWindow.document.execCommand(this.id, false, null);
        }

    }

    return {
        init: init
    };
});