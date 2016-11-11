var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        // only for local testing
        if(typeof Media === 'undefined') {
            this.onDeviceReady();
        }
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
        document.getElementById('start-record').addEventListener("click", recorder.recordAudio);
        document.getElementById('stop-record').addEventListener("click", recorder.stopRecordAudio);
        document.getElementById('start-play').addEventListener("click", recorder.playAudio);
        document.getElementById('start-upload').addEventListener("click", recorder.prepareFileToUpload);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};


var recorder = {
    mediaRec: null,
    timeout: null,
//    mediasrc: "cdvfile://localhost/persistent/myrecording.amr",
    mediasrc: "/storage/emulated/0/myrecording.amr",
    recordAudio: function() {
        if(typeof Media !== 'undefined') {
            self.mediaRec = new Media(recorder.mediasrc,
                // success callback 
                function() {
                    console.log("recordAudio():Audio Success");
                },

                // error callback 
                function(err) {
                    console.log("recordAudio():Audio Error: "+ err.code);
                });

            // Record audio 
            self.mediaRec.startRecord();
        }
        
        console.log("recordAudio()");
        document.getElementById('timer').innerHTML = 0;
        recorder.timeout = setInterval(recorder.updateTimer, 1000);
    },
    stopRecordAudio: function() {
        if(typeof Media !== 'undefined') {
            self.mediaRec.stopRecord();
        }
        console.log("stopRecordAudio()");
        clearInterval(recorder.timeout);
    },
    updateTimer: function() {
        var time = document.getElementById('timer').innerHTML;
        time = time.length ? parseInt(time) + 1 : 1;
        document.getElementById('timer').innerHTML = time;
    },
    playAudio: function() {
        if(typeof Media !== 'undefined') {
            // Play the audio file at url 
            self.mediaRec = new Media(recorder.mediasrc,
                // success callback 
                function () {
                    console.log("playAudio():Audio Success");
                },
                // error callback 
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                }
            );
        }
        
        console.log("playAudio()");
        self.mediaRec.play();
    },

    prepareFileToUpload: function() {
        console.log('prepareFileToUpload');
        
//        window.resolveLocalFileSystemURL('file://myrecording.amr', function(entry) {
//            console.log('cdvfile URI: ' + entry.toInternalURL());
//            cdvfile://localhost/persistent/myrecording.amr
//        });
//        return true;
        
        
        
        errorHandler = function(e) { console.log('onErrorLoadFs. Code: ' + e.code); };
        onInitFs = function (fs) {
            fs.root.getFile('myrecording.amr', {}, function(fileEntry) {
                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function(file) {
                   var reader = new FileReader();
                   reader.onloadend = function(e) {
                       console.log(this.result);
    //                 var txtArea = document.createElement('textarea');
    //                 txtArea.value = this.result;
    //                 document.body.appendChild(txtArea);
                   };
                   reader.readAsBinaryString(file);
                }, errorHandler);

            }, errorHandler);            
            
            
            
//            console.log('file system open: ' + fs.name);
//            var fileName = "myrecording.amr";
//            var dirEntry = fs.root;
//            dirEntry.getFile(fileName, { create: false, exclusive: false }, function (fileEntry) {
//                fileEntry.getMetadata(function(result) {
//                    console.log(JSON.stringify(result));
//                });
//                recorder.uploadFile(fileEntry);
//            }, function() { console.log('onErrorCreateFile'); });
        };
        window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, onInitFs, errorHandler);
    },
    writeFile: function(fileEntry, dataObj) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function () {
                console.log("Successful file write...");
                recorder.uploadFile(fileEntry);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            if (!dataObj) {
              dataObj = new Blob(['file data to upload'], { type: 'audio/amr' });
            }

            fileWriter.write(dataObj);
        });
    },
    uploadFile: function(fileEntry) {
        console.log("uploadFile()");
        if(typeof FileTransfer !== 'undefined') {
            var fileURL = fileEntry.toURL();
//            var fileURL = recorder.mediasrc;
//            var fileURL = "///storage/emulated/0/myrecording.amr";
            var options = new FileUploadOptions();
            options.fileKey = "file";
//            options.fileName = "recordforupload.amr";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.httpMethod = "POST";
            options.mimeType = "audio/amr";
//            options.params = [{"name": "test", "nick": "Havabunga"}];
            var params = {};
            params.value1 = "test";
            params.value2 = "param";
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(fileURL, encodeURI("http://webmore.top/upload.php"), 
                function (result) {
                    console.log(JSON.stringify(result));
                },
                function (error) {
                    console.log(JSON.stringify(error));
                }, options);
        }
    },
};