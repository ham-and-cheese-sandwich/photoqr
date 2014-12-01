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
		 
		var picbtn = document.getElementById("takePicture");
        	picbtn.addEventListener("click",function(){
            app.takeDatPicYo();    
        },true);
		
		var uploadbtn = document.getElementById("uploadPicture");
        	uploadbtn.addEventListener("click",function(){
            app.uploadDatPicYo(); 
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
        }
	 },
	 
	 goToMainPage: function () {
        var hidden = document.getElementById("addingNew");
        var shown = document.getElementById("menu");
        hidden.className = "hidden";
        shown.className = "";
    },
	
    takeDatPicYo: function(){
		
         navigator.camera.getPicture(function(imageURI) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageURI;
             
            localImage = imageURI;
             
			var hidden = document.getElementById("menu");
        	var shown = document.getElementById("addingNew");
       		hidden.className = "hidden";
        	shown.className = "";
             //document.getElementById('takePicture').innerHTML = "Hell's no, take another pic yo!"
        }, function(message) {
            alert('Failed because: ' + message);
        }, { destinationType: Camera.DestinationType.DATA_URL, 
            targetWidth: 200,
            targetHeight: 200 });
    },
		   
    uploadDatPicYo: function(){
        
        /* Lets build a FormData object*/
        var fd = new FormData(); 
        fd.append("image", localImage); // Append the file
        var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
        xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
        xhr.onload = function() {
        // Big win!    
            var link = JSON.parse(xhr.responseText).data.link;
        //document.querySelector("#link").href = link;
            console.log(link);

            document.body.className = "uploaded";
        }
        // Ok, I don't handle the errors. An exercice for the reader.
        xhr.setRequestHeader('Authorization', 'Client-ID d0ab2f5655610b2');
        /* And now, we send the formdata */
        xhr.send(fd);
        
    }
    
};

app.initialize();



