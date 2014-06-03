
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
    getSelectedText: function() { 
        var selection;
        if (window.getSelection) {
            selection = window.getSelection().toString();
        }
        if (document.selection) {
            selection = document.selection.createRange().text;
        }
        
        if (selection) {
            selection = LetrilizarUtils.nl2br(selection, false);
            selection = $.trim(selection);
            return selection;
        }
        return '';
    },
    elementClosestToOffset: function(collection, x, y) {
        var distance = function calculateDistance(elem, mouseX, mouseY) {
            return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
        }
        
        var minDistance = 99999;
        var closestEl = null;
        
        $.each(collection, function(i, el) {
            var $el = $(el);
            var elDistance =  distance($el, x, y);
            
            if (elDistance < minDistance) {
                minDistance = elDistance;
                closestEl = $el;
            }
        });
        
        return closestEl;
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


var LetrilizarSelectionWrapper = {
    el: $('.letrilizar-text-wrapper'),
    initialize: function(containerEl) {
        this.containerEl = containerEl;
        
        this.el.on('click', function(e) {
            ActionBaloon.remove();
        });
        
        return this;
    },
    getSelection: function(mouseEvent) {
        selection = LetrilizarUtils.getSelectedText();
        if (!selection) return;
        
        this.wrapSelectionOcurrences(selection);
        return this.getClosestWrapper(mouseEvent.pageX, mouseEvent.pageY);
    },
    wrapSelectionOcurrences: function(selection) {
        var regEx = new RegExp(selection, 'g');
        var newHtml = $(this.containerEl).html();
        
        newHtml = newHtml.replace(regEx, '<span class="letrilizar-text-wrapper">' + selection + '</span>');
        $(this.containerEl).html(newHtml);
    },
    getClosestWrapper: function(x, y) {
        var wrapper =  LetrilizarUtils.elementClosestToOffset($(this.el.selector), x, y);
        wrapper.addClass('letrilizar-text-wrapper--closest');
        this.destroyElementsOtherThan(wrapper);
        
        return wrapper;
    },
    destroy: function() {
        this.destroyElementsOtherThan(null);
    },
    destroyElementsOtherThan: function(survivorEl) {
        this.el = $(this.el.selector);
        
        this.el.not(survivorEl).each(function(){
            $(this).replaceWith($(this).html());
        });
    }
}



var LetrilizarStyles = LetrilizarStyles || [];

(function() {
    
    var getCT = function(canvas, context) {
        var CT = new CanvasText;
        
        CT.config({
            canvas: canvas,
            context: context,
            lineHeight: "40"
        });

        var text = {
            fontFamily: "Montserrat",
            fontSize: "26px",
            fontWeight: "bold",
            fontColor: "#e1180e"
        };
        
        CT.defineClass("text1", text);
        CT.defineClass("text1-light", $.extend({}, text, 
                       {fontColor: "#fff"}));

        CT.defineClass("classic-text", {
            fontFamily: "Georgia",
            fontSize: "28px",
            fontWeight: "normal",
            fontColor: "#333"
        });
        
        var subtitle1 = {
            fontFamily: "Georgia",
            fontSize: "13px",
            fontWeight: "light",
            fontColor: "#999"
        };
        
        
        CT.defineClass("subtitle1", subtitle1);
        CT.defineClass("subtitle1-light", $.extend({}, subtitle1, 
                       {fontColor: "#fff"}));
        
        var subtitle2 = {
            fontFamily: "Georgia",
            fontSize: "13px",
            fontWeight: "bold",
            fontColor: "#666"   
        }
        
        CT.defineClass("subtitle2",subtitle2);
        CT.defineClass("subtitle2-light", $.extend({}, subtitle2, 
                       {fontColor: "#fff"}));
                       
        return CT;
    };
    
    var putImage = function(context, src, x, y, callback) {
        var image = new Image();
        image.src = src;
        if (!callback) { callback = function() {} };
        image.onload = function(){
            context.drawImage(image, x, y);
            callback();
        }
    };
    
    var setBackgroundColor = function(canvas, context, color) { 
        context.clearRect(0, 0, canvas.width, canvas.height);
        var fillStyle = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = fillStyle ;
    };
    
    LetrilizarStyles.push({
        name: 'quote-1',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 

            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 480, 'text1');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#fff');
            
            CT.drawText({
                text: '<class="quote1">“</class>',
                x: 215,
                y: 0,
            });
            
            CT.drawText({
                text: '<class="' + definedClass + '">' + text + '</class>',
                x: 10,
                y: 100,
                boxWidth: 480 - 10
            });
            
            CT.drawText({
                text: '<class="subtitle1">' + subtitle1 + '</class>',
                x: 480 - (0.75 * 13 * (subtitle1.length - 1)),
                y: 270,
                boxWidth: 480
            });

            CT.drawText({
                text: '<class="subtitle2">' + subtitle2 + '</class>',
                x: 195,
                y: 290,
                boxWidth: 480
            });
            
            putImage(context, 'quote-1.png', 200, 0);
        }
    });
    
    
    LetrilizarStyles.push({
        name: 'quote-blue',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 
            
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 470, 'text1-light');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#4e85ae');
            
            
            CT.drawText({
                text: '<class="' + definedClass + '">' + text + '</class>',
                x: 10,
                y: 100,
                boxWidth: 480 - 10
            });
            
            CT.drawText({
                text: '<class="subtitle1-light">' + subtitle1 + '</class>',
                x: 480 - (0.75 * 13 * (subtitle1.length - 1)),
                        y: 270,
                        boxWidth: 480
            });
            
            CT.drawText({
                text: '<class="subtitle2-light">' + subtitle2 + '</class>',
                x: 195,
                y: 290,
                boxWidth: 480
            });
            
            putImage(context, 'quote-white.png', 225, 22);
        }
    });
   
    LetrilizarStyles.push({
        name: 'classic',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context);
            
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 480, 'classic-text');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#fff');
            
            putImage(context, 'classic-background.png', 0, 0, function(){
                CT.drawText({
                    text: '<class="' + definedClass + '">' + text + '</class>',
                    x: 40,
                    y: 60,
                    boxWidth: 480 - 50
                });
                
                CT.drawText({
                    text: '<class="subtitle2">' + subtitle1 + '</class>',
                    x: 40,
                    y: 280,
                    boxWidth: 480 - 60
                });
                
            });
        }
    });
    
    
})();