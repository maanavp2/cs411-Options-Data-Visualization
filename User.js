
var base = 'http://18.220.144.204:5000'

function login(){
    var usr = document.getElementById('usr').value;
    var pwd = document.getElementById('pwd').value;
    
    const link = base+'/login?user='+usr+'&password='+pwd;

    var request = new XMLHttpRequest();
    request.open("GET", link);
	request.send();
    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if( request.status == 200) {
                sessionStorage.setItem('username', usr);
                console.log('success');
                document.location.href = 'UserProfile.html';
            }
            if (request.status === 401) {
                alert("username or login incorrect");
            }
        }
    }
    
    // if (request.re === 200) {
    //     sessionStorage.setItem('username', usr)
    //     console.log('success')
    //     alert("logged in");
    // }
}

//failed password = 401

//login: /login
//signup: /signup?user=<>&password=<>
//delete: /delete/{username}

function signup(){
    var usr = document.getElementById('usr').value;
    var pwd = document.getElementById('pwd').value;
    if (usr.length === 0 || pwd.length ===0 ){
        return 500;
    }
    const link = base+'/signup?user='+usr+'&password='+pwd;
    var request = new XMLHttpRequest();
   

    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if( request.status == 200) {
                document.location.href = 'Login.html';
                alert("Account has been created");
            }
            if (request.status === 409) {
                alert("this username is taken");
            }
        }
    }
    request.open("GET", link);
	request.send();
   
    console.log('reqstatus',request.status);
    console.log('signup');
}
//userexists: 409


