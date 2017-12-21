// Initialize svg size
var width = 550, height = 550;

var path = d3.geoPath();

var show_advice=true;
//defining map projection
var projection_geo= d3.geoConicConformal()
  .center([2.454071, 46.279229])
  .scale(2600)
  .translate([width / 2, height / 2]);
//applying projection to the geopath
path.projection(projection_geo);

var svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

var deps = svg.append("g");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip_base")
    .style("opacity", 0);

//useful wrap function for my text later
function wrap(text, width_text) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 18, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", width/2).attr("y", y).attr("text-anchor", "middle");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width_text) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", width/2).attr("y", ++lineNumber * lineHeight + Number(y)).attr("text-anchor", "middle").text(word);
      }
    }
  });
}

var csize_min=250
var csize_max=2300000
var scale_circle = d3.scaleLinear()
    .domain([csize_min,csize_max])
    .range([1,20]);

var color1="#F75940", color2="#2552AC";
//#fe4200 #0011ff
var scale_color=d3.scaleLinear()
		.domain([10,25])
		.range([color1,color2]);

var svg_legend=d3.select('#map').append("svg")
    .attr("id","svg_legend")
    .attr("width",width/5)
    .attr("height",height/1.7);

//legend of colors
var linearGradient = svg_legend.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", scale_color(55));

linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", scale_color(5));

svg_legend.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", 20)
    .attr("height", 150)
    .attr("y",height/10)
    .style("fill", "url(#linear-gradient)");

svg_legend.append("text")
      .text('Hourly wage')
      .attr("y", height/15);

svg_legend.append("text")
      .text('55€')
      .attr("x", 25)
      .attr("y", height/10+10);

svg_legend.append("text")
      .text('5€')
      .attr("x", 25)
      .attr("y", height/10+150);

//legend circle size
svg_legend.append("text")
      .text('Population')
      .attr("y", height/2.3);

var numbers=[2500000,1000000,250];
var size_dif=scale_circle(numbers[0]);

function draw_legend_circle(number) {
  svg_legend.append("circle")
          .attr("fill", 'none')
          .attr("cx",size_dif)
          .attr("cy",height/2+size_dif-scale_circle(number))
          .style("stroke-dasharray", ("5,2"))
          .style("stroke", "black")
          .attr("r",scale_circle(number));
}

function draw_legend_line(number){
  svg_legend.append("line")
      .style("stroke", "black")
      .attr("x1",size_dif+scale_circle(number))
      .attr("y1",height/2+size_dif-scale_circle(number))
      .attr("x2",size_dif*2+11)
      .attr("y2",height/2+size_dif-scale_circle(number));
}

function append_text(number){
  svg_legend.append("text")
        .text(number)
        .attr("x", size_dif*2+13)
        .attr("y", height/2+size_dif-scale_circle(number)+2)
        .attr("id",'legend_text');
}

for (i = 0; i < numbers.length; i++) {
  draw_legend_circle(numbers[i]);
  draw_legend_line(numbers[i]);
  append_text(numbers[i]);
}


var selector='snhm14';

d3.select('#selection').on('change', function() {
    selector = d3.select(this).node().value;
    show_advice=false;
    update(selector);
});

