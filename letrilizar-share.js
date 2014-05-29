

// https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
var Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  
  /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },
    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));      

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer) {
            uarray = new Uint8Array(arrayBuffer);
        } else {
            uarray = new Uint8Array(bytes);
        }
            
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {  
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));
            
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            
            uarray[i] = chr1;           
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }

        return uarray;  
    }
};
    
    
var LetrilizarFacebookShare = {
    initialize: function() {
        this.patchXmlRequest();
    },
    share: function(options) {
        this.options = options;
        var that = this;
        this.getAccessToken(function(accessToken){ that.facebookPost(accessToken); });
    },
    facebookPost: function(accessToken) {
        var xhr = new XMLHttpRequest();
        var image = this.getCanvasImage();
        
        var boundary = '----ThisIsTheBoundary1234567890';
        xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + accessToken, true);
        xhr.onload = this.finished;
        xhr.onerror = this.error;
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
        xhr.sendAsBinary(this.fakeFileUploadForm(boundary,
                                                    image,
                                                    this.options.message));
    },
    getAccessToken: function(callback) {
        var that = this;
        var callCallback = function() {
            callback(FB.getAccessToken());
        };
        
        if(FB.getAccessToken()) {
            callCallback();
        } else {
            FB.login(function(response) {
                if (response.authResponse) {
                    callCallback();
                } else {
                    that.error();
                }
            }, {scope: 'publish_stream'});
        }
    },
    getCanvasImage: function() {
        var canvas = this.options.canvas;
        var data = canvas.toDataURL('image/png');
        var encodedPng = data.substring(data.indexOf(',')+1,data.length);
        var decodedPng = Base64Binary.decode(encodedPng);
        
        return decodedPng;
    },
    fakeFileUploadForm: function(boundary, imageData, mensagem) {
        var filename = 'musica.png';
        var mimeType = 'image/png';
        
        var formData = '--' + boundary + '\r\n';
        formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
        formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
        for ( var i = 0; i < imageData.length; ++i ) {
            formData += String.fromCharCode( imageData[ i ] & 0xff );
        }
        formData += '\r\n';
        formData += '--' + boundary + '\r\n';
        formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
        formData += mensagem + '\r\n';
        formData += '--' + boundary + '--\r\n';
        
        return formData;
    },
    
    finished: function() {
        console.log('sucesso');
    },
    error: function() {
        console.log('erro');
    },
    patchXmlRequest: function() {
        if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
            XMLHttpRequest.prototype.sendAsBinary = function(string) {
                var bytes = Array.prototype.map.call(string, function(c) {
                    return c.charCodeAt(0) & 0xff;
                });
                this.send(new Uint8Array(bytes).buffer);
            };
        }
    }
};

