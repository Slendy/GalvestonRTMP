cids = [];

function setup() {
    document.getElementById("form2").addEventListener("submit", event => {
        event.preventDefault();
        var cid = event.target[0].value;
        if(cid.startsWith("CID") && cid.length == 16){
            cids = [cid];
            fetchLinks();
        } else {
            document.getElementById("error_msg").innerHTML = "Invalid camera id"
        }
    });
    document.getElementById("form1").addEventListener('submit', event => {
        event.preventDefault();
        cids = Array(event.target.length - 1).fill(0);
        checked = 0;
        for (var i = 0; i < event.target.length - 1; i++) {
            if (event.target[i].checked) {
                cids[checked] = event.target[i].name;
                checked++;
            }
        }
        cids.length = checked;
        fetchLinks();
    });
}
window.onload = setup();

responses = Array(cids.length).fill(0);
completedRequests = 0;

function fetchLinks() {

    for (var i = 0; i < cids.length; i++) {
        request(cids[i], i);
    }
}

function request(url, index) {

    var http = new XMLHttpRequest();
    http.open("GET", "https://relay.ozolio.com/ses.api?cmd=init&oid=" + url + "&ver=4&url=https%3A//www.ozolio.com&chm=1&chf=0&svr=https%3A//relay.ozolio.com/&rid=sess_init");
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            var oid = find(http.responseText.split("\n"), "session_oid=");
            var http2 = new XMLHttpRequest();
            http2.open("GET", "https://relay.ozolio.com/ses.api?cmd=open&oid=" + oid + "&type=live&format=rtmp&profile=&rid=live_open_1")
            http2.send();
            http2.onreadystatechange = function() {
                if (http2.readyState == 4) {
                    responses[index] = find(http2.responseText.split("\n"), "output_url=") + ";" + find(http2.responseText.split("\n"), "output_name=");
                    completedRequests++;
                    checkDone();
                }
            }
        }
    }
}

function checkDone() {
    if (completedRequests == cids.length) {
        var returnString = "";
        for (var i = 0; i < responses.length; i++) {
            returnString += (i != 0 ? "<br>" : "") + (responses[i].split(";")[1]) + "</br>" + responses[i].split(";")[0] + "</br>";
        }
        document.body.innerHTML = returnString + "</br><button onclick=\"reload(); return false;\">Go back</button>";
    }
}

function reload(){
    location.reload();
}

function find(array, key) {
    for (var i = 0; i < array.length; i++) {
        var t = array[i];
        if (t.includes(key)) {
            return t.replace(key, "");
        }
    }
}
