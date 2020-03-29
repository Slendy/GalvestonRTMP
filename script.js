var error;
function handleClick(event){
    event.preventDefault();
    var cids = [];
    var cid = document.getElementById("cidInput").value;
    var videoType = document.getElementById("formatType").value;
    if(cid != null && cid.length != 0){//custom 
        if (cid.startsWith("CID") && cid.length == 16) {
            cids = [cid];
            fetchLinks(cids, videoType);
        } else {
            document.getElementById("error_msg").innerHTML = "Invalid camera id<br>";
            if(error != null){
                clearTimeout(error);
            }
            error = setTimeout(function(){
              document.getElementById("error_msg").innerHTML = "";
            }, 2000);

        }
    } else {//checkboxes
        cids = Array(event.target.length - 1).fill(0);
        checked = 0;
        for (var i = 0; i < event.target.length - 2; i++) {
            if (event.target[i].checked) {
                cids[checked] = event.target[i].name;
                checked++;
            }
        }
        cids.length = checked;
        fetchLinks(cids, videoType);
    }
}
function setup() {
    document.getElementById("customInput").addEventListener("submit", handleClick);
    document.getElementById("checkBoxes").addEventListener("submit", handleClick);
}
window.onload = setup();

var responses;
var completedRequests = 0;
var totalSize;

function fetchLinks(cids, videoType) {
    responses = Array(cids.length).fill(0);
    totalSize = cids.length;
    for (var i = 0; i < cids.length; i++) {
        request(cids[i], i, videoType);
    }
}

function request(cid, index, videoType) {
    var http = new XMLHttpRequest();
    http.open("GET", "https://relay.ozolio.com/ses.api?cmd=init&oid=" + cid + "&ver=5&channel=0&control=1&document=https%3A%2F%2Fwww.ozolio.com%2Fexplore");
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
             if(http.status != 200){
                 responses[index] = cid + ";Request failed. (Invalid cid?)";
                 completedRequests++;
                 checkDone();
                 return;
             }
             var oid = http.responseText.substring(http.responseText.indexOf("id")+6, http.responseText.indexOf("server")-8);
             http = new XMLHttpRequest();
             http.open("GET", "https://relay.ozolio.com/ses.api?cmd=open&oid=" + oid + "&output=1&format=" + videoType.toUpperCase());
             http.send();
             http.onreadystatechange = function() {
                if (http.readyState == 4) {
                    if(http.status != 200){
                        responses[index] = cid + ";Request failed. (Invalid cid?)";
                        completedRequests++;
                        checkDone();
                        return;
                    }
                    var name = http.responseText.substring(http.responseText.indexOf("name")+8, http.responseText.indexOf("desc")-8);
                    var link = http.responseText.substring(http.responseText.indexOf("source")+10, http.responseText.indexOf("state")-8);
                    responses[index] = name + ";" + link;
                    completedRequests++;
                    checkDone();
                }
            }
        }
    }
}

function checkDone() {
    if (completedRequests == totalSize) {
        var returnString = "<div id=\"response\">";
        for (var i = 0; i < responses.length; i++) {
            var parts = responses[i].split(";");
            var name = parts[0];
            var link = parts[1];
            returnString += "<div id=\"stream\"><div id=\"name\">" + name + "</div>" + link + "</div>"
        }
        document.body.innerHTML = returnString + "<button id=\"back\" onclick=\"reload(); return false;\">Go back</button></div>";
    } else {
        var progress = Math.round((completedRequests / totalSize)*100);
        document.getElementById("progress").innerHTML = progress + "%";
    }
}

function reload() {
  location.reload();
}
