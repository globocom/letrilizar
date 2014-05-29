

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
        
        var subtitle1 = {
            fontFamily: "Montserrat",
            fontSize: "13px",
            fontWeight: "light",
            fontColor: "#999"
        };
        
        CT.defineClass("subtitle1", subtitle1);
        CT.defineClass("subtitle1-light", $.extend({}, subtitle1, 
                       {fontColor: "#fff"}));
        
        var subtitle2 = {
            fontFamily: "Montserrat",
            fontSize: "13px",
            fontWeight: "bold",
            fontColor: "#666"   
        }
        
        CT.defineClass("subtitle2",subtitle2);
        CT.defineClass("subtitle2-light", $.extend({}, subtitle2, 
                       {fontColor: "#fff"}));
        
        return CT;
    };
    
    var putImage = function(context, src, x, y) {
        var image = new Image();
        image.src = src;
        image.onload = function(){
            context.drawImage(image, x, y);
        }
    };
    
    LetrilizarStyles.push({
        name: 'quote-1',
        backgroundColor: '#fff',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 

            CT.drawText({
                text: '<class="quote1">“</class>',
                x: 215,
                y: 0,
            });
            
            CT.drawText({
                text: '<class="text1">' + text + '</class>',
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
        backgroundColor: '#4e85ae',
        draw: function(canvas, text, subtitle1, subtitle2) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 
            
            CT.drawText({
                text: '<class="text1-light">' + text + '</class>',
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
            
            putImage(context, 'quote-white.png', 200, 30);
        }
    });
    
    
})();