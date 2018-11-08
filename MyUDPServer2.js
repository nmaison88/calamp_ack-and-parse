//TO RUN IN TERMINAL USE
// CD desktop
// cd node)udp_server
// node MyUDPServer2.js


// port to listen to
var PORT = 9494; // Change to your port number

// #'s should be replaced with your EC2 private ip
var HOST = '0.0.0.0';

// Load datagram module
var dgram = require('dgram');

// Create a new instance of dgram socket
var server = dgram.createSocket('udp4');
// Strings for parsing Ack
var ack= ""
var optionsHeader =""
var ServiceType=""
var mobileID=""
var Messagetype=""
var Acktype="0201" //this is both the service type and message type
var seqID=""
var APPVer="00000000"
fs = require('fs');


/**
Once the server is created and binded, some events are automatically created.
We just bind our custom functions to those events so we can do whatever we want.
*/

// Listening event. This event will tell the server to listen on the given address.
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port+"\n");
});

// Message event. This event is automatically executed when this server receives a new message
server.on('message', function (msg, remote) {
    // PRINT OUT THE INCOMING MESSAGE
    console.log('Message received from: ' + remote.address + ':' + remote.port +' - ' + msg.toString('hex') +"\n");
  

    fs.appendFile('/Users/Monument/Desktop/node_udp_server/node_udp_server.log', msg.toString('hex'), function (err) {
 	 if (err) return console.log(err);
  	// console.log('RAW > /Users/nethmaison/Desktop/node_udp_server/node_udp_server.txt');
	});
    var data= msg.toString('ascii')
  	// console.log(Buffer.from(data) +"\n");


  // DO SOMEHITNG WITH IT!
	





	


     var msgparse = msg.toString('hex');

	  var event= msgparse.slice(62,64);
    // event = parseInt(event, 16);//this will make the hex value decimal

    var gps_latt = msgparse.slice(34, 42);
    var convlat =parseInt(gps_latt, 16);//this will make the hex value decimal
    var convlat2 = -((~convlat) + 1);
        console.log('gps_latt=   ' + (convlat2/10000000));


    var gps_long =msgparse.slice(42, 50);
    var convlong = parseInt(gps_long, 16); 
    var convlong2 = -((~convlong) + 1);
      console.log('gps_long=   ' + (convlong2 /10000000));

    var accumcount= msgparse.slice(64,66);
    var deciaccum= parseInt(accumcount, 16);//this will make the hex value decimal
    console.log('Accum count =    '+deciaccum);
    

    if(deciaccum > 4){
      var accum0= msgparse.slice(66,74);  //distance accumulator data in meters
    accum0=(parseInt(accum0, 16) *0.000621371);//changes meters to miles

    var accum1= msgparse.slice(74,82);//ignition status data
    accum1=parseInt(accum1,16);


    var accum2= msgparse.slice(82,90);

    var accum3= msgparse.slice(90,98);//Vehicle speed data
    accum3= (parseInt(accum3, 16) /44.704);//this takes cms to mph

    var accum4= msgparse.slice(98,106);//Engine rpm data 
    accum4=parseInt(accum4 ,16);//takes decimal value timesfor rpm value


    var accum5= msgparse.slice(106,114);//throttle position data in .01%
    accum5= (parseInt(accum5 , 16) * .01) //puts into usable data


    var accum6= msgparse.slice(114,122);//odometer data
    accum6=(parseInt(accum6, 16) *0.000621371) //takes meters to miles

    var accum7= msgparse.slice(122,130);//fuel level percentage remaining in 0.1% 
    accum7= (parseInt(accum7, 16) * .01)//convert to usable value


    var accum8= msgparse.slice(130,138);//fuel level remaining data in milliliters
    accum8=(parseInt(accum8, 16) *0.00026417); //takes the milliliters to US  gallons

    var accum9= msgparse.slice(138,146);//engine coolant temp data 1/116th degree celcius data signed
    accum9 = (parseInt(accum9, 16) *16);//takes the value and makes it a celsius signed number(might need to alter for negative values)
    var accum10 = msgparse.slice(146, 154); //fuel rate data milliters per hour
    accum10 = parseInt(accum10, 16) * 0.00026417; //this is converting milliliters to gallons

    var accum11 = msgparse.slice(154, 162); //voltage in mv
    accum11 = parseInt(accum11, 16) / 1000; //this takes the decimal value and divides by 1000 for volts value

    var accum12 = msgparse.slice(162, 170); //calculated trip odometer in meters
    accum12 = parseInt(accum12, 16) * 0.000621371; //takes meters to miles

    var accum13 = msgparse.slice(170, 178); //calculated fuel usafe
    accum13 = parseInt(accum13, 16) * 0.00026417; //takes the milliliters to US  gallons

    var accumcontents =
  "Accum contents =    " +
  "\n Distance Traveled:   " +
  accum0 +
  "\n Ignition Status:   " +
  accum1 +
  "\n MIL Status:   " +
  accum2 +
  "\n Vehicle Speed:   " +
  accum3 +
  "\n Engine Speed:   " +
  accum4 +
  "\nThrottle Position:   " +
  accum5 +
  "\nOdometer:   " +
  accum6 +
  "\nFuel Level Percentage:   " +
  accum7 +
  "\nFuel Level Remaining:   " +
  accum8 +
  "\nEngine Coolant Temp:   " +
  accum9 +
  "\nFuel Rate:   " +
  accum10 +
  "\nBattery Voltage:   " +
  accum11 +
  "\nCalculated Trip Odometer:   " +
  accum12 +
  "\nCalculated Fuel Usage:   " +
  accum13 +
  "\n";

console.log("Accum contents =  " + accumcontents);
    }

    
var ack2 = msgparse.slice(0, 38);
var seqID = ack2.slice(22, 26);
console.log("SEQ ID===" + seqID);

var mobileID = ack2.slice(4, 14);
console.log(
  "MOBILE ID===" + mobileID + "EVENT ID===" + event + "SEQ ID===" + seqID
);
var ServiceType = ack2.slice(18, 20);

var optionsHeader = ack2.slice(0, 18);
// console.log(' Options sHeader===' + optionsHeader);

var Messagetype = ack2.slice(20, 22);
// console.log(' Messagetype ===' + Messagetype);
var ack =
  optionsHeader.toString("hex") +
  Acktype.toString("hex") +
  seqID.toString("hex") +
  Messagetype.toString("hex") +
  APPVer.toString("hex");
testBuff = new Buffer(ack, "hex");
// console.log(testBuff);

//console.log('data version:' +data);
if (ServiceType === "01") {
  console.log("ACK THIS ONE:");
  // SEND ACK BACK
  server.send(
    testBuff,
    0,
    testBuff.length,
    remote.port,
    remote.address,
    function(err, bytes) {
      if (err) throw err;
      //console.log('UDP message sent to ' + remote.address +':'+ remote.port + '\n');
    }
  );
}


 
 if (event === "30") {
  event = "Power OFF";
} else if (event === "31") {
  event = "Power ON";
} else if (event === "06") {
  event = "DRIVE";
} else if (event === "02") {
  event = " Ignition OFF";
} else if (event === "03") {
  event = "Ignition ON";
} else if (event === "35") {
  event = "FW upgrade";
} else if (event === "08") {
  event = "POLL";
} else if (event === "70") {
  event = "TOW ";
} else if (event === "40") {
  event = "HarshTurn";
} else if (event === "3d") {
  event = "Rapid Acelleraton";
} else if (event === "3e") {
  event = "Rapid Decelleration";
} else if (event === "3f") {
  event = "IMPACT Detection";
} else if (event === "33") {
  event = "LOW BATT ";
} else if (event === "79") {
  event = "Vitals INFO ";
} else if (event === "6b") {
  event = "Daily report ";
}
LINEBREAK =
  "-------------------------------------------------------------------------------------------------------------------------------------------------------------------- \n";

// console.log('ack string:' + optionsHeader + Acktype + Messagetype + seqID + APPVer);
console.log(
  new Date(Date.now()).toLocaleString() +
    "    Mobile ID:" +
    mobileID +
    "\n" +
    "     Event: " +
    event +
    "\n"
);
parsed =
  "\n" +
  new Date(Date.now()).toLocaleString() +
  "   Mobile ID:" +
  mobileID +
  "     Event: " +
  event +
  "GPS:   " +
  convlat2 / 10000000 +
  " " +
  convlong2 / 10000000 +
  "\n" +
  accumcontents +
  LINEBREAK;
fs.appendFile(
  "/node_udp_server/node_udp_server.log",
  parsed,
  function(err) {
    if (err) return console.log(err);
    // console.log('RAW > /Users/nethmaison/Desktop/node_udp_server/node_udp_server.txt');
  }
);
 





   
});

// Error event. Something bad happened. Prints out error stack and closes the server.
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

// Finally bind our server to the given port and host so that listening event starts happening.
server.bind(PORT, HOST);