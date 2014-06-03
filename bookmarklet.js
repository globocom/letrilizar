    var styles=document.createElement('link');
    styles.rel='stylesheet';
    styles.type='text/css';
    styles.media = 'screen';
    styles.href='https://raw.githubusercontent.com/globocom/letrilizar/master/animate.min.css';
    document.getElementsByTagName('head')[0].appendChild(styles);
    
    styles=document.createElement('link');
    styles.rel='stylesheet';
    styles.type='text/css';
    styles.media = 'screen';
    styles.href='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar.css';
    document.getElementsByTagName('head')[0].appendChild(styles);
    
    styles=document.createElement('link');
    styles.rel='stylesheet';
    styles.type='text/css';
    styles.media = 'screen';
    styles.href='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar-icons.css';
    document.getElementsByTagName('head')[0].appendChild(styles);

    var script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/CanvasText-0.4.1.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    
    script=document.createElement('body');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/jquery-1.11.1.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    var html = '<div class="letrilizar-markupholder">';
        html += '<script type="text/template" id="letrilizar-template-action-ballon">';
        html += '<div class="letrilizar-action-ballon">';
        html += '<span class="letrilizar-close-button"></span>';
        html += '<div class="letrilizar-preview">';
        html += '<canvas width="480" height="310"></canvas>';    
        html += '</div>';
        html += '</div>';        
        html += '<div class="letrilizar-buttons">';
        html += '<span class="letrilizar-download-button">download</span>';    
        html += '<span class="letrilizar-change-button">trocar visual</span>';    
        html += '<span class="letrilizar-share-button">Compartilhar</span>';        
        html += '</div>';        
        html += '<div class="letrilizar-status"></div>';        
        html += '</div>';    
        html += '</script>'; 
        
    script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar-utils.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar-share.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar-styles.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    script=document.createElement('script');
    script.type='text/javascript';
    script.src='https://raw.githubusercontent.com/globocom/letrilizar/master/letrilizar.js';
    document.getElementsByTagName('body')[0].appendChild(script);
    
    $('body').append('<div class="letrilizar">Letrilizado</div>');
    $('.letrilizar').append(html);
    