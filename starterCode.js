function getWeather(){
    // This function gets called when the "Get Weather" button the the HTML page is clicked.
	// First, we need to retrieve the desired ZIP code from the page:
	var zip = document.getElementById('zip').value;
    // And now we can build the query to send to the weather API. An API is an interface that 
	// lets us talk to a different machine - in this case one that provides weather data
	// If you want to try this code, you MUST get your own API key from openweathermap.org
	// and put it in place of the <yourkeygoeshere> placeholder !!!!!!!!!!!!!!!!!!!!!!!!!!
  	var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",US&appid=b1a0d1bee1f66048f51936fdff910cf2";
    // Now that we have a nice query, we can send it to the server. Note that this function will terminate
	// right after the request is sent.
	jsonRequest(url);
    // jsonRequest is a function that handles the actual communication with the server. 
	// You can take a look at it at the bottom of this file if you like.
}

function processResponse(wxObject,rawResponse){
	var Kelvin=wxObject.main.temp;
	// Conversion
	var Celsius=Kelvin-273;
	var Fahrenheit=Math.round(32+(Celsius*1.8));
	// Temp and condition stuff
	var result="<h4>Right now it's "+Fahrenheit+"F in "+wxObject.name+". Condition: "+wxObject.weather[0].main+".";
	// Image
	document.getElementById("conditions").style='background:url('+wxObject.weather[0].main+'.jpg) repeat';
	// Day/night stuff
	var n = wxObject.dt;
	if (n < wxObject.sys.sunrise) {document.body.style.backgroundColor = "black";
									document.getElementById("temperature").style.color = "white";
									var result = result+" The sun has set.";}
	else if (wxObject.sys.sunrise <= n && n < wxObject.sys.sunset) {document.body.style.backgroundColor = "white";
									document.getElementById("temperature").style.color = "black";
									var result = result+" The sun is up.";}
	else if (n >= wxObject.sys.sunset) {document.body.style.backgroundColor = "black";
									document.getElementById("temperature").style.color = "white";
									var result = result+" The sun has set.";}
	// Hot/cold stuff
	if (Fahrenheit < 40) {
		document.getElementById("transbox").style.backgroundColor = "#121e53";
		var result = result+" It's cold out there!</h4>";
		}
	else if (Fahrenheit > 80) {
		document.getElementById("transbox").style.backgroundColor = "#fa6300";
		var result = result+" It's hot out there!</h4>";
	}
	else {
		document.getElementById("transbox").style.backgroundColor = "";
		var result = result+"</h4>"
	}
	// Sending info to HTML
	document.getElementById("temperature").innerHTML=result;
}

function processError(){
    // We never call this function either. It gets started if we encounter an error while retrieving info  
    // from the weather API.   
    // You can use this function to display an error message and image if something goes wrong
	document.getElementById("temperature").innerHTML="Something went wrong! Please try again.";
	document.getElementById("conditions").style='background:url(try.jpg) repeat';
	document.getElementById("transbox").style.backgroundColor = ""
	}   


	
	
	
	
	
	
	
	







function jsonRequest(url)
{
    var con = new XMLHttpRequest();
    // The following is a function within an event handler within an object. 
	// We have not covered this in class, but basically this nested function
	// will get called whenever the "state" of the connection changes - usually 
	// that means that we either got a valid response or an error message. 
	// Sometimes a connection will time out and then this never gets called.
    con.onreadystatechange = function()
    {
        if (con.readyState === XMLHttpRequest.DONE) {
            // A connection's state can change multiple times, so we need to check whether 
			// it is now done and whether the response was a good one (status 200 means everyhting is great)
    		if (con.status === 200) {
                    // If we have a good response, we take the JSON string and convert it to an object.
					// We then call the processResponse function to analye the received data
  			        processResponse(JSON.parse(con.responseText),con.responseText);
            } else {

  			        processError();
            }
        }
    };
    // This opens the connection to teh server and sends the actual request:
    con.open("GET", url, true);
    con.send();
}
