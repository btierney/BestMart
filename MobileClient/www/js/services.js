angular.module('starter.services', [])
.service ('mqttSvc', function ($state, $rootScope, $ionicPopup, orderItemsSvc){
  //MQTT variables
  var client;
  var reconnectTimeout = 2000;
  var mqttData = { 
    url: 'ec2-18-219-8-205.us-east-2.compute.amazonaws.com', 
    port: 1883, 
    //url: 'localhost',
    //url: '192.168.1.176',
    //url:'broker.mqttdashboard.com',
    //port: 8000,
    clientId: 'Associate_' + new Date().getTime(),
    topic: 'bestmart'
  };

  var connectToAMQ = function (){
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
      client.subscribe(mqttData.topic);

      // message = new Paho.MQTT.Message("Test Feedhenry");
      // message.destinationName = mqttData.topic;
      // client.send(message);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
    }

    function onMessageArrived(message){
    //   var orderdetail = {
    //     orderid: '12345',
    //     customer: 'John Doe',
    //     arrivaltime: '3:45pm'
    // };
      console.log ('onMessageArrived: ' + message.payloadString);
      var customerOrder = JSON.parse(message.payloadString);

      orderItemsSvc.setOrderItems (customerOrder.orderdata);
      // let everybody know
      $rootScope.$broadcast ('mqttevent')

      var now = new Date().getTime();
      var arv = customerOrder.arrivaltime;
      var diff = arv-now;
      var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes

      var html = '<h4>Order #:' + customerOrder.orderid + '</h4>';
      html += '<p>Customer: ' + customerOrder.customer + ' en route <br/>';
      html += 'Arriving: ' + new Date(arv).toLocaleTimeString()+ ' (' + diffMins + ' mins ) </p>';

      var confirmPopup = $ionicPopup.confirm({
        title: 'Order Pickup',
        template: html
      });

      confirmPopup.then(function (res) {
        if (res) {
          //$state.go ('tab.orderdetail');
        }
      })

    }// end onMessageArrived
  };

  return {
    connectToAMQ : connectToAMQ
  }

})// end mqttSvc 

