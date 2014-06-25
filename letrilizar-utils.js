var LetrilizarUtils = {
    nl2br: function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    randomItemFrom: function(items, previous) {
        var rollDice = function() {
            return items[Math.floor(Math.random()*items.length)];
        };
        
        var randomItem = rollDice();
        while (randomItem == previous) { randomItem = rollDice(); };
        return randomItem;
    },
    getSelection: function(options) { 
        var selection = document.getSelection();
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        var text = range.toString();
        
        return $.extend({}, rect , {
            text: text,
            formatedText: this.formatText(selection, options)
        });
    },
    formatText: function(selection, options) {
        var text = $.trim(selection.toString());
        if (!options.formatText) {
            return text;
        }
        
        var lines = text.split('\n');
        var formatedText = '';
        
        for(i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line == '') { continue; }
            
            var lastChar;
            
            if (formatedText != '') { 
                lastChar = formatedText.slice(-1); 
            }
            
            if (lastChar && !lastChar.match(/\!|\?|\.|\,/)) { 
                formatedText += '; ';
            } else {
                formatedText += ' ';
            }
            
            formatedText += line[0].toUpperCase() + line.substring(1, line.length);
        }
        
        if (formatedText.length > options.maxChars) {
            formatedText = formatedText.slice(0, options.maxChars - 10) + ' (...)';
        };
        
        return formatedText;
    },
    getTextHeight: function(ct) {
        var width = 450;
        var height = 300;
        var data = ct.getImageData(0,0,width,height).data,
        first = false, 
        last = false,
        r = height,
        c = 0;
        // Find the last line with a non-white pixel
        while(!last && r) {
            r--;
            for(c = 0; c < width; c++) {
                if(data[r * width * 4 + c * 4 + 3]) {
                    last = r;
                    break;
                }
            }
        }
        
        // Find the first line with a non-white pixel
        while(r) {
            r--;
            for(c = 0; c < width; c++) {
                if(data[r * width * 4 + c * 4 + 3]) {
                    first = r;
                    break;
                }
            }
            var height = 0;
            // If we've got it then return the height
            if(first != r){
                height =  last - first;  
            }
        }
        return height;
        
    },
    autoFontSize: function(CT, canvasTextHeight, style) {
        var definedClass = style;
        
        CT.defineClass("smaller",$.extend({}, CT.getClass(style), 
                                          {fontSize: "16px"}));
        
        if(canvasTextHeight > 210) {
            definedClass = 'smaller';
            CT.config({
                lineHeight: "24px",
            });
        }
        return definedClass;
    },
    fitText: function(CT, canvas, text, x, y, boxWidth, style) {
        
        CT.drawText({
            text: '<class="text1">' + text + '</class>',
            x: x,
            y: y,
            boxWidth: boxWidth
        });
        
        var canvasTextHeight = LetrilizarUtils.getTextHeight(CT.context);
        
        var definedClass = LetrilizarUtils.autoFontSize(CT, canvasTextHeight, style);
        return definedClass;
    }
};

