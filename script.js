var cids = ["CID_JVHJ0000009B", "CID_HCIR000000A0", "CID_KLBA00000098", "CID_ZFXT00000403", "CID_KPIK000004AD"];

for(var i = 0; i < cids.length; i++){
  request(cids[i], i);
}

responseText = "";

function request(url, index){

  var http = new XMLHttpRequest();
  http.open("GET", "https://relay.ozolio.com/ses.api?cmd=init&oid=" + url + "&ver=4&url=https%3A//www.galveston.com/&chm=1&chf=0&svr=https%3A//relay.ozolio.com/&rid=sess_init");
  http.send();
  http.onreadystatechange = function(){
    if(http.readyState == 4){
      var oid = find(http.responseText.split("\n"), "session_oid=");
      var http2 = new XMLHttpRequest();
      http2.open("GET", "https://relay.ozolio.com/ses.api?cmd=open&oid=" + oid + "&type=live&format=rtmp&profile=&rid=live_open_1")
      http2.send();
      http2.onreadystatechange = function(){
        if(http2.readyState == 4){
          responseText += "<br>" + name(url) + "</br>" + find(http2.responseText.split("\n"), "output_url=") + "</br>";
          if(index == 4)
            document.body.innerHTML = responseText.substring(4);
        }
      }
    }
  }
 
}

function name(cid){
        switch(cid){
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
            default:
                return "Unknown";
        }
}

function find(array, key){
  for(var i = 0; i < array.length; i++){
    var t = array[i];
    if(t.includes(key)){
      return t.replace(key, "");
    }
  }
}
