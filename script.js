cids = [];

function setup() {
    var element = document.querySelector('form');
    element.addEventListener('submit', event => {
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
};
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
    http.open("GET", "https://relay.ozolio.com/ses.api?cmd=init&oid=" + url + "&ver=4&url=https%3A//www.galveston.com/&chm=1&chf=0&svr=https%3A//relay.ozolio.com/&rid=sess_init");
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            var oid = find(http.responseText.split("\n"), "session_oid=");
            var http2 = new XMLHttpRequest();
            http2.open("GET", "https://relay.ozolio.com/ses.api?cmd=open&oid=" + oid + "&type=live&format=rtmp&profile=&rid=live_open_1")
            http2.send();
            http2.onreadystatechange = function() {
                if (http2.readyState == 4) {
                    responses[index] = find(http2.responseText.split("\n"), "output_url=") + ";" + url;
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
            returnString += (i != 0 ? "<br>" : "") + getCamName(responses[i].split(";")[1]) + "</br>" + responses[i].split(";")[0] + "</br>";
        }
        document.body.innerHTML = returnString;
    }
}

function getCamName(cid) {
    switch (cid) {
        case "CID_HCIR000000A0":
            return "Cruise";
        case "CID_JVHJ0000009B":
            return "Strand";
        case "CID_KLBA00000098":
            return "Emerald";
        case "CID_ZFXT00000403":
            return "Murdoch";
        case "CID_KPIK000004AD":
            return "Marina";
        case "CID_NCUS00000344":
            return "East beach";
        case "CID_KYUQ00000099":
            return "Pier 23";
        case "CID_MPBL0000009C":
            return "Beach";
        case "CID_SVMP0000029F":
            return "Babe's beach";
        case "CID_BQUM000000BA":
            return "Pyramid";
        case "CID_BKTJ0000015F":
            return "Surf";
        case "CID_HIEV0000024F":
            return "Seawall";
        default:
            return "Unknown (" + cid + ")";
    }
}

function find(array, key) {
    for (var i = 0; i < array.length; i++) {
        var t = array[i];
        if (t.includes(key)) {
            return t.replace(key, "");
        }
    }
}
