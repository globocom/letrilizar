
var Letrilizar = {
    el: $('.letrilizar'),
    letrilizar: function() {
        var that = this;
        ActionBaloon.initialize(this.el);
        LetrilizarSelectionWrapper.initialize(this.el);
        
        this.el.on('keydown', function(e) {
            that.onUnselect(e);
        });
        
        this.el.on('mouseup', function(e) {
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
        ActionBaloon.floatAt(offset);
    },
    onUnselect: function(e) {
        ActionBaloon.remove();
    }
};


var ActionBaloon = {
    el: $('#letrilizar-template-action-ballon'),
    initialize: function(parentEl) {
        parentEl.parent().append(ActionBaloon.el.html());
        this.el = $('.letrilizar-action-ballon');
    },
    floatAt: function(offset) {
        this.el.css(offset).fadeIn();
    },
    remove: function() {
        this.el.fadeOut();
    }
}

Letrilizar.letrilizar();
