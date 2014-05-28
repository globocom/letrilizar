


var LetrilizarStyles = LetrilizarStyles || [];

(function() {
    
    var getCT = function(canvas, context) {
        var CT = new CanvasText;
        
        CT.config({
            canvas: canvas,
            context: context,
            lineHeight: "40"
        });
        
        CT.defineClass("quote1",{
            fontFamily: "Montserrat",
            fontSize: "100px",
            fontWeight: "bold",
            fontColor: "#e1180e"
        });

        CT.defineClass("text1",{
            fontFamily: "Montserrat",
            fontSize: "26px",
            fontWeight: "bold",
            fontColor: "#e1180e"
        });
        
        CT.defineClass("subtitle1",{
            fontFamily: "Montserrat",
            fontSize: "13px",
            fontWeight: "light",
            fontColor: "#999"
        });
        
        CT.defineClass("subtitle2",{
            fontFamily: "Montserrat",
            fontSize: "13px",
            fontWeight: "bold",
            fontColor: "#666"
        });
        
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
        name: 'default',
        backgroundColor: '#fff',
        draw: function(canvas, text) {
            var context = canvas.getContext("2d");
            var CT = getCT(canvas, context); 
            
            var subtitle1 = 'Pollo - Vagalumes (part. Ivo Mozart)';
            var subtitle2 = 'MUSICA.COM.BR';

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
    
})();