// Parse the Data
function getAvgData() {
	url = "http://18.220.144.204:5000/avg"
    const link = url;

    var request = new XMLHttpRequest();
    request.open("GET", link);
    request.send();
    request.onreadystatechange = function() { 
        if (request.readyState == XMLHttpRequest.DONE){
            if( request.status == 200) {
                console.log('success');
                resp = JSON.parse(request.response)
                console.log(resp.length)
                
                calls = []
                puts = []
                for (let i = 0; i < resp.length ; i++) {
                    if (i < resp.length / 2) {
                        calls.push(resp[i])
                    } else {
                        puts.push(resp[i])
                    }
                }

                console.log(calls);
                console.log(puts);
                
                calltab = document.getElementById("CallsTable");
                
                for (let i = 0; i < calls.length; i++) {
                    c = calls[i]
                    row = document.createElement("tr");
                    
                    sym = document.createElement("td");
                    sym.innerHTML = c[0];

                    bidp = Math.min(c[1],c[2])
                    askp = Math.max(c[1],c[2])

                    bid = document.createElement("td")
                    bid.innerHTML = bidp
                    ask = document.createElement("td")
                    ask.innerHTML = askp

                    row.appendChild(sym)
                    row.appendChild(bid)
                    row.appendChild(ask)

                    calltab.appendChild(row)
                }

                putstab = document.getElementById("PutsTable");
                for (let i = 0; i < puts.length; i++) {
                    p = puts[i]
                    row = document.createElement("tr");
                    
                    sym = document.createElement("td");
                    sym.innerHTML = p[0];

                    bidp = Math.min(p[1],p[2])
                    askp = Math.max(p[1],p[2])

                    bid = document.createElement("td")
                    bid.innerHTML = bidp
                    ask = document.createElement("td")
                    ask.innerHTML = askp

                    row.appendChild(sym)
                    row.appendChild(bid)
                    row.appendChild(ask)

                    putstab.appendChild(row)
                }
                




            }
            else {
                alert("Couldn't fetch average data");
            }
        }
    }
}