.service ('orderItemsSvc', function (){
  var orderitems = [];
  var orderitemssent = [
    {
      "itemid": 55427162,
      "parentitemid": 55427162,
      "name": "\"Sceptre 75\"\" Class 4K (2160P) LED TV (U750CV-U)\"",
      "msrp": 1299.99,
      "saleprice": 1099.99,
      "upc": "792343375807",
      "categorypath": "Electronics/TV & Video/4K TVs by Brand/4K Sceptre TVs",
      "shortdescription": "At 75 inches, you will feel surrounded by eight million pixels that are brought to life by unsurpassed clarity and color. Sceptre 4K Ultra High-Definition displays have four times the number of pixels as as Full HD display, turning your shows into an epic UHD viewing experience. Four HDMI ports allow you to connect up to four devices at once, so you can stream, browse and listen to all of your favorite multimedia. The HDMI 2.0 ports allow you to seamlessly stream 4K video to get the most rewarding viewing experience that is available on the market. Explore your apps on this giant LED screen once you connect your smartphone or tablet to the Mobile High-Definition Link (MHL) port (HDMI 1). The innovative USB port further expands functionality, allowing users to listen to music and view digital pictures quickly and conveniently.",
      "longdescription": "&quot;Sceptre 75&quot;&quot; Class TV (U750CV-U):Key Features:Screen Size (Diag.): 74.5&quot;&quot;Backlight Type: LEDResolution: 2160pEffective Refresh Rate: 60HzSmart Functionality: noAspect Ratio: 16:9Dynamic Contrast Ratio: 20,000:1Viewable Angle (H/V): 178 degrees/178 degreesNumber of Colors: 16.7 MOSD Language: English, Spanish, FrenchSpeakers/Power Output: 10W x 2Noise Reduction and Weak Signal EnhancementConnectivity:Component/Composite Video: 1HDMI: 4Headphone: 1Optical Digital Audio: 1RCA Audio L+R: 1RF (Coaxial): 1USB 2.0: 1What's In The Box:Remote ControlWall-mountable:Mount Pattern: 400mm x 200mmScrew Size: M6Screw Length: 26mmSupport and Warranty:1-year limited labor and partsFlat Screen TV stand sold separately. See all TV stands.Flat Screen TV mount sold separately. See all TV mounts. TV audio equipment sold separately. See all Home Theater Systems. HDMI cables sold separately. See all HDMI Cables.Accessories sold separately. See all Accessories.&quot;",
      "thumbnailimage": "https://i5.walmartimages.com/asr/3564c8b1-1d7f-4e29-b31e-50af09a79db4_1.26947c29eb52cd3a4ff9b06583e04cd6.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF",
      "mediumimage":    "https://i5.walmartimages.com/asr/3564c8b1-1d7f-4e29-b31e-50af09a79db4_1.26947c29eb52cd3a4ff9b06583e04cd6.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "largeimage":     "https://i5.walmartimages.com/asr/3564c8b1-1d7f-4e29-b31e-50af09a79db4_1.26947c29eb52cd3a4ff9b06583e04cd6.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
    },
    {
      'itemid': 51466465,
      'parentitemid': 51466465,
      'name': 'Furniture of America Contemporary Multiple Storage TV Stand',
      'saleprice': 274.14,
      'upc': '889435226700',
      'categorypath': 'Home/Furniture/TV Stands & Entertainment Centers/TV Stands',
      'shortdescription': 'Keep your living room looking sharp with the Furniture of America Contemporary Multiple Storage TV Stand, providing a place for all your video equipment, movies, and video games in one convenient location. This wide, modern TV stand is built using tough medium-density fiberboard overlaid with select veneers for a rich wood-grain surface. Four open shelves offer an ideal space for collecting your consoles, cable boxes, and stereo receivers, featuring wire-management panels. A pair of roomy-single door cabinets and a pull-out drawer offer additional out-of-sight storage, equipped with metal hardware. Select from available finish options. Furniture of America Based in California, Furniture of America has spent more than 20 years establishing itself as a premier provider of fine home furnishings to urban-minded shoppers',
      'longdescription': 'The people behind the brand are moved by passion, hard work, and persistence, and their company\'s mission is to design the latest piece and offer high-quality furniture to trendy shoppers without compromising packaging integrity. Furniture of America offers unique, coordinated, and affordably designed furniture - not to mention exceptional style.',
      'thumbnailimage': 'https://i5.walmartimages.com/asr/39514683-28bd-46e8-a4b9-1a6e3325953e_1.87e61afa267555f338e31db42e3e1678.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
      'mediumimage': 'https://i5.walmartimages.com/asr/39514683-28bd-46e8-a4b9-1a6e3325953e_1.87e61afa267555f338e31db42e3e1678.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      'largeimage': 'https://i5.walmartimages.com/asr/39514683-28bd-46e8-a4b9-1a6e3325953e_1.87e61afa267555f338e31db42e3e1678.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF'
    },
    {
      "itemid": 23787927,
      "parentitemid": 23787927,
      "name": "\"VIZIO 42\"\" 5.1ch Sound Bar System (S4251w-B4)\"",
      "msrp": 336.69,
      "saleprice": 198,
      "upc": "845226008979",
      "categorypath": "Electronics/Home Audio & Theater/Home Audio/All Home Speakers/Speaker Systems",
      "shortdescription": "For the pinnacle of surround sound immersion and convenience, the VIZIO 42&rdquo;5.1 Sound Bar System sets the bar exceptionally high. Designed to complement any medium to large sized HDTV, this three channel sound bar features a wireless subwoofer and dedicated rear satellite speakers putting you in the center of the action. Built-in Bluetooth&reg; allows you to wireless stream music from a smartphone or tablet while Dolby Digital&reg;, DTS Digital Surround&trade; audio technologies bring movies, music and games to life in crystal clear detail. Rated at up to 102 dB with less than 1% Total Harmonic Distortion*, the S4251w is a true premium surround sound system that turns any room into the ultimate home theater. *Sound Pressure Level measured using pink noise at 1 meter, C-weighted. Total harmonic distortion calculated as electrical measurement of amplifier distortion.",
      "longdescription": "&quot;VIZIO 42&quot;&quot; 5.1ch Sound Bar System (S4251w-B4):Complete 5.1 surround sound home theater solution: 42&rdquo; sound bar with left, right and center channels, wireless subwoofer and rear satellite speakers&nbsp;Best in class audio performance: up to 102dB of room filling, crystal clear surround sound with less than 1% total harmonic distortion*&nbsp;Wirelessly stream your music from a smartphone or tablet via Bluetooth&nbsp;Premium audio with Dolby Digital&reg; and DTS Digital Surround&trade; decoding, plus DTS TruVolume&trade; and DTS Circle Surround&trade; audio post processing&nbsp;Intuitive LCD display remote that brings all of the controls and settings right into your hands without ever leaving your couch&nbsp;Connects to your TV with an easy, one-cable setup &ndash;all cables included&nbsp;Designed to complement 47&rdquo;+ class TVs.&nbsp;Table-stand or wall-mount options*Sound Pressure Level measured using pink noise at 1 meter, C-weighted. Total harmonic distortion calculated as electrical measurement of amplifier distortion. **Wireless Subwoofer range approximately 60 feet &ndash; line of sight from Sound bar.*Sound Pressure Level measured using pink noise at 1 meter, C-weighted. Total harmonic distortion calculated as electrical measurement of amplifier distortion. **Wireless Subwoofer range approximately 60 feet &ndash; line of sight from Sound bar.&quot;",
      "thumbnailimage": "https://i5.walmartimages.com/asr/3c5a0412-f090-4737-ab00-03b598893274_1.cf0d1853ac69315891163dc9fdf1c1e6.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF",
      "mediumimage": "https://i5.walmartimages.com/asr/3c5a0412-f090-4737-ab00-03b598893274_1.cf0d1853ac69315891163dc9fdf1c1e6.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "largeimage": "https://i5.walmartimages.com/asr/3c5a0412-f090-4737-ab00-03b598893274_1.cf0d1853ac69315891163dc9fdf1c1e6.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    },
    {
      "itemid": 48268242,
      "parentitemid": 48268242,
      "name": "Best Choice Products Executive Swivel Massage Recliner w/ Control, 5 Heat & Massage Modes, 2 Cup Holders, 92lbs (Brown)",
      "msrp": 499.99,
      "saleprice": 283.99,
      "upc": "810010025968",
      "categorypath": "Home/Furniture/Living Room Furniture/Recliners",
      "shortdescription": "True relaxation doesn&rsquo;t compromise on style. With luxurious, soft PU leather upholstery and a heated massage system, this recliner chair looks and feels amazing. The ergonomic design of this chair is complimented by a variety of ways to customize your massage experience, perfect to sink into after a long, hard day of work. FEATURES: Soft and padded easy-to-clean PU leather upholsteryAttached remote controls: intensity, heating, and (5) modesHeat and vibration targets: upper back, lower back, thighs, and feetIncludes: (2) built-in cup holders and (4) storage side pocketsWeight Capacity: 250 lbs.DIMENSIONS: Overall Dimensions: 33&rdquo;(L) x 30&rdquo;(W) x 42&rdquo;(H)Weight Capacity: 250 lbs.Weight: 92.5 lbs. SPECIFICATIONS: Color: BrownMaterial: PU Leather, SteelSome assembly required (with instructions)",
      "longdescription": "Best Choice Products is proud to present this brand new Leather Massage Chair. This chair is designed to bring you relaxation after a tiring day. It is made out of PU Leather giving it an elegant look that will blend in any room. It has an armrests on both sides, 4 pockets to store away items, a cup holder on each side, and a leg rest that folds out to provide rest. To provide additional comfort, the chair does recline back giving one the ability to fully relax in comfort. The best part of this chair is its amazing massage feature. Simple plug the chair to an outlet and feel the soothing pleasure of a full body massage. There are different vibrators that specifically target the upper-back, lower-back, thighs, and legs. A remote is attached to the couch so you can change the intensity from high to low, and also activate the heater on the chair that warms your back and thighs. The controller also allows you to change between 5 different modes to experience different types of massages and target specific areas. NEW PRODUCT WITH FACTORY PACKAGINGMassage recliner is constructed of padded PU leather and a steel, interior frameAttached controller manages massage intensity, heating, and the 5 different modesHeat and vibration mechanism targets the upper back, lower back, thighs, and feetEasily recline the chair and release the built-in foot rest, while the ball-bearing base features a smooth 360 swivelChair features 4 storage pockets and 2 cup holders on each armrest; Dimensions: 33&rdquo;(L) x 30&rdquo;(W) x 42&rdquo;(H)SPECIFICATIONS: Product Dimensions: 33&rdquo;(L) x 30&rdquo;(W) x 42&rdquo;(H) Weight: 92.5 lbs Shipping Weight: PLEASE NOTE:Our digital images are as accurate as possible. However, different monitors may cause colors to vary slightly.Some of our items are handcrafted and/or hand finished. Color can vary and slight imperfections in the metal work are normal and considered evidence of the hand-finishing process, which adds character and authenticity to those items.",
      "thumbnailimage": "https://i5.walmartimages.com/asr/01124995-8dc2-4068-97af-32e13ae9108b_1.f2173ba81edb54429e9b74d2be6f7d65.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF",
      "mediumimage": "https://i5.walmartimages.com/asr/01124995-8dc2-4068-97af-32e13ae9108b_1.f2173ba81edb54429e9b74d2be6f7d65.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "largeimage": "https://i5.walmartimages.com/asr/01124995-8dc2-4068-97af-32e13ae9108b_1.f2173ba81edb54429e9b74d2be6f7d65.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    },
    {
      "itemid": 40703539,
      "parentitemid": 40703539,
      "name": "1.7 cu ft Refrigerator with Camouflage-Wrapped Door",
      "msrp": 282,
      "saleprice": 173.99,
      "upc": "079841017997",
      "categorypath": "Home/Appliances/Refrigerators/Mini Fridges",
      "shortdescription": "This 1.7 cu ft refrigerator conveniently has an auto-defrost function and is Ideal for use in RVs, boats, camper and anywhere else that has 115-volt AC or 12-volt DC power available. It is lightweight and portable, which allows for quick and easy transport. Features include full-range temperature control, a soft interior light with an on/off switch, adjustable and removable shelving and a reversible door. The tall-bottle rack, located on the camouflage-wrapped door of this 1.7 cu ft refrigerator, accommodates a 2-liter bottle. This compact unit is for freestanding installation only, as proper ventilation is required to maintain satisfactory cooling and overall performance.",
      "longdescription": "&quot; 1.7 cu ft Refrigerator with Camouflage-Wrapped Door:1.7 cu ft compact auto-defrost refrigeratorAuto-defrost refrigerator with camouflage-wrapped door for use in RVs, boats, campers and moreUses 115V AC or 12V DC powerLightweight and portableFull-range temperature controlSoft interior light with on/off switchAdjustable/removable shelvingReversible doorTall-bottle rack on door accommodates a 2-liter bottle12V adapter includedFreestanding installation only; proper ventilation is required to maintain satisfactory cooling and overall performanceDimensions: 17&quot;&quot;W x 19&quot;&quot;D x 20&quot;&quot;HPortable refrigerator has a one-year warrantyModel# SHP1799CADIS&quot;",
      "thumbnailimage": "https://i5.walmartimages.com/asr/08e53d80-d7b7-4bb9-acff-d447036aa97c_1.d76615f1ad0aa29b3c933899b594d6bf.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF",
      "mediumimage": "https://i5.walmartimages.com/asr/08e53d80-d7b7-4bb9-acff-d447036aa97c_1.d76615f1ad0aa29b3c933899b594d6bf.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "largeimage": "https://i5.walmartimages.com/asr/08e53d80-d7b7-4bb9-acff-d447036aa97c_1.d76615f1ad0aa29b3c933899b594d6bf.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    },
    {
      "itemid": 11111111,
      "parentitemid": 11111111,
      "name": "Pabst Blue Ribbon Beer (6 pack)",
      "msrp": 12.46,
      "saleprice": 6.99,
      "upc": "022100000711",
      "categorypath": "Food/Beverages/Beer, Wine & Spirits/Beer",
      "shortdescription": "Well balanced between malt and bitter with a noble hop flavor and aroma",
      "longdescription": "Pabst Blue Ribbon is brewed in the finest traditions of an American Premium Lager dating back to 1844. Brewed with a combination of 2 & 6-row malted barley, select cereal grains and American and European hops, Pabst Blue Ribbon is fermented with a proprietary lager yeast. Our unique fermentation and maturation process results in a smooth, full bodied beer with a clean, crisp finish with a fine noble hop aroma.",
      "thumbnailimage": "https://i5.walmartimages.com/asr/b1ada15a-b8db-4b78-bc04-4f48af6da156_1.b3a099d5d7f075a530d1358965570a43.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "mediumimage": "https://i5.walmartimages.com/asr/08e53d80-d7b7-4bb9-acff-d447036aa97c_1.d76615f1ad0aa29b3c933899b594d6bf.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF",
      "largeimage": "https://i5.walmartimages.com/asr/b1ada15a-b8db-4b78-bc04-4f48af6da156_1.b3a099d5d7f075a530d1358965570a43.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    }    
  ];

  var getOrderItems = function (){
    return orderitems;
  }

  var setOrderItems = function (orderItems) {
    orderitems = orderItems
  }

  var getOrderItemsSent = function (){
    return orderitemssent;
  }
  var getItem = function(itemid){
    return item[id]
  }

  return {
    getOrderItemsSent: getOrderItemsSent,
    getOrderItems : getOrderItems,
    setOrderItems : setOrderItems
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'Hey - are you using the forklift right now? I need to grab a large regrigerator',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'ALL - I\'m in the back unloading a semi in Bay 3',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'Don\'t forget the safety meeting in 15 minutes!',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Somebody brought donuts \'Woo-Hoo!\'',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'I\'m so happy we are using Red Hat AMQ and FUSE Ignite on this app.\nIt has improved our producitivy 10-fold!',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
