var base = 'http://18.220.144.204:5000'

function loadList() {
    var usr = sessionStorage.getItem('username')
    const link = base+'/favorite/get?user='+usr;
    var request = new XMLHttpRequest();

    var favlist = [];
    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status === 200) {
                favlist = JSON.parse(request.response)
                for (let i = 0; i < favlist.length; i++) {
                    addTicker(favlist[i]);
                }
            }
        }
    }
    request.open("GET", link);
	request.send();

}


function deleteTicker(obj) {
    var usr = sessionStorage.getItem('username')
    const link = base+'/favorite/delete?user='+usr+'&ticker_symbol='+obj.id;
    var request = new XMLHttpRequest();

    var favlist = [];
    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status === 200) {
               obj.remove()
               location.reload();

            }
        }
    }
    request.open("GET", link);
	request.send();
}



function addTicker(tick) {
    var list = document.getElementById("userList");
    if (tick.length > 0) {
        var entry = document.createElement('div');
        entry.classList += ('panel-body row');
        
        var tc = document.createElement('div');
        tc.classList += ('col-sm-4 text-center');
        tc.innerHTML = tick;
        
        
        var dc = document.createElement('div');
        dc.classList.add('col-sm-4');
        
        
        var delbtn = document.createElement('BUTTON');
        delbtn.classList += ('btn btn-danger');
        delbtn.innerHTML = "x";
        delbtn.id = tick;
        delbtn.onclick = function() {deleteTicker(this);}
        
        dc.appendChild(delbtn);
        entry.appendChild(tc);
        entry.appendChild(dc);
        list.appendChild(entry);
        
        
        console.log(dc.children);
        console.log(entry.children);
        
        console.log('added: '+tick);
    }
}




function search(txt){
    console.log('searcingfor: ' + txt.value)
}


function addtolist() {
    var tick = document.getElementById("ticker").value;
    var list = document.getElementById("userList");
    
    
    if (tick.length > 0) {
        
        
        var usr = sessionStorage.getItem('username')
        const link = base+'/favorite/add?user='+usr+'&ticker_symbol='+tick;
        var request = new XMLHttpRequest();
        
        var added = false;
        request.onreadystatechange = function() { 
            if (request.readyState == XMLHttpRequest.DONE){
                if (request.status === 200) {
                    console.log('ADD:', tick)
                    addTicker(tick);
                    added = true;
                }
            }
        }
        request.open("GET", link);
        request.send();
        
        
        if (!added) {
            return
        }
        
        var entry = document.createElement('div');
        entry.classList += ('panel-body row');
        
        var tc = document.createElement('div');
        tc.classList += ('col-sm-4 text-center');
        tc.innerHTML = tick;
        
        
        var dc = document.createElement('div');
        dc.classList.add('col-sm-4');
        
        
        var delbtn = document.createElement('BUTTON');
        delbtn.classList += ('btn');
        delbtn.innerHTML = "X"
        
        dc.appendChild(delbtn);
        entry.appendChild(tc);
        entry.appendChild(dc);
        list.appendChild(entry);
        
        
        console.log(dc.children);
        console.log(entry.children);
        
        console.log('added: '+tick);
        
        
    }
}


function changePassword() {
    
    var usr = sessionStorage.getItem('username');
    var newPass = document.getElementById('newpwd').value;

    if (usr == null || newPass == null || usr.length === 0 || newPass.length === 0 ){
        return;
    }

    var link = base+'/update_password?user='+usr+'&password='+newPass;
    var request = new XMLHttpRequest();
   

    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if( request.status == 200) {
                document.location.href = 'Login.html';
                alert("Password Changed, sign in again");
            }
        }
    }
    request.open("GET", link);
    request.send();

}


// url: /favorite/<add,delete,get>?user=<>&ticker_symbol=<>
// / : returns a list 
// add,delte: returns status code


function deleteUser() {
    if (sessionStorage.getItem('warned') != null) {
        if (sessionStorage.getItem('warned') === '1') {
            var usr = sessionStorage.getItem('username')
            const link = base+'/delete?user='+usr;
            //null check not necessary bc only way to access this function is through profile page
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() { 
                if (request.readyState == XMLHttpRequest.DONE){
                    if (request.status === 200) {
                        alert("Your account was deleted")
                        document.location.href = 'Login.html';
                        sessionStorage.setItem('username',"")
                        sessionStorage.removeItem('warned')

                    }
                }
            }
            request.open("GET", link);
            request.send();
        } else {
            sessionStorage.setItem('warned',0);
        }
    } else {
        sessionStorage.setItem('warned',1);
        alert("THIS IS NOT REVERTABLE: YOUR ACCOUNT WILL BE DELETED")
    }


    
}