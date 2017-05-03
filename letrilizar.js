var Letrilizar = {
    defaultOptions: {
        el: $('.letrilizar'),
        sharingText: 'Estamos postando a foto no seu facebook...',
        successText: 'Sua foto foi postada. É só curtir!',
        errorText: 'Ops... ocorreu um erro ao postar a foto',
        subtitle1: 'Letrilizar',
        subtitle2: 'GLOBOCOM.GITHUB.IO/LETRILIZAR/',
        imageSrcPrefix: 'images/',
        formatText: true,
        maxChars: 800,
        triggerOn: 'selection'
    },
    letrilizar: function(options) {
        this.options = $.extend({}, this.defaultOptions, options);
        this.el = this.options.el;
        this.el.addClass('letrilizar-letrilization-area');
        this.initialize();
    },
    initialize: function() {
        var that = this;
        if (this.options.triggerOn == 'selection') {
            this.handleSelection();
        } else {
            $(this.options.triggerOn).on('click', function(e) {
                that.newCanvasOnElement();
                return false;
            });

        }
    },
    newCanvasOnElement: function() {
        var txtGenerated = $('#generated-text').val();
        var element = $('.letrilizar-canvas-content-image');

        ActionBaloon.initialize(element);
        ActionBaloon.text = txtGenerated;
        ActionBaloon.draw(txtGenerated);
        ActionBaloon.togglePreview();
    },
    styleChooser: function() {
        var that = this;
        var styles = LetrilizarStyles;

        var stylesContent = '';

        for (s in LetrilizarStyles) {
            stylesContent += `<button type="button" class="btn btn-default" data-index="${s}">${LetrilizarStyles[s].name}</button>`;
        }

        $('#change-style-button').append(stylesContent).find('button').on('click', e => {
            ActionBaloon.hide();
            ActionBaloon.chooseStyle($(e.target).attr('data-index'));
            that.newCanvasOnElement();
            ActionBaloon.show();
            return false;
        });
    },
    handleSelection: function() {
        var that = this;
        ActionBaloon.initialize(this.el);
        LetrilizarFacebookShare.initialize();

        this.el.on('mouseup', function(e) {
            if (ActionBaloon.previewIsOpen()) {
                ActionBaloon.hide();
                return;
            }

            var selection = LetrilizarUtils.getSelection(that.options);
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
        ActionBaloon.floatAt(offset);
    }
};


var ActionBaloon = {
    el: $('#letrilizar-template-action-ballon'),
    text: null,
    style: null,
    initialize: function(parentEl) {
        var that = this;

        parentEl.parent().empty().append(ActionBaloon.el.html());

        this.el = $('.letrilizar-action-ballon');

        this.el.find('.letrilizar-buttons').on('click', () => {
            if (!that.previewIsOpen()) {
                that.onShareButtonClick();
            }
        });

        this.el.find('.letrilizar-download-button').on('click', () => {
            that.download();
        });

        this.changeStyle();
        this.el.find('.letrilizar-change-button').on('click', () => {
            that.changeStyle().draw();
        });

        this.el.find('.letrilizar-share-button').on('click', () => {
            that.onShareButtonClick();
        });

        this.el.find('.letrilizar-close-button').on('click', () => {
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
        this.el.css(offset).css('display', 'block').addClass('letrilizar-action-ballon--showing');
        setTimeout(function() {
            that.el.removeClass('letrilizar-action-ballon--showing');
        }, 500);
        return this;
    },
    togglePreview: function(toggle) {

        if (Letrilizar.options['triggerOn'] == 'selection') {
            this.el.toggleClass('letrilizar--active-balloon', toggle);
        } else {
            this.el.toggleClass('letrilizar--active', toggle);
        }

        this.draw();
    },
    previewIsOpen: function() {
        return this.el.is('.letrilizar--active');
    },
    changeStyle: function() {
        this.style = LetrilizarUtils.randomItemFrom(LetrilizarStyles, this.style);
        return this;
    },
    chooseStyle: function(index) {
        this.style = LetrilizarStyles[index];
        return this;
    },
    changeStatus: function(text) {
        this.el.addClass('letrilizar--sharing');
        this.el.find('.letrilizar-status').html(text);
    },
    draw: function(text) {
        var canvas = this.el.find('canvas');
        var subtitle1 = Letrilizar.options['subtitle1'];
        var subtitle2 = Letrilizar.options['subtitle2'];
        canvasText = text || this.text;

        if (Letrilizar.options['triggerOn'] == 'selection') {
            this.el.css('display', 'block').addClass('letrilizar-action-ballon--showing');
        } else {
            this.el.css('display', 'block').addClass('letrilizar-action-ballon--showing--all');
        }
        this.style.draw(canvas[0], canvasText, subtitle1, subtitle2);
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
    },
    show: function() {
        this.togglePreview(true);
        this.el.fadeIn();
    }
}