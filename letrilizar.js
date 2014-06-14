var Letrilizar = {
    defaultOptions: {
        el: $('.letrilizar'),
        sharingText: 'Estamos postando a foto no seu facebook...',
        successText: 'Sua foto foi postada. É só curtir!',
        errorText: 'Ops... ocorreu um erro',
        subtitle1: 'Letrilizar',
        subtitle2: 'GLOBOCOM.GITHUB.IO/LETRILIZAR/',
        imageSrcPrefix: 'images/'
    },
    letrilizar: function(options) {
        this.options = $.extend({}, this.defaultOptions, options);
        this.el = this.options.el;
        this.el.addClass('letrilizar-letrilization-area');
        this.initialize();
    },
    initialize: function() {
        var that = this;
        ActionBaloon.initialize(this.el);
        LetrilizarFacebookShare.initialize();
        
        this.el.on('mouseup', function(e) {
            if (ActionBaloon.previewIsOpen()) {
                ActionBaloon.hide();
                return;
            }
            
            var selection = LetrilizarUtils.getSelection();
            if (selection.text) {
                that.onSelect(e, selection);
            } else {
                ActionBaloon.hide();
            }
        });
        
        return this;
    },
    onSelect: function(e, selection) {
        var offset = {};
        var parentOffset = this.el.offset();
        var scrollTop = $(window).scrollTop();
        var scrollLeft = $(window).scrollLeft();
        
        offset.top = selection.top - parentOffset.top + 55;
        offset.left = selection.left - parentOffset.left;
        
        // selection position is relative to screen, so
        // is needed to add scroll displacement
        offset.top += scrollTop;
        offset.left += scrollLeft;
        
        ActionBaloon.text = selection.formatedText;
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
            that.onShareButtonClick();
        });
        
        this.el.find('.letrilizar-close-button').on('click', function() {
            that.hide();
        });
    },
    onShareButtonClick: function() {
        if (this.previewIsOpen()) {
            this.share();
        } else {
            this.togglePreview();
        }
    },
    floatAt: function(offset) {
        var that = this;
        this.el.css(offset).css('display','block').addClass('letrilizar-action-ballon--showing');
        setTimeout(function() { that.el.removeClass('letrilizar-action-ballon--showing'); }, 500);
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