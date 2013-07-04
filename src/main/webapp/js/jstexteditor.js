define([], function () {
    var editorFrame, editorDoc;

    function init() {
        editorFrame = document.getElementById("editor-frame");
        editorDoc = editorFrame.contentDocument || editorFrame.contentWindow.document; //IE 호환성
        console.log("init");
        initToolbarButtons();
    }

    function initToolbarButtons() {
        editorDoc.designMode = "on";
        var uibuttons = document.getElementsByClassName('uibutton');

        for (var i=0; i < uibuttons.length; i++) {
            uibuttons[i].onmouseover = btnMouseOver;
            uibuttons[i].onmouseout = btnMouseOut;
            uibuttons[i].onmousedown = btnMouseDown;
            uibuttons[i].onmouseup = btnMouseUp;
            uibuttons[i].onclick = btnClick;
        }

        // color panel hide하는 이벤트 등록
        if (document.addEventListener) {
            document.addEventListener("mousedown", hidecolorpanel, true);
            editorDoc.addEventListener("mousedown", hidecolorpanel, true);
            document.addEventListener("keypress", hidecolorpanel, true);
            editorDoc.addEventListener("keypress", hidecolorpanel, true);
        } else if (document.attachEvent) { // IE 호환성
            document.attachEvent("mousedown", hidecolorpanel, true);
            editorDoc.attachEvent("mousedown", hidecolorpanel, true);
            document.attachEvent("keypress", hidecolorpanel, true);
            editorDoc.attachEvent("keypress", hidecolorpanel, true);
        }
    }

    function hidecolorpanel() {
        document.getElementById("colorpalette").style.visibility="hidden";
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
    }

    function btnMouseUp() {
        this.style.border="outset 1px";
    }

    function getOffsetTop(element) {
        var mOffsetTop = element.offsetTop;
        var mOffsetParent = element.offsetParent;

        while(mOffsetParent){ // 이게 왜 필요한지 아직 모르겠음
            mOffsetTop += mOffsetParent.offsetTop;
            mOffsetParent = mOffsetParent.offsetParent;
        }

        return mOffsetTop;
    }

    function getOffsetLeft(element) {
        var mOffsetLeft = element.offsetLeft;
        var mOffsetParent = element.offsetParent;

        while(mOffsetParent){
            mOffsetLeft += mOffsetParent.offsetLeft;
            mOffsetParent = mOffsetParent.offsetParent;
        }

        return mOffsetLeft;
    }
    function btnClick() {
        if ((this.id == "forecolor") || (this.id == "backcolor")) {
            buttonElement = document.getElementById(this.id);
            console.log("left: " + getOffsetLeft(buttonElement));
            console.log("top: " + getOffsetTop(buttonElement) + buttonElement.offsetHeight);
            document.getElementById("colorpalette").style.left = getOffsetLeft(buttonElement);
            document.getElementById("colorpalette").style.top = getOffsetTop(buttonElement) + buttonElement.offsetHeight;
            document.getElementById("colorpalette").style.visibility="visible";
        } else if (this.id == "print") {
            printDocument();
        } else if (this.id == "link") {
            console.log("link");
            var stringURL = prompt("Enter a URL:", "http://");
            if ((stringURL != null) && (stringURL != "")) {
                editorDoc.execCommand("CreateLink", false, stringURL);
            }
        } else if (this.id == "image") {
            // 실제로 이미지로 upload해서 insert는 안되나?
            imagePath = prompt('Enter Image URL:', 'http://www.underfives.co.uk/Spring%20Logo%2017.08.08.jpg');
            if ((imagePath != null) && (imagePath != "")) {
                editorDoc.execCommand('InsertImage', false, imagePath);
            }
        } else if (this.id == "table") {
            console.log("table");
        } else {
            console.log("else: " + this.id);
            editorDoc.execCommand(this.id, false, null);
        }

    }

    function printDocument() {
        var printWindow = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
        printWindow.document.open();
        printWindow.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + editorDoc.body.innerHTML+ "<\/body><\/html>");
        printWindow.document.close();
    }

    return {
        init: init
    };
});