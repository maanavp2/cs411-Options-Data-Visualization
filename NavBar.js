

function setup(){
    //first time on page set the username to blank
    if (sessionStorage.getItem("username") === null) {
        sessionStorage.setItem("username","")
    } else if(sessionStorage.getItem("username") != ""){
        var btn = document.getElementById("loginbtn");
        if (btn != null) {
            btn.style.display = "none";
        }
    }
    var pr = document.getElementById('profileTab');
    if (sessionStorage.getItem('username').length != "") {
        pr.style.display = "inherit";
    } else {
        pr.style.display = "none";
    }

    console.log('setup')
}

function createNav(){
    var body = document.getElementById("body");
    // var d = document.createElement('div');
    html = '<nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="graph.html">ODV</a></div><ul class="nav navbar-nav"><li><a href="graph.html">Graph</a></li><li id="profileTab"><a id="profileLink" href="UserProfile.html" style="display:inherit;">Profile</a></li><li id="volatilityTab"><a href="volatility.html" style="display:inherit;">Volatility</a></li><li id="volumeTab"><a href="volume.html" style="display:inherit;">Volume</a></li></ul><ul class="nav navbar-nav navbar-right"><li id="loginbtn"><a href="Login.html"><span class="glyphicon glyphicon-log-in"></span> Login</a></li></ul></div></nav>'

    body.innerHTML = html + body.innerHTML
    setup();
}

