define([], function () {
    // version 0.1: implemented with execCommand
    var editorFrame, editorDoc, selRange;
    var srcFrame, srcDoc;
    var htmlchecked = false;

    var NODETYPE = {
        ELEMENT_NODE : 1,
        ATTRIBUTE_NODE : 2,
        TEXT_NODE : 3
    };

    function init() {
        editorFrame = document.getElementById("editor-frame");
        editorDoc = editorFrame.contentDocument || editorFrame.contentWindow.document; //IE 호환성
        srcFrame = document.getElementById("src-frame");
        srcDoc = srcFrame.contentDocument || srcFrame.contentWindow.document; //IE 호환성

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
        console.log("hidecolorpanel");
        document.getElementById("colorpalette").style.visibility="hidden";
    }

    function btnMouseOver() {
        this.style.border="outset 1px";
    }

    function btnMouseOut() {
        this.style.border="none";
    }

    function btnMouseDown() {
        this.style.border="inset 1px";
    }

    function btnMouseUp() {
        this.style.border="outset 1px";
    }

    function insertNodeAtSelection(editorFrameWindows, insertTableNode)
    {
        // get current selection
        var selObj = editorFrameWindows.getSelection();
        console.log("selectedText: " + selObj.toString());

        // get the first range of the selection
        // (there's almost always only one range)
        var range = selObj.getRangeAt(0);

        // deselect everything
        selObj.removeAllRanges();

        // remove content of current selection from document
        range.deleteContents();

        // get location of current selection
        var container = range.startContainer;
        var pos = range.startOffset;

        // make a new range for the new selection
        range=document.createRange();

        if (container.nodeType == NODETYPE.TEXT_NODE && insertTableNode.nodeType == NODETYPE.TEXT_NODE) {
            // if we insert text in a textnode, do optimized insertion
            container.insertData(pos, insertTableNode.nodeValue);

            // put cursor after inserted text
            range.setEnd(container, pos+insertTableNode.length);
            range.setStart(container, pos+insertTableNode.length);

        } else {
            var afterNode;
            if (container.nodeType ==  NODETYPE.TEXT_NODE) {
                // when inserting into a textnode
                // we create 2 new textnodes
                // and put the insertNode in between

                var textNode = container;
                container = textNode.parentNode;
                var text = textNode.nodeValue;

                // text before the split
                var textBefore = text.substr(0,pos);
                // text after the split
                var textAfter = text.substr(pos);

                var beforeNode = document.createTextNode(textBefore);
                afterNode = document.createTextNode(textAfter);

                // insert the 3 new nodes before the old one
                container.insertBefore(afterNode, textNode);
                container.insertBefore(insertTableNode, afterNode);
                container.insertBefore(beforeNode, insertTableNode);

                // remove the old node
                container.removeChild(textNode);

            } else {
                // else simply insert the node
                afterNode = container.childNodes[pos];
                container.insertBefore(insertTableNode, afterNode);
            }

            range.setEnd(afterNode, 0);
            range.setStart(afterNode, 0);
        }
        selObj.addRange(range);
    };

    function btnClick() {
        if ((this.id == "forecolor") || (this.id == "backcolor")) {
            parent.command = this.id;
            var buttonElement = document.getElementById(this.id);
            document.getElementById("colorpalette").style.left = buttonElement.offsetLeft;
            document.getElementById("colorpalette").style.top = buttonElement.offsetTop + buttonElement.offsetHeight;
            document.getElementById("colorpalette").style.visibility="visible";
        } else if (this.id == "print") {
            printDocument();
        } else if (this.id == "link") {
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
            rowstext = prompt("enter rows");
            colstext = prompt("enter cols");
            rows = parseInt(rowstext);
            cols = parseInt(colstext);
            if ((rows > 0) && (cols > 0)) {
                table = editorDoc.createElement("table");
                table.setAttribute("border", "1");
                table.setAttribute("cellpadding", "2");
                table.setAttribute("cellspacing", "2");
                tbody = editorDoc.createElement("tbody");
                for (var i=0; i < rows; i++) {
                    tr = editorDoc.createElement("tr");
                    for (var j=0; j < cols; j++) {
                        td = editorDoc.createElement("td");
                        br = editorDoc.createElement("br");
                        td.appendChild(br);
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
                insertNodeAtSelection(editorFrame.contentWindow, table);
            }
        } else if (this.id == "html") {
            if (htmlchecked) {
                document.getElementById("src-frame").style.visibility="hidden";
                htmlchecked = false;
            } else {
                htmlchecked = true;
                var htmlNode = document.createTextNode(editorDoc.body.innerHTML);
                srcDoc.body.innerHTML = "";
                htmlNode = editorDoc.importNode(htmlNode, false);
                srcDoc.body.appendChild(htmlNode);
                document.getElementById("src-frame").style.visibility="visible";
            }
        } else if (this.id == "copy") {
            if (window.getSelection()) {
                selRange = editorFrame.contentWindow.getSelection().toString();
            }
        } else if (this.id == "paste") {
            editorDoc.write(selRange);
        } else if (this.id == "cut") {
            if (window.getSelection()) {
                editorFrame.contentWindow.getSelection().getRangeAt(0).deleteContents();
            }
        }
        else {
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