
var LetrilizarUtils = {
    nl2br: function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    getSelectedText: function() { 
        if (window.getSelection) {
            return window.getSelection().toString();
        }
        if (document.selection) {
            return document.selection.createRange().text;
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
        var selection = $.trim(LetrilizarUtils.getSelectedText());
        selection = LetrilizarUtils.nl2br(selection, false);
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

