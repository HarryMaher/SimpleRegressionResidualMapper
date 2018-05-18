//Scatter plot with linear regression that 

// Thanks to:
// https://bl.ocks.org/ctufts/298bfe4b11989960eeeecc9394e9f118
// https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript?


///see if we can write another one that can add residual to the_data, 
/// first see if we can run residual on a list of lists w/ more than 2 elements!

CURRENT_MODEL = "Linear Regression"

var data = hoods.features //data -- change to accurately reflect data served
var data_line = []
for(i=0;i<data.length;i++){
    x = data[i].properties.PctTrump  // rename to .XProp
    y = data[i].properties.pctNo     // rename to .Yprop
    if ((x > 0.1) && (y > 0.1)){
        data_line.push([x, y])
    }
};

// // hmm this requires jquery. hover pls clean later
// $('#dot').hover(
//        function(){ $(this).addClass('hover') },
//        function(){ $(this).removeClass('hover') })



//color picker modified from: https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage
// Gets color for regression line. Green = good r^2, red = bad. Hopefully won't go negative
function getColor(value){
    if(value < 0){
        value = 0
    }
    //value from 0 to 1
    var hue=((value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}   

// Thanks: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
max_x = Math.max.apply(Math, data_line.map(function(o){return o[0]}));
max_y = Math.max.apply(Math, data_line.map(function(o){return o[1]}));


//Calcualting residual stuff
function add_residual_to_data(){
    // puts residual into the data list []
    for(i=0;i<data.length;i++){
        data[i].properties.residual_of_current = data[i].properties.pctNo - ourCurrentRegression.predict(data[i].properties.PctTrump)[1] // switch to x_value
    };
};

// calculating residual in terms of standard deviations from mean
function add_std_dev_of_residual_to_data(){
    myarr= []
    for(i=0;i<data.length;i++){
        myarr.push(data[i].properties.residual_of_current)
    }
    st_dev_results = standard_dev(myarr)
    var min = 0
    for(i=0;i<myarr.length;i++){
        current_classification = classify_it(myarr[i], st_dev_results)
        if(current_classification < min){
            min = current_classification
        }
        data[i].properties.std_dev_of_residual = current_classification
    };
    // used for the lowest number in legend for map_part.js
    data.min = min
};


// using functions as switch case.
function linear_function(){
    CURRENT_MODEL = "Linear Regression"
    draw(CURRENT_MODEL);
};
function exponential_function(){
    CURRENT_MODEL = "Exponential Regression"
    draw(CURRENT_MODEL);
};
function logarithmic_function(){
    CURRENT_MODEL = "Logarithmic Regression"
    draw(CURRENT_MODEL);
};
function power_function(){
    CURRENT_MODEL = "Power Regression"
    draw(CURRENT_MODEL);
};
function polynomial_function(){
    CURRENT_MODEL = "Polynomial Regression (3rd order)"
    draw(CURRENT_MODEL);
}

//Change to reflect selected:
document.getElementById("x_dataset").onchange=function() {
    draw(CURRENT_MODEL)
}
document.getElementById("y_dataset").onchange=function() {
    draw(CURRENT_MODEL)
}


ourCurrentRegression = regression.linear(data_line)
var regressionDiv = document.getElementById('formula')
var r2Div = document.getElementById('r2')
var titleDiv = document.getElementById('currentRegressionModel')

// put it in the doc!
function draw(current_model){
    try{
        document.getElementById("scatter_svg").remove()
    }
    catch(err){
        console.log("can't remove what's not there")
    }

    switch(current_model){
        case "Linear Regression":
                ourCurrentRegression = regression.linear(data_line);
                break;
        case "Exponential Regression":
            ourCurrentRegression = regression.exponential(data_line);
                break;
        case "Logarithmic Regression":
            ourCurrentRegression = regression.logarithmic(data_line);
                break;
        case "Power Regression":
            ourCurrentRegression = regression.power(data_line);
                break;
        case "Polynomial Regression (3rd order)":
            ourCurrentRegression = regression.polynomial(data_line, { order: 3 })
                break;
        default:
            ourCurrentRegression = regression.linear(data_line);         
    }

    // steps for line.. 1 per until max x value
    var steps = Array.apply(null, Array(max_x)).map(function (_, i) {return i+1;});

    var margin = {
            top: 10,
            right: 20,
            bottom: 15,
            left: 25
        },
        width = 400 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3.scale.linear()
              .domain([0, max_x])  // the range of the values to plot
              .range([ 0, width ]);        // the pixel range of the x-axis

    var y = d3.scale.linear()
              .domain([0, max_y])
              .range([ height, 0 ]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .innerTickSize(-height)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .innerTickSize(-width)
        .orient("left");

    // Define the div for the tooltip
    var div = d3.select("#scatter_data_controls").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var svg = d3.select("#scatter_data_controls").append("svg")
        .attr("id", "scatter_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("id", "x_axis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(document.getElementById('x_dataset').value);

    svg.append("g")
        .attr("id", "y_axis")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(document.getElementById('y_dataset').value);


    svg.selectAll(".dot")
        .data(data_line)
        .enter().append("circle")
            .attr("class","dot")
            // For a possible solution for highlighting map features with dots
            .attr("id", function (d) { return d[1];})
            .attr("r", 3.5)
            .attr("cy", function (d) { return y(d[1]);}) // translate y value to a pixel
            .attr("cx", function (d,i) { return x(d[0]); } ) 
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .8);      
            div .html(
                "x: "+ d[0] + 
                "</br>y: " + Math.round(d[1] * 100)/100 +
                "</br> Residual: "+ 
                Math.round(((d[1] - ourCurrentRegression.predict(d[0])[1]) * 100))/ 100)
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

        d3.selectAll("path.line").remove();
                var line = d3.svg.line()
                .x(function(d) {
                    return x(d);
                })
                .y(function(d) {
                    return y(ourCurrentRegression.predict(d)[1]);
                });
                svg.append("path")
                .datum(steps)
                .attr("class", "line")
                .attr("style", "stroke:"+ getColor(ourCurrentRegression.r2))
                .attr("d", line);

                titleDiv.innerHTML = current_model
                regressionDiv.innerHTML = ourCurrentRegression.string +
                "<br/>R² = "+ ourCurrentRegression.r2
                add_residual_to_data(); // map needs residuals to draw them
                add_std_dev_of_residual_to_data();

                x.domain(d3.extent(data_line, function(d) {
                    return d[0];
                }));
                y.domain(d3.extent(data_line, function(d) {
                    return d[1];
                }));

            try{
                map.removeLayer(geojson3);
                draw_map(); // this lives in map_part.js
                }
            catch(err){ 
                console.log("And again");
            };
        }

draw(CURRENT_MODEL)