function update(selector){
  var app_color;
  var app_text;
  svg.selectAll("circle").remove();
  svg.select("#title_svg_app").remove();
  deps.remove();
  deps = svg.append("g");

  d3.json('data/departments.json', function(req, geojson) {
    var features = deps
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('fill', '#ffedbc')
        .attr('stroke','#FFCF71')
        .attr("d", path);

          d3.text("data/salaries_population.csv", function(raw_data) {
            var dsv = d3.dsvFormat(',')
  	        var csv = dsv.parse(raw_data)
            svg.selectAll("circle")
                .data(csv)
                .enter()
                .append("circle")
                .attr("cx", function (d) {return projection_geo([d.longitude,d.latitude])[0]; })
                .attr("cy", function (d) {return projection_geo([d.longitude,d.latitude])[1]; })
                .attr("r", function (d) {return scale_circle(d.p14_pop)+0.2 + "px"; })
                .attr('id', function(d) {return "d" + d.codgeo;})
                .attr("fill", function (d) {

                  var slist_allcircles=[[d.snhm14,'snhm14','all the population'],[d.snhmh14,'snhmh14','men'],[d.snhmf14,'snhmf14','women'],[d.snhm1814,'snhm1814','people aged 18 to 25'],[d.snhm2614,'snhm2614','people aged 26 to 50'],[d.snhm5014,'snhm5014','people aged 50'],[d.snhmc14,'snhmc14','executives'],[d.snhmp14,'snhmp14','the intermediate occupations'],[d.snhme14,'snhme14','employees'],[d.snhmo14,'snhmo14','workers'],[d.snhmhc14,'snhmhc14','male executives'],[d.snhmhp14,'snhmhp14','men in intermediate occupations'],[d.snhmhe14,'snhmhe14','male employees'],[d.snhmho14,'snhmho14','male workers'],[d.snhmfc14,'snhmfc14','women executives'],[d.snhmfp14,'snhmfp14','women in intermediate occupations'],[d.snhmfe14,'snhmfe14','women employees'],[d.snhmfo14,'snhmfo14','female workers'],[d.snhmf1814,'snhmf1814','women aged 18 to 25'],[d.snhmf2614,'snhmf2614','women aged 26-50'],[d.snhmf5014,'snhmf5014','women over 50'],[d.snhmh1814,'snhmh1814','men aged 18 to 25'],[d.snhmh2614,'snhmh2614','men aged 26 to 50'],[d.snhmh5014,'snhmh5014','men over 50']];

                  for (i = 0; i < slist_allcircles.length; i++) {
                      if (slist_allcircles[i][1]==selector){
                        app_color=slist_allcircles[i][0];
                        app_text=slist_allcircles[i][2];
                      }
                  }
                  return scale_color(app_color);})
                .on("mouseover", function(d) {
                  var y_tooltip;
                  var tooltip_w=width/1.2;
                  var tooltip_h=height/1.7;

                  if(d3.event.pageY>tooltip_h){y_tooltip=(d3.event.pageY - 300);}
                  else{y_tooltip=(d3.event.pageY - 30);}

                  var list_salaries=[[d.snhm14,'All the population','snhm14'],[d.snhmh14,'Men','snhmh14'],[d.snhmf14,'Women','snhmf14'],[d.snhm1814,'People aged 18 to 25','snhm1814'],[d.snhm2614,'People aged 26 to 50','snhm2614'],[d.snhm5014,'People aged 50','snhm5014'],[d.snhmc14,'Executives','snhmc14'],[d.snhmp14,'The intermediate occupations','snhmp14'],[d.snhme14,'Employees','snhme14'],[d.snhmo14,'Workers','snhmo14'],[d.snhmhc14,'Male executives','snhmhc14'],[d.snhmhp14,'Men in intermediate occupations','snhmhp14'],[d.snhmhe14,'Male employees','snhmhe14'],[d.snhmho14,'Male workers','snhmho14'],[d.snhmfc14,'Women executives','snhmfc14'],[d.snhmfp14,'Women in intermediate occupations','snhmfp14'],[d.snhmfe14,'Women employees','snhmfe14'],[d.snhmfo14,'Female workers','snhmfo14'],[d.snhmf1814,'Women aged 18 to 25','snhmf1814'],[d.snhmf2614,'Women aged 26-50','snhmf2614'],[d.snhmf5014,'Women over 50','snhmf5014'],[d.snhmh1814,'Men aged 18 to 25','snhmh1814'],[d.snhmh2614,'Men aged 26 to 50','snhmh2614'],[d.snhmh5014,'Men over 50','snhmh5014']]

                  d3.select('#d'+d.codgeo)
                    .attr("r", scale_circle(d.p14_pop)*4)
                    .style("stroke",'grey')
                    .style("stroke-width",3);

                  div.transition()
                      .duration(200)
                      .style("opacity",.9)
                      .style("left", d3.event.pageX + 30 + "px")
                      .style("top", y_tooltip + "px");

                  var tipSVG = d3.select("#tooltip_base")
                    .append("svg")
                    .attr("width", tooltip_w)
                    .attr("height", tooltip_h);
                  var start_x=5;
                  var new_x=start_x+230;

                  tipSVG.append("text")
                        .text('Average net hourly wage in '+d.libgeo+ ' ('+d3.format(",.2r")(d.p14_pop)+' inhab.):') //format(",.2r") is to group thousands
                        .attr('id','title_tooltip')
                        .attr("x", start_x)
                        .attr("y", 15);

                  function draw_barchart(starting_x, starting_i, ending_i){
                    for (i = starting_i; i < ending_i; i++) {
                      tipSVG.append("rect")
                              .attr("fill", scale_color(list_salaries[i][0]))
                              .style("stroke", function(foo){
                              if (selector==list_salaries[i][2]){
                                return 'grey';
                              }
                              else {
                                return 'none';
                              }})
                              .attr("stroke-width", 3)
                              .attr("x", starting_x)
                              .attr("y", 25+25*(i-starting_i))
                              .attr("width", 0)
                              .attr("height", 15)
                              .attr("rx", 6)
                              .attr("ry", 6)
                              .transition()
                              .duration(1000)
                              .attr("width", list_salaries[i][0]*3);

                      tipSVG.append("text")
                              .text(list_salaries[i][1])
                              .attr("x", starting_x+10)
                              .attr("y", 37+25*(i-starting_i))
                              .attr('fill',scale_color(list_salaries[i][0]))
                              .transition()
                              .attr('id',function(foo){
                              if (selector==list_salaries[i][2]){
                                return 'sel_tooltip_text';
                              }
                              else {
                                return 'tooltip_text';
                              }})
                              .duration(1000)
                              .attr("x", list_salaries[i][0]*3 + starting_x + 5);

                      tipSVG.append("text")
                              .text(list_salaries[i][0]+'€')
                              .attr("x", starting_x + 5)
                              .attr("y", 35+25*(i-starting_i))
                              .attr('fill','transparent')
                              .transition()
                              .delay(800)
                              .attr('fill','white')
                              .attr('id','tooltip_values');
                    }
                  }
                  draw_barchart(start_x,0,list_salaries.length/2);
                  draw_barchart(new_x,list_salaries.length/2,list_salaries.length);


              })
                .on("mouseout", function(d) {
                  var recolor;
                  d3.select('#d'+d.codgeo)
                    .style("stroke",'none')
                    .attr("r", scale_circle(d.p14_pop) + "px" )
                    .attr("fill", function(d){
                      var slist_colorcircle=[[d.snhm14,'snhm14'],[d.snhmh14,'snhmh14'],[d.snhmf14,'snhmf14'],[d.snhm1814,'snhm1814'],[d.snhm2614,'snhm2614'],[d.snhm5014,'snhm5014'],[d.snhmc14,'snhmc14'],[d.snhmp14,'snhmp14'],[d.snhme14,'snhme14'],[d.snhmo14,'snhmo14'],[d.snhmhc14,'snhmhc14'],[d.snhmhp14,'snhmhp14'],[d.snhmhe14,'snhmhe14'],[d.snhmho14,'snhmho14'],[d.snhmfc14,'snhmfc14'],[d.snhmfp14,'snhmfp14'],[d.snhmfe14,'snhmfe14'],[d.snhmfo14,'snhmfo14'],[d.snhmf1814,'snhmf1814'],[d.snhmf2614,'snhmf2614'],[d.snhmf5014,'snhmf5014'],[d.snhmh1814,'snhmh1814'],[d.snhmh2614,'snhmh2614'],[d.snhmh5014,'snhmh5014']];

                      for (i = 0; i < slist_colorcircle.length; i++) {
                          if (selector==slist_colorcircle[i][1]){
                            recolor=slist_colorcircle[i][0];
                          }
                      }
                      return scale_color(recolor);});

                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
                  div.html("");

                });

                svg.selectAll("[cx=NaN]").remove();
                svg.selectAll("[cy=NaN]").remove();

                svg.append("text")
                        .text('Average net hourly wage for '+app_text)
                        .attr("x", width/2)
                        .attr("y", 10)
                        .attr("text-anchor", "middle")
                        .attr('fill','#123597')
                        .attr('id','title_svg_app');

                svg.append("text")
                        .text('Data extracted from French National Institute of Statistics and Economic Studies')
                        .attr("x", 10)
                        .attr("y", height - 10)
                        .attr('id','source_svg');

                if (show_advice==true){
                  svg.append("rect")
                            .attr('width',width)
                            .attr('height',height)
                            .attr('fill','white')
                            .attr('id','rect_advice')
                            .style("opacity",.8)
                            .on("click", function(){
                              svg_legend.select("#rect_onlegend").remove();
                              svg.select("#text_advice").remove();
                              svg.select("#rect_advice").remove();
                            });

                  svg_legend.append("rect")
                            .attr('width',width/5)
                            .attr('height',height/1.7)
                            .attr('fill','white')
                            .attr('id','rect_onlegend')
                            .style("opacity",.8);

                  svg.append("text")
                          .text('This map shows you a detailed overview of the different average wages when you move your mouse over the different dots. Take this opportunity to compare the wages of different cities, socio-professional  categories, gender and age. You just have to click to continue')
                          .attr("x", width/2)
                          .attr("y", height/3)
                          .attr("text-anchor", "middle")
                          .attr('fill','#123597')
                          .attr('id','text_advice')
                          .on("click", function(){
                            svg_legend.select("#rect_onlegend").remove();
                            svg.select("#text_advice").remove();
                            svg.select("#rect_advice").remove();
                          })
                          .call(wrap, width/1.5);
                        }


        });
  });
}

update(selector);


var zoom = d3.zoom()
    .scaleExtent([0.95, 10])
    .on("zoom",function(d) {
        svg.selectAll("circle").attr("transform",d3.event.transform);
        //svg_legend.selectAll("circle").attr("transform",d3.event.scale);
        deps.attr("transform", d3.event.transform);
        if (d3.event.transform.k>1.5){
          svg.select("#title_svg_app").attr('fill','transparent');
        }
        else {
          svg.select("#title_svg_app").attr('fill','#123597');
        }

  });

svg.call(zoom)
