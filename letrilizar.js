
var Letrilizar = {
    el: $('.letrilizar'),
    initialize: function() {
        var that = this;
        this.el.on('mouseup', function(e) {
            var selection = LetrilizarSelectionWrapper.initialize(that.el)
                                                       .getSelection(e);
            
            if (selection) {
                that.onSelect(e, selection);
            } else {
                that.onUnselect(e);
            }
        });
        
        return this;
    },
    onSelect: function(e, selection) {
        this.onUnselect();
        $(this.el).append(ActionBaloon.el);
        
        var offset = selection.offset();
        offset.top = offset.top - ActionBaloon.el.height() - 20;
        ActionBaloon.floatAt(offset);
    },
    onUnselect: function(e) {
        //ActionBaloon.removeAll();
    }
};


var ActionBaloon = {
    el: $('.letrilizar-action-ballon'),
    floatAt: function(offset) {
        this.el.css(offset);
    },
    removeAll: function() {
        this.el.remove();
    }
}

Letrilizar.initialize();

