


var LetrilizarStyles = LetrilizarStyles || [];

(function() {
    LetrilizarStyles.push({
        name: 'default',
        backgroundColor: '#fff',
        draw: function(canvas, text) {
            var CT = new CanvasText;
            var context = canvas.getContext("2d");
            
            var subtitle1 = 'Pollo - Vagalumes (part. Ivo Mozart)';
            var subtitle2 = 'MUSICA.COM.BR';

            CT.config({
                canvas: canvas,
                context: context,
                lineHeight: "40"
            });
                

            CT.defineClass("quote",{
                fontFamily: "Montserrat",
                fontSize: "26px",
                fontWeight: "bold",
                fontColor: "#e1180e"
            });
            
            CT.drawText({
                text: '<class="quote">' + text + '</class>',
                x: 10,
                y: 75,
                boxWidth: 480 - 10
            });
            
            
            CT.defineClass("subtitle1",{
                fontFamily: "Montserrat",
                fontSize: "13px",
                fontWeight: "light",
                fontColor: "#999"
            });
            
            CT.drawText({
                text: '<class="subtitle1">' + subtitle1 + '</class>',
                x: 480 - (0.75 * 13 * (subtitle1.length - 1)),
                y: 270,
                boxWidth: 480
            });

            
            CT.defineClass("subtitle2",{
                fontFamily: "Montserrat",
                fontSize: "13px",
                fontWeight: "bold",
                fontColor: "#666"
            });
            
            CT.drawText({
                text: '<class="subtitle2">' + subtitle2 + '</class>',
                x: 195,
                y: 290,
                boxWidth: 480
            });
            
        }
    });
    
})();