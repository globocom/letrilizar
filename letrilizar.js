
var Letrilizar = {
    el: $('.letrilizar'),
    letrilizar: function() {
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
        
        var subtitle1 = 'Pollo - Vagalumes (part. Ivo Mozart)';
        var subtitle2 = 'MUSICA.COM.BR';
        
        this.style.draw(canvas[0], this.text, subtitle1, subtitle2);
        this.canvas = canvas;
    },
    download: function() {
        window.open(this.canvas[0].toDataURL('image/png'));
    },
    share: function() {
        var that = this;
        this.changeStatus('Estamos postamos a foto no seu facebook...');
        
        LetrilizarFacebookShare.share({
            canvas: this.canvas[0], 
            message: '',
            successCallback: function() {
                that.changeStatus('Sua foto foi postada. É só curtir!');
            },
            errorCallback: function() {
                that.changeStatus('Ops... ocorreu um erro');
            }
        });
    },
    hide: function() {
        this.togglePreview(false);
        this.el.fadeOut();
    }
}

