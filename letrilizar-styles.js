


var LetrilizarStyles = LetrilizarStyles || [];

(function() {
    LetrilizarStyles.push({
        name: 'default',
        backgroundColor: '#fff',
        draw: function(canvas, text) {
            var CT = new CanvasText;
            var context = canvas.getContext("2d");

            CT.config({
                canvas: canvas,
                context: context,
                fontFamily: "Montserrat",
                fontSize: "26px",
                fontWeight: "bold",
                fontColor: "#e1180e",
                lineHeight: "23"
            });

            text = text.replace('\n',"<br />");
            console.log(text);
            
            CT.drawText({
                text: text,
                x: 10,
                y: 75,
                boxWidth: 480 - 10
            });
        }
    });
    
})();