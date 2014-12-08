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
var saveFileImage = "";
var saveFileName = "";
var base64Code = "";
var fileName = "";
var pathForViewing = "";

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
        	uploadbtn.addEventListener("click", function(){
        app.uploadDatPicYo(); 
        },true);
			
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
        }
		
		var buttonBackShow = document.getElementById("backshow");
        	buttonBackShow.addEventListener("click",function(){
            app.goToAlbum(); 
			},true);
            
        var historybtn = document.getElementById("prevPicture");
            historybtn.addEventListener("click", function() {
                app.goToHistory();
        }, true);
        
        var decodebtn = document.getElementById("getPicture");
        decodebtn.addEventListener("click", app.decodeQR,true);
        
	 },
	 
    decodeQR: function() {
            app.picThisQr();
    },
	
    goToMainPage: function () {		
		menu.className = "visible";
		addingNew.className = "hidden";
		photoAlbum.className = "hidden";
		picHistory.className = "hidden";
		showPicture.className = "hidden";
        document.getElementById('loader').style.display = "none";

    },
	
	goToAlbum: function(){
        menu.className = "hidden";
		addingNew.className = "hidden";
		photoAlbum.className = "visible";
		picHistory.classList = "hidden";
		showPicture.className = "hidden";
        app.displayPictureAlbum();
    },
	
	goToHistory: function () {		
        app.displayUploadHistory();
		menu.className = "hidden";
		addingNew.className = "hidden";
		photoAlbum.className = "hidden";
		showPicture.className = "hidden";
		picHistory.className = "visible";
    },
	
    takeDatPicYo: function () {

            navigator.camera.getPicture(function (imageURI) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageURI;

                localImage = imageURI;
                saveFileImage = imageURI;
//"data:image/jpeg;base64,"
                menu.className = "hidden";
				addingNew.className = "visible";
				photoAlbum.className = "hidden";
				showPicture.className = "hidden";
				picHistory.className = "hidden";
            }, function (message) {}, {
                destinationType: Camera.DestinationType.DATA_URL,
                targetWidth: 1500,
                targetHeight: 1500,
                correctOrientation: true,
                saveToPhotoAlbum: true,
                quality: 75
            });
        },
		   
    uploadDatPicYo: function () {


        if (app.checkConnection() != "None") {
            
            document.getElementById('loader').style.display = "block";
            
            /* Lets build a FormData object*/
            var fd = new FormData();
            fd.append("image", localImage); // Append the file
            var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
            xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
            xhr.onload = function () {
                var link = JSON.parse(xhr.responseText).data.link;

                // Big win!  
                //document.querySelector("#link").href = link;
                app.qrThisPic(link);

                var linkHolder = "";
                var placeHolder = "";
                linkHolder = link.split(".");
                placeHolder = linkHolder.pop();
                saveFileName = linkHolder.pop();
                saveFileName = saveFileName.split("/");
                saveFileName = saveFileName[1];
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, app.gotFS, app.failFS);

                document.body.className = "uploaded";

                fileName = saveFileName + ".txt";
                var file = cordova.file.externalDataDirectory + fileName;
                var uploaded = localStorage.getItem('uploaded images');
                if (uploaded == null) {
                    localStorage.setItem('uploaded images', file);
                    console.log(this.result);
                } else {
                    var placeholder = uploaded;
                    localStorage.setItem('uploaded images', uploaded + "," + file);
                }

                }
                // Ok, I don't handle the errors. An exercice for the reader.
                xhr.setRequestHeader('Authorization', 'Client-ID d0ab2f5655610b2');
                /* And now, we send the formdata */
                xhr.send(fd);

            } else {
                alert("No network connection, an internet connection is required");
            }
    },
    
    getImageInfo: function (data) {
       if(localStorage.getItem('uploaded images'))
        {
            var upload = localStorage.getItem('uploaded images');
            var picture = upload.split(",");
            var history = "";
            var LSlength = picture.length;
            var url = [];
            var dataURL = "";
            
            console.log("LS stuff: "+upload);
                             
            var counter = 0;

            for(var p =0; p < picture.length; p++)
            {
                history = picture[p].replace(cordova.file.externalDataDirectory, "");
                
                url[p] = history.replace(".txt", ".jpg");

                data.getFile(history, {}, function (fileEntry) {
                
                    
                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function (file) 
                {
 
                    var list = document.getElementById("historyList");
                              
                    
                    list.innerHTML = "";
                    var reader = new FileReader();

                    reader.onloadend = function (e)
                    {  
                    if(counter < LSlength)
                    {
                    dataURL = 'http://i.imgur.com/'+url[counter];                   
                        
                        
                        base64Code = this.result;

                        var li = document.createElement("li");
                        var img = document.createElement("img");

                        var imgSrc = "data:image/jpeg;base64," + base64Code;

                        img.setAttribute('src',imgSrc );
                        img.setAttribute('data-url', dataURL);
                        
                        counter++;
                        
                        img.addEventListener("click", function(){
                            app.qrThisPic(this.getAttribute('data-url'));
                        });
                        
                        img.addEventListener("mouseup", function(){
                            clearTimeout(pressTimer);
                        });
                        
                        img.addEventListener("mousedown", function(){
                            pressTimer = window.setTimeout(function(){
                           
                                var txt;
                                
                                var r = confirm ("would you like to delete this photo?");
                                if (r == true){
                                    alert("delete the photo");
                                }else{
                                    alert("cancel");
                                }
                           
                           }),1000 
                        });

                        li.appendChild(img);
                        list.appendChild(li);   
                    }

                    };
                    reader.readAsText(file);
            }, app.somethingDied);
        }, app.somethingDiedAgain);
            }
        }
    },
    
      somethingDiedAgain: function(data)
    {
        console.log("you dun goofed");
    },
    
        somethingDied: function(data)
    {
        console.log("you dun goofed");
    },
 somethingBeDead: function(data)
    {
        console.log("you dun goofed");
    },
    
    qrThisPic: function(imgUrl){
        //Encodes
        
        document.getElementById('loader').style.display = "none";
        
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, imgUrl, function(success) {
            //On successful Encoding, it will display it to share.
            alert(success);
            
          }, function(fail) {
            alert(fail);
          }
        );
        
    },
    
    picThisQr: function(){
        
        if(app.checkConnection() != "None"){
        
            cordova.plugins.barcodeScanner.scan(
              function (result) {
                  
                  document.getElementById('loader').style.display = "block";

                  //These get the link's details
                  //Splits via '.', seperating the main domain's link, and final extension
                  var resultChecker = result.text.split(".");
                  //pop gets the final extension to determine the image type.
                  var imageType = resultChecker.pop();
                  //pop again to get the file name
                  var fileName = resultChecker.pop();
                  // get rid of the '/'
                  
                  if(fileName){
                        fileName = fileName.split("/");
                        fileName = fileName[1];    
                  }
                  
                  
                  if (imageType == "jpg"){

                      var image = document.getElementById('myImage');
                      image.src = result.text;
                      trans = new FileTransfer();
                      var path = cordova.file.externalDataDirectory+fileName+".jpg";

                      trans.download(
                          result.text, 
                          path,
                          function(entry) {
                              app.imageScreen(pathForViewing);
                              console.log(entry.toURL());
                              
                              document.getElementById('loader').style.display = "none";
                          }, 
                          function(entry) {
                              alert("There was an error downloading the picture");
                              
                              document.getElementById('loader').style.display = "none";
                          }
                      );

                      //saves the file paths into local storage, this will help for getting picture item          
                      var saved = localStorage.getItem('saved images', path);
                      if(saved == null)
                      {
                          localStorage.setItem('saved images', path);
                      }
                      else
                      {
                          var placeholder = saved;
                          localStorage.setItem('saved images', saved+","+path);
                      }
                      
                      pathForViewing = path;

                  }else{
                      
                      document.getElementById('loader').style.display = "none";
                      
                  }
              }, 
              function (error) {
                  
                  document.getElementById('loader').style.display = "none";
                  
                  alert("Scanning failed: " + error);
              }
           );

        }else{
           alert("No network connection, an internet connection is required");
        }
    
    },
    
    displayPictureAlbum: function(){

        //if the local storage with 'saved images' has items in it
        if(localStorage.getItem('saved images') )
        {
            
            var retrievedImages = localStorage.getItem('saved images');
            var splitText = retrievedImages.split(",");
            
            var string= "";
            var list = document.getElementById("picList");
            list.innerHTML = "";
            for(var i=0; i < splitText.length; i++)
            {
                var li = document.createElement("li");
                li.className = "viewImage"
                var img = document.createElement("img");
                img.src = splitText[i];
                li.appendChild(img);
                list.appendChild(li);             
                
            }
            
            //on click ---> show larger image, give option to share
            var viewImage = document.getElementsByClassName("viewImage");
            for(var i=0;i<viewImage.length;i++){
                
                viewImage[i].addEventListener("click",function(){
                    pathForViewing = this.lastElementChild.src; 
                    app.imageScreen(pathForViewing);
                },true);
                
                viewImage[i].addEventListener("mouseup", function(){
                    clearTimeout(pressTimer);
                });
                        
                viewImage[i].addEventListener("mousedown", function(){
                    pressTimer = window.setTimeout(function(){

                        var txt;

                        var r = confirm ("would you like to delete this photo?");
                        if (r == true){
                            alert("delete the photo");
                        }else{
                            alert("cancel");
                        }

                   }),1000 
                });
                
            }
        }
    },
    
    imageScreen: function(){ 
        menu.className = "hidden";
		addingNew.className = "hidden";
		photoAlbum.className = "hidden";
		showPicture.className = "visible";
		picHistory.className = "hidden";
        
        var frame = document.getElementById('frame');
        frame.innerHTML = "";
        
        var img = document.createElement("img");
        img.src = pathForViewing;
        frame.appendChild(img);
        
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
        
    },
    
    
    gotFS:function(fileSystem){
        console.log("Starting fileSystem.getFile");
        fileSystem.getFile(saveFileName+".txt", {create: true, exclusive: false}, app.gotFSSuccess, app.gotFSFail);
    },
    
    gotFSSuccess:function(fileEntry){
        fileEntry.createWriter(app.createFileWriter, app.createWriterFail);
    },
    
    gotFSFail:function(error){
        console.log("FailFS:"+error);
    },
    
    createFileWriter:function(writer){
        console.log("open and write");
        writer.seek(0);
        writer.write(saveFileImage);
        console.log("close and save");
    },
    
    createWriterFail:function(errpr){
        console.log("FAIL:"+errpr);
    },
    
    displayUploadHistory: function () {

       if (localStorage.getItem('uploaded images')) {
                
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, app.getImageInfo, app.somethingDied);
        }
    },
};

app.initialize();