
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




var Letrilizar = {
    el: $('#glb-doc'),
    defaultOptions: {
        'sharingText': 'Estamos postando a foto no seu facebook...',
        'successText': 'Sua foto foi postada. É só curtir!',
        'errorText': 'Ops... ocorreu um erro',
        'subtitle1': 'Letrilizar',
        'subtitle2': 'GLOBOCOM.GITHUB.IO/LETRILIZAR/'
    },
    letrilizar: function(options) {
        this.options = $.extend({}, this.defaultOptions, options);
        this.initialize();
    },
    initialize: function() {
        var that = this;
        ActionBaloon.initialize(this.el);
        LetrilizarSelectionWrapper.initialize(this.el);
        LetrilizarFacebookShare.initialize();
        
        this.el.on('mouseup', function(e) {
            if (ActionBaloon.previewIsOpen()) {
                ActionBaloon.hide();
            }
            
            var selection = LetrilizarSelectionWrapper.getSelection(e);
            
            if (selection) {
                that.onSelect(e, selection);
            } 
        });
        
        return this;
    },
    onSelect: function(e, selection) {
        var offset = selection.offset();
        offset.top = offset.top - ActionBaloon.el.height() - 20;
        offset.left = offset.left + (ActionBaloon.el.width() / 2);
        ActionBaloon.text = selection.text();
        ActionBaloon.floatAt(offset)
    }
};


var ActionBaloon = {
    el: $('#letrilizar-template-action-ballon'),
    text: null,
    style: null,
    initialize: function(parentEl) {
        var that = this;
        parentEl.parent().append(ActionBaloon.el.html());
        this.el = $('.letrilizar-action-ballon');
        
        this.el.find('.letrilizar-download-button').on('click', function() {
            that.download();
        });
        
        this.changeStyle();
        this.el.find('.letrilizar-change-button').on('click', function() {
            that.changeStyle().draw();
        });
        
        this.el.find('.letrilizar-share-button').on('click', function() {
            if (that.previewIsOpen()) {
                that.share();
            } else {
                that.togglePreview();
            }
        });
        
        this.el.find('.letrilizar-close-button').on('click', function() {
            that.togglePreview(false);
        });
    },
    floatAt: function(offset) {
        this.el.css(offset).css('display','block').addClass('animated bounceInUp');
        return this;
    },
    togglePreview: function(toggle) {
        this.el.toggleClass('letrilizar--active',toggle);
        this.draw();
    },
    previewIsOpen: function() {
        return this.el.is('.letrilizar--active');
    },
    changeStyle: function() {
        this.style = LetrilizarUtils.randomItemFrom(LetrilizarStyles, this.style);
        return this;
    },
    changeStatus: function(text) {
        this.el.addClass('letrilizar--sharing');
        this.el.find('.letrilizar-status').html(text);
    },
    draw: function() {
        var canvas = this.el.find('canvas');
        if (!this.text) {return;}
        
        var subtitle1 = Letrilizar.options['subtitle1'];
        var subtitle2 = Letrilizar.options['subtitle2'];
        
        this.style.draw(canvas[0], this.text, subtitle1, subtitle2);
        this.canvas = canvas;
    },
    download: function() {
        window.open(this.canvas[0].toDataURL('image/png'));
    },
    share: function() {
        var that = this;
        this.changeStatus(Letrilizar.options['sharingText']);
        
        LetrilizarFacebookShare.share({
            canvas: this.canvas[0], 
            message: '',
            successCallback: function() {
                that.changeStatus(Letrilizar.options['successText']);
            },
            errorCallback: function() {
                that.changeStatus(Letrilizar.options['errorText']);
            }
        });
    },
    hide: function() {
        this.togglePreview(false);
        this.el.fadeOut();
    }
}

$(function(){
    Letrilizar.letrilizar();
});