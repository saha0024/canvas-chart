var entityArray;

document.addEventListener("DOMContentLoaded", function () {
    //set global vars for canvas and context
    //canvas = document.querySelector("#myCanvas");
    $.ajax({
        url: "http://m.edumedia.ca/saha0024/mad9022/chart/json/cheese.json",
        type: "GET",
        crossDomain: true,
        dataType: "json"
    }).done(ok).fail(darn)

});

function ok(data) {
    entityArray = data;
    pie();
    circles();
};

function pie() {
    //var entityArray = "ok";
    var pieChart = document.querySelector("#pieChart");
    var context = pieChart.getContext("2d");
    if (pieChart) {
        //draw pie chart
        context.clearRect(0, 0, pieChart.width, pieChart.height);
        //set the styles in case others have been set
        //setDefaultStyles(context);
        var cx = (pieChart.width) / 2;
        var cy = (pieChart.height) / 2;
        var radius = 100;
        var currentAngle = 0;
        var totalValue = 0;
        for (var i = 0; i < entityArray.segments.length; i++) {
            totalValue += entityArray.segments[i].value;
        }
        console.log(totalValue);
        for (var i = 0; i < entityArray.segments.length; i++) {

            var pct = entityArray.segments[i].value / totalValue;
            //create colour 0 - 16777216 (2 ^ 24) based on the percentage
            var clr = entityArray.segments[i].color;

            var endAngle = currentAngle + (pct * (Math.PI * 2));
            //draw the arc
            context.moveTo(cx, cy);
            context.beginPath();
            context.fillStyle = clr;
            if (entityArray.segments[i].value == 3.1416) {
                context.arc(cx, cy, radius * 1.1, currentAngle, endAngle, false);
            } else {

                if (entityArray.segments[i].value == 43.9823) {
                    context.arc(cx, cy, radius * 0.9, currentAngle, endAngle, false);
                } else {
                    context.arc(cx, cy, radius, currentAngle, endAngle, false);
                }
            }
            context.lineTo(cx, cy);
            context.fill();

            //Now draw the lines that will point to the values
            context.save();
            context.translate(cx, cy); //make the middle of the circle the (0,0) point
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.beginPath();
            //angle to be used for the lines
            var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
            context.moveTo(0, 0); //this value is to start at the middle of the circle
            //to start further out...
            var dx = Math.cos(midAngle) * (0.8 * radius);
            var dy = Math.sin(midAngle) * (0.8 * radius);
            context.moveTo(dx, dy);
            //ending points for the lines
            var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 30);
            context.lineTo(dx, dy);
            context.stroke();
            //put the canvas back to the original position
            context.font = "bold 16pt Arial";
            context.translate(dx, dy);
            context.rotate(midAngle);
            context.fillText(entityArray.segments[i].label, 15, 10);
            //context.rotate(currentAngle-endAngle);
            context.restore();

            //update the currentAngle
            currentAngle = endAngle;

        }
    }

};






//circlesChart = circles;


function circles() {
    var circlesChart = document.querySelector("#circlesChart");
    var context = circlesChart.getContext("2d");
    //clear the canvas
    var numPoints = entityArray.segments.length;
    var numcolor = entityArray.segments.length; //number of circles to draw.
    var padding = 10; //space away from left edge of canvas to start drawing.
    var magnifier = 10;

    var horizontalAxis = circlesChart.height / 2; //how far apart to make each x value.
    //use the percentage to calculate the height of the next point on the line
    //start at values[1].
    //values[0] is the moveTo point.
    var currentPoint = 0;
    var totalValue = 0;
    for (var i = 0; i < entityArray.segments.length; i++) {
        totalValue += entityArray.segments[i].value;
    } //this will become the center of each cirlce.

    var x = 0;
    var y = horizontalAxis; //center y point for circle
    //var colour = "#00FF00";
    var colour = "entityArray.segments[i].color"
    for (var i = 0; i < entityArray.segments.length; i++) {
        //the percentages will be used to create the area of the circles
        //using the radius creates way too big a range in the size

        var pct = Math.round((entityArray.segments[i].value / totalValue) * 100);

        // the fill colour will be a shade of yellow
        // For shades of yellow the Reds should be E0 - FF, 
        // Greens should be less C0 - D0
        // blues are based on the percentage
        var a = (0xD0 + Math.round(Math.random() * 0x2F));
        var b = (0xD0 + Math.round(Math.random() * 0x2F));
        var red = Math.max(a, b).toString(16);
        var green = Math.min(a, b).toString(16);
        var blue = (Math.floor(pct * 2.55)).toString(16);
        if (red.length == 1) red = "0" + red;
        if (green.length == 1) green = "0" + green;
        if (blue.length == 1) blue = "0" + blue;
        //        colour = "#" + red + green + blue;
        colour = entityArray.segments[i].color;
        // area = Math.PI * radius * radius
        // radius = Math.sqrt( area / Math.PI );
        var radius = Math.sqrt(pct / Math.PI) * magnifier;
        // magnifier makes all circles bigger
        x = currentPoint + padding + radius;
        //center x point for circle
        //draw the circle
        context.beginPath();
        context.fillStyle = colour;
        //colour inside the circle set AFTER beginPath() BEFORE fill()
        context.strokeStyle = "#333"; //colour of the lines 
        context.lineWidth = 3;
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill(); //fill comes before stroke
        context.stroke();
        //to add labels take the same x position but go up or down 30 away from the y value
        //use the percentage to decide whether to go up or down. 20% or higher write below the line		
        var lbl = entityArray.segments[i].label;


        context.font = "normal 8pt Arial";
        context.textAlign = "center";
        context.fillStyle = "#000000"; //colour inside the circle
        context.beginPath();
        context.fillText(lbl, x, y + 6);
        context.closePath();
        currentPoint = x + radius;
    }
}

function darn() {}