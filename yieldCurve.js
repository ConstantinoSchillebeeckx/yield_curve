var chart, dat;

function renderChart(dat, div) {

    console.log(dat);

    // reformat data:
    // rates converted to float 
    // epoch calculated from date
    // margins calculated
    var datParse = [
        {key:'10yr_2yr', values:[]},
        {key:'30yr_2yr', values:[]},
        {key:'10yr_3mo', values:[]},
    ];


    dat.forEach(function(d) {
        Object.keys(d).forEach(function(i) {
            if (i == 'Date') {
                d['epoch'] = Date.parse(d['Date'])
            } else {
                d[i] = parseFloat(d[i]);
            }
        })

        d['10yr_2yr'] = d['10 yr'] - d['2 yr'];
        d['30yr_2yr'] = d['30 yr'] - d['2 yr'];
        d['10yr_3mo'] = d['10 yr'] - d['3 mo'];

        datParse.forEach(function(i) {
            i.values.push({x:d.epoch, y:d[i.key]});
        })
    })

    console.log(datParse);

    chart = nv.models.lineWithFocusChart();

    nv.addGraph(function() {


        chart.x2Axis
             .tickFormat(function(d) {
                return d3.time.format('%Y-%m-%d')(new Date(d))
             })

        chart.color(d3.scale.category10().range())
             .margin({
                left:80,
                right:50,
             })
             .useInteractiveGuideline(true)
             .interactiveUpdateDelay(2000);

        chart.xAxis
             .tickFormat(function(d) {
                return d3.time.format('%Y-%m-%d')(new Date(d))
             })

        chart.yAxis
             .tickFormat(function(d) {
                return d.toFixed(2);
             })
             .showMaxMin(false);
        
        chart.yDomain([0,1.5]);

        // remove any current chart
        d3.select(div + ' svg')
          .remove()

        d3.select(div)
          .append('svg')
          .datum(datParse)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}


function init(div) {
    /*
    */
    var parser = new DOMParser();
    var url = 'https%3A//www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx%3Fdata%3DyieldYear%26year%3D2018&callback=?'

    $.ajax({
        url: 'https://allorigins.me/get?url='+url,
        async: false,
        dataType: 'json',
        success: function(data) {
            var htmlDoc = parser.parseFromString(data.contents, "text/html");
            dat = parseTable($(htmlDoc).find('table.t-chart')); 
            
            renderChart(dat, '#chart');
        }
    });

}

