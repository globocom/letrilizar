

var LetrilizarStyles = LetrilizarStyles || [];

(function() {
    
    var getCT = function(canvas, context) {
        var CT = new CanvasText;
        
        CT.config({
            canvas: canvas,
            context: context,
            lineHeight: "40"
        });

        var text = {
            fontFamily: "Montserrat",
            fontSize: "26px",
            fontWeight: "bold",
            fontColor: "#e1180e"
        };
        
        CT.defineClass("text1", text);
        CT.defineClass("text1-light", $.extend({}, text, 
                       {fontColor: "#fff"}));

        CT.defineClass("classic-text", {
            fontFamily: "Georgia",
            fontSize: "28px",
            fontWeight: "normal",
            fontColor: "#333"
        });
        
        var subtitle1 = {
            fontFamily: "Georgia",
            fontSize: "13px",
            fontWeight: "light",
            fontColor: "#999"
        };
        
        
        CT.defineClass("subtitle1", subtitle1);
        CT.defineClass("subtitle1-light", $.extend({}, subtitle1, 
                       {fontColor: "#fff"}));
        
        var subtitle2 = {
            fontFamily: "Georgia",
            fontSize: "13px",
            fontWeight: "bold",
            fontColor: "#666"   
        }
        
        CT.defineClass("subtitle2",subtitle2);
        CT.defineClass("subtitle2-light", $.extend({}, subtitle2, 
                       {fontColor: "#fff"}));
                       
        return CT;
    };
    
    var putImage = function(context, src, x, y, callback) {
        var image = new Image();
        image.src = Letrilizar.options.imageSrcPrefix + src;
        if (!callback) { callback = function() {} };
        image.onload = function(){
            context.drawImage(image, x, y);
            callback();
        }
    };
    
    var setBackgroundColor = function(canvas, context, color) { 
        context.clearRect(0, 0, canvas.width, canvas.height);
        var fillStyle = context.fillStyle;
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = fillStyle ;
    };
    
    LetrilizarStyles.push({
        name: 'quote-1',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 

            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 480, 'text1');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#fff');
            
            CT.drawText({
                text: '<class="quote1">“</class>',
                x: 215,
                y: 0,
            });
            
            CT.drawText({
                text: '<class="' + definedClass + '">' + text + '</class>',
                x: 10,
                y: 100,
                boxWidth: 480 - 10
            });
            
            CT.drawText({
                text: '<class="subtitle1">' + subtitle1 + '</class>',
                x: 480 - (0.75 * 13 * (subtitle1.length - 1)),
                y: 270,
                boxWidth: 480
            });

            CT.drawText({
                text: '<class="subtitle2">' + subtitle2 + '</class>',
                x: 195,
                y: 290,
                boxWidth: 480
            });
            
            putImage(context, 'quote-1.png', 200, 0);
        }
    });
    
    
    LetrilizarStyles.push({
        name: 'quote-blue',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 
            
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 470, 'text1-light');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#4e85ae');
            
            
            CT.drawText({
                text: '<class="' + definedClass + '">' + text + '</class>',
                x: 10,
                y: 100,
                boxWidth: 480 - 10
            });
            
            CT.drawText({
                text: '<class="subtitle1-light">' + subtitle1 + '</class>',
                x: 480 - (0.75 * 13 * (subtitle1.length - 1)),
                        y: 270,
                        boxWidth: 480
            });
            
            CT.drawText({
                text: '<class="subtitle2-light">' + subtitle2 + '</class>',
                x: 195,
                y: 290,
                boxWidth: 480
            });
            
            putImage(context, 'quote-white.png', 225, 22);
        }
    });
   
    LetrilizarStyles.push({
        name: 'classic',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context);
            
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            var definedClass = LetrilizarUtils.fitText(CT, canvas, text, 10, 100, 480, 'classic-text');
            CT.context.clearRect(0, 0, canvas.width, canvas.height);
            
            setBackgroundColor(canvas, context, '#fff');
            
            putImage(context, 'classic-background.png', 0, 0, function(){
                CT.drawText({
                    text: '<class="' + definedClass + '">' + text + '</class>',
                    x: 40,
                    y: 60,
                    boxWidth: 480 - 50
                });
                
                CT.drawText({
                    text: '<class="subtitle2">' + subtitle1 + '</class>',
                    x: 40,
                    y: 280,
                    boxWidth: 480 - 60
                });
                
            });
        }
    });
    
    
})();