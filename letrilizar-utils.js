
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
                       
        if(canvasTextHeight > 200) {
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

