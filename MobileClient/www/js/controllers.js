angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, mqttSvc, orderItemsSvc) {

  $scope.status  = {message: '?'};

  mqttSvc.connectToAMQ();
  $scope.$on('$ionicView.enter', function(){
    console.log ('Entered Dash');

    var count = orderItemsSvc.getOrderItems().length;

    if (count > 0) {
      $scope.status.message = 'There are ' + count + ' items to be collected';
    } else {
      $scope.status.message = 'No activity at this time';
    }
    console.log ($scope.status.message);
  })  

  // Respond to an MQTT event
  $scope.$on ('mqttevent', function (){
    var count = orderItemsSvc.getOrderItems().length;
    if (count > 0) {
      $scope.status.message = 'There are ' + count + ' items to be collected';
    } else {
      $scope.status.message = 'No activity at this time';
    }
    console.log ($scope.status.message);
  })

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller ('OrderItemsCtrl', function ($scope, $stateParams, orderItemsSvc){
  $scope.orderitems = orderItemsSvc.getOrderItems();
})

.controller('AccountCtrl', function($scope, $state, $ionicPopup, orderItemsSvc) {
  $scope.console = {messages: "START"}
  //MQTT variables
  var reconnectTimeout = 2000;
  var mqttData = { 
    url: 'ec2-18-219-8-205.us-east-2.compute.amazonaws.com', 
    port: 1883, 
    clientId: 'SYSTEM_' + new Date().getTime(),
    topic: 'bestmart'
  };
  
  var client = new Paho.MQTT.Client(mqttData.url, mqttData.port, mqttData.clientId);;

  $scope.settings = {
    enableFriends: true
  };

  $scope.discconnectFromAMQ = function (){
    client.disconnect();
  }

  $scope.sendMessage = function (message){
    // var orderdata = {
    //   orderid: '1234',
    //   customer: 'John Doe',
    //   arrivaltime: '3:45pm'
    // }

    var customerOrder = {
      orderid :'12345',
      customer: 'Chritina Lin',
      arrivaltime: new Date().getTime()
    }

    var orderdata = orderItemsSvc.getOrderItemsSent();

    customerOrder.orderdata = orderdata;
    console.log (JSON.stringify(customerOrder, null, 2));
    

    var message = new Paho.MQTT.Message (JSON.stringify(customerOrder,null, 2));
    message.destinationName = mqttData.topic;
    client.send(message);
  }

  $scope.connectToAMQ = function (){
    
    // Create a client instance
    client = new Paho.MQTT.Client(mqttData.url, mqttData.port, mqttData.clientId);

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect});


    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      //client.subscribe(mqttData.topic);
      // message = new Paho.MQTT.Message("Test Feedhenry");
      // message.destinationName = mqttData.topic;
      // client.send(message);
    }

  };

  $scope.subscribeToTopic = function (){
    client.subscribe(mqttData.topic);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      $scope.console.messages = responseObject.errorMessage + ' ' + $scope.console.messages;
      
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    $scope.console.messages = message.payloadString + ' ' + $scope.console.messages;
    $scope.$apply();
    console.log("onMessageArrived:"+message.payloadString);
    
  }
    /*--------------------------------END OF MQTT---------------------------*/

  
});
