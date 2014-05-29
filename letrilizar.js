
var Letrilizar = {
    el: $('.letrilizar'),
    letrilizar: function() {
        var that = this;
        ActionBaloon.initialize(this.el);
        LetrilizarSelectionWrapper.initialize(this.el);
        
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
    },
};


var ActionBaloon = {
    el: $('#letrilizar-template-action-ballon'),
    text: null,
    initialize: function(parentEl) {
        var that = this;
        parentEl.parent().append(ActionBaloon.el.html());
        this.el = $('.letrilizar-action-ballon');
        
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
        this.el.css(offset).fadeIn();
        return this;
    },
    togglePreview: function(toggle) {
        this.el.toggleClass('letrilizar--active',toggle);
        this.draw();
    },
    previewIsOpen: function() {
        return this.el.is('.letrilizar--active');
    },
    share: function() {
        //not yet!
    },
    draw: function() {
        var canvas = this.el.find('canvas');
        var context = canvas[0].getContext('2d');
        context.clearRect (0, 0, canvas[0].width, canvas[0].height);
        
        if (!this.text) {return;}
        var style = LetrilizarStyles[0];
        
        canvas.css({'background-color': style.backgroundColor});
        style.draw(canvas[0], this.text);
    },
    hide: function() {
        this.togglePreview(false);
        this.el.fadeOut();
    }
}

Letrilizar.letrilizar();
