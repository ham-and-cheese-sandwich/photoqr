/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var localImage = "";
//Pages//
var menu = document.getElementById("menu");
var addingNew = document.getElementById("addingNew");
var photoAlbum = document.getElementById("photoAlbum");
var showPicture = document.getElementById("showPicture");
var picHistory = document.getElementById("picHistory");

var counter = 0;

var app = {
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.setUpButtonListeners(); 
		    
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    },

	setUpButtonListeners: function () {
		 console.log("set up button listeners");
		var picbtn = document.getElementById("takePicture");
        	picbtn.addEventListener("click",function(){
            app.takeDatPicYo();    
        },true);
		
		var uploadbtn = document.getElementById("uploadPicture");
        	uploadbtn.addEventListener("click", app.uploadPic,true);
			
		var albumbtn = document.getElementById("albumPicture");
        	albumbtn.addEventListener("click",function(){
            app.goToAlbum(); 
			},true);	
								
		var picAgainbtn = document.getElementById("takePictureAgain");
        	picAgainbtn.addEventListener("click",function(){
            app.takeDatPicYo();
			},true);
			
        var buttonBack = document.getElementsByClassName("back");
        for (var i = 0; i < buttonBack.length; i++) {
            buttonBack[i].addEventListener("click", function () {
                app.goToMainPage();
            }, true);
            
        var decodebtn = document.getElementById("getPicture");
        decodebtn.addEventListener("click", app.decodeQR,true);
		
		var historybtn = document.getElementById("prevPicture");
        historybtn.addEventListener("click",function(){
            app.goToHistory();
			console.log("click");
        },true);
		
        }
	 },
	 
    uploadPic: function()
    {
        app.uploadDatPicYo(); 
    },
    
    decodeQR: function() {
            app.picThisQr();
            console.log("decode click");
    },
    goToMainPage: function () {		
		menu.className = "";
		addingNew.className = "hidden";
		photoAlbum.className = "hidden";
		picHistory.className = "hidden";
    },
	
	goToAlbum: function(){
        menu.className = "hidden";
		addingNew.className = "hidden";
		photoAlbum.className = "";
		picHistory.classList = "hidden";
        app.displayPictureAlbum();
        
        console.log("click");
    },
	
	goToHistory: function () {		
		menu.className = "hidden";
		addingNew.className = "hidden";
		photoAlbum.className = "hidden";
		picHistory.className = "";
    },
	
    takeDatPicYo: function(){
		
         navigator.camera.getPicture(function(imageURI) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageURI;
             
            localImage = imageURI;
             
			menu.className = "hidden";
			addingNew.className = "";
			photoAlbum.className = "hidden";
             //document.getElementById('takePicture').innerHTML = "Hell's no, take another pic yo!"
        }, function(message) {
        }, { destinationType: Camera.DestinationType.DATA_URL, 
            targetWidth: 500,
            targetHeight: 500,
            correctOrientation:true});
    },
		   
    uploadDatPicYo: function(){
        
        
        if(app.checkConnection() != "None"){
            /* Lets build a FormData object*/
            var fd = new FormData(); 
            fd.append("image", localImage); // Append the file
            var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
            xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
            xhr.onload = function() {
                var response = xhr.responseText;
                console.log(response);
                var test = JSON.parse(response);
                console.log(test);

                var link = test.data.link;

            // Big win!  
            //document.querySelector("#link").href = link;
                app.qrThisPic(link);

                document.body.className = "uploaded";
            }
            // Ok, I don't handle the errors. An exercice for the reader.
            xhr.setRequestHeader('Authorization', 'Client-ID d0ab2f5655610b2');
            /* And now, we send the formdata */
            xhr.send(fd);
        }else{
            alert("No network connection, an internet connection is required");
        }
        
    },
    
    qrThisPic: function(imgUrl){
        //Encodes
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, imgUrl, function(success)          {
            //On successful Encoding, it will display it to share.
            alert("encoding success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );
        
    },
    
    picThisQr: function(){
                console.log("beginning of picThisQR");

        counter++;
        
        console.log(counter);
        
        if(app.checkConnection() != "None"){
        
            cordova.plugins.barcodeScanner.scan(
              function (result) {

                  //These get the link's details
                  //Splits via '.', seperating the main domain's link, and final extension
                  var resultChecker = result.text.split(".");
                  //pop gets the final extension to determine the image type.
                  var imageType = resultChecker.pop();
                  //pop again to get the file name
                  var fileName = resultChecker.pop();
                  // get rid of the '/'
                  fileName = fileName.split("/");
                  fileName = fileName[1];
                  //alert(fileName);
                  //alert(resultChecker3);
                  if (imageType == "jpg"){
                      //alert("Downloading " + result.text +"!");
                      var image = document.getElementById('myImage');
                      image.src = result.text;
                      trans = new FileTransfer();
                      var path = cordova.file.externalDataDirectory+fileName+".jpg";
                      //alert("Data Directory: " +cordova.file.dataDirectory);
                      //alert("File Downloading: "+ cordova.file.dataDirectory+fileName+".jpg");
                      trans.download(result.text, path , app.downloadSuccess, app.downloadError);

                      //saves the file paths into local storage, this will help for getting picture item          
                      var saved = localStorage.getItem('saved images', path);
                      if(saved == null)
                      {
                          console.log("local storage is empty");
                          localStorage.setItem('saved images', path);
                      }
                      else
                      {
                          console.log("local storage contains images");
                          var placeholder = saved;
                          localStorage.setItem('saved images', saved+","+path);
                          console.log(localStorage.getItem('saved images'));
                      }

                  }else{
                      alert("Invalid QR Code, must be a jpg");   
                  }
              }, 
              function (error) {
                  alert("Scanning failed: " + error);
              }
           );

        }else{
           alert("No network connection, an internet connection is required");
        }
    
    },
    
    downloadSuccess: function(entry){
        alert("It is downloaded!");  
        
    },
    
    downloadError: function(error){
        alert(error);
    },
    
    displayPictureAlbum: function(){

        //if the local storage with 'saved images' has items in it
        if(localStorage.getItem('saved images') )
        {
            console.log("local storage contains images, populate gallery");
            
            var retrievedImages = localStorage.getItem('saved images');
            var splitText = retrievedImages.split(",");
            
            var string= "";
            var list = document.getElementById("picList");
            for(var i=0; i < splitText.length; i++)
            {
                var li = document.createElement("li");
                var img = document.createElement("img");
                img.src = splitText[i];
                li.appendChild(img);
                list.appendChild(li);
                //console.log(splitText[i]);//thats working
                
                //string += "<li><img src='"+splitText[i]+"'/></li>";
                //on click ---> show larger image, give option to share
            }
            //console.log(string); //displays proper string
            
            //list.innerHTML = string;
   
        }

    },
    
    checkConnection: function(){
     
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'None';

    return(states[networkState]);
        
    }
    
};

app.initialize();



