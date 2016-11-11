var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        // only for local testing
        if(typeof Media === 'undefined') {
            this.onDeviceReady();
        }
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        document.getElementById('start-record').addEventListener("click", recorder.recordAudio);
        document.getElementById('stop-record').addEventListener("click", recorder.stopRecordAudio);
        document.getElementById('start-play').addEventListener("click", recorder.playAudio);
        document.getElementById('start-upload').addEventListener("click", recorder.uploadFile);
    }
};


var recorder = {
    mediaRec: null,
    timeout: null,
    mediasrc: "myrecording.amr",
    fileEntry: null,
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
                    console.log("playAudio():Audio Error: ", JSON.stringify(err));
                }
            );
        }
        
        console.log("playAudio()");
        self.mediaRec.play();
    },
    uploadFile: function(fileEntry) {
        console.log("uploadFile()");
        if(typeof FileTransfer !== 'undefined') {
            var fileURL = "file:///storage/emulated/0/" + recorder.mediasrc;
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = "recordforupload.amr";
            options.httpMethod = "POST";
            options.mimeType = "audio/amr";
            options.chunkedMode = false;
            options.params = {"name": "test", "nick": "Havabunga"};

            var ft = new FileTransfer();
            ft.upload(fileURL, encodeURI("http://webmore.top/upload.php"), 
                function (result) {
                    alert('Response code: ' + result.responseCode + '\n\Bytes sent: ' + result.bytesSent);
                    console.log(JSON.stringify(result));
                },
                function (error) {
                    alert('Error code: ' + error.code);
                    console.log(JSON.stringify(error));
                }, options);
        }
    },
};