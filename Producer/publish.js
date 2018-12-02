// INCLUDE THE MQTT BITSs
var mqtt = require ('mqtt');

// INCLUDE THE SAMPLE DATA (ORDERS)
var sample_data = require ('./sample_mqtt_data.json');

console.log ();
console.log ('READING JSON DATA ....');
console.log ('Customer Name:   ' + sample_data.customer);
console.log ('Arrival time:    ' + new Date(sample_data.arrivaltime).toLocaleTimeString());
console.log ('Number of items: ' + sample_data.orderdata.length);


// ADD ROUGHLY 25 MINUTES TO THE CURRENT TIME 
sample_data.arrivaltime = new Date (new Date().getTime() + 1650000).getTime();

// CONNECT TO THE AMQ SERVER USING MQTT PROTOCAL
var client = mqtt.connect ('mqtt://ec2-18-219-8-205.us-east-2.compute.amazonaws.com:1883');

// PUBLISH THE SAMPLE DATA TO THE TOPIC AND THEN CLOSE

console.log ();
console.log ('SENDING TO AMQ SERVER: ec2-18-219-205.us-east-2.compute.amazonaws.com:1883');
console.log ('DISCONNECTING ....');
console.log ();

client.on('connect', function (){
	client.publish ('bestmart', JSON.stringify(sample_data, null, 2));
	client.end();
});
