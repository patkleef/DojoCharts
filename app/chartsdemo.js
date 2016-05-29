define([
    "dojo",
    "dojo/text!./chartsdemotemplate.html",
    "dojo/_base/declare",
    "dojo/dom-construct", 
    "dojo/on",
    "dojo/_base/lang",
    "dojo/query",
    "dojo/dom-attr",
    
    "dojox/charting/Chart",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Pie",
    "dojox/charting/Chart2D",
    "dojox/charting/action2d/Magnify",
    "dojox/charting/action2d/MoveSlice",
    "dojox/charting/action2d/Shake",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/MouseZoomAndPan",
    "dojox/charting/action2d/MouseIndicator",
    
    "dojox/charting/widget/SelectableLegend",
    "dojox/charting/themes/Dollar",
    "dojox/charting/themes/Electric",
    "dojox/charting/themes/Julie",
    "dojox/charting/themes/PurpleRain",
    "dojox/charting/themes/Renkoo",
    
    "dijit/_Widget",
    "dijit/_TemplatedMixin"   
], function(
    dojo,
    template,
    declare,
    domConstruct,
    on,
    lang,
    query,
    domAttr,
    
    Chart,
    Default,
    Lines,
    Pie,
    Chart2D,
    Magnify,
    MoveSlice,
    Shake,
    Tooltip,
    MouseZoomAndPan,
    MouseIndicator,
    
    SelectableLegend,
    Dollar,
    Electric,
    Julie,
    PurpleRain,
    Renkoo,
    
    Widget,
    TemplatedMixin
) {
    return declare("app.chartsdemo", [
        Widget, TemplatedMixin
    ], 
    {        
        templateString: template,
        
        chartTypeDropDownSelect: null,
        themeDropDownSelect: null,
        titleTextBox: null,
        titlePositionDropDownSelect: null,
        legendCheckBox: null,
        highlightCheckBox: null,
        magnifyCheckBox: null,
        moveSliceCheckBox: null,
        shakeCheckBox: null,
        tooltipCheckBox: null,
        mousezoomandpanCheckBox:null,
        mouseindicatorCheckBox: null,
        touchzoomandpanCheckBox: null,
        chartsContainer: null,
        eventList: null,
        
        postCreate: function() {
            var generateButton = dojo.byId("generateButton");
            
            this.chartTypeDropDownSelect = dojo.byId("chartTypeDropDownSelect");
            this.themeDropDownSelect = dojo.byId("themeDropDownSelect");
            this.titleTextBox = dojo.byId("titleTextBox");
            this.titlePositionDropDownSelect = dojo.byId("titlePositionDropDownSelect");
            this.legendCheckBox = dojo.byId("legendCheckBox");
            this.highlightCheckBox = dojo.byId("highlightCheckBox");
            this.magnifyCheckBox = dojo.byId("magnifyCheckBox");
            this.moveSliceCheckBox = dojo.byId("moveSliceCheckBox");
            this.shakeCheckBox = dojo.byId("shakeCheckBox");
            this.tooltipCheckBox = dojo.byId("tooltipCheckBox");
            this.mousezoomandpanCheckBox = dojo.byId("mousezoomandpanCheckBox");
            this.mouseindicatorCheckBox = dojo.byId("mouseindicatorCheckBox");
            this.touchzoomandpanCheckBox = dojo.byId("touchzoomandpanCheckBox");
            this.chartsContainer = dojo.byId("chartsContainer");
            this.eventList = dojo.byId("eventList");
            
            on(generateButton, 'click', lang.hitch(this, this.generateButtonClicked));     
        },  
        
        generateButtonClicked: function(e) {  
            this.renderChart(this.chartTypeDropDownSelect.value);   
        },
        
        clearChartsContainer: function() {
            domConstruct.empty(this.chartsContainer);
            domConstruct.empty(this.eventList);
        },
        
        renderChart: function(chartType) {
            this.clearChartsContainer();      
            
            var chartElement = domConstruct.create("div", { class: "chart" }, this.chartsContainer);            
            var chart = new Chart(chartElement);
            chart.title = this.titleTextBox.value;
            chart.titlePos = this.titlePositionDropDownSelect.value;
            chart.titleGap = 10;
            chart.titleFont = "20px Myriad,Helvetica,Tahoma,Arial,clean,sans-serif";
            chart.titleFontColor = "#000";
            
            chart.setTheme(dojo.getObject("dojox.charting.themes." + this.themeDropDownSelect.value));
            
            switch(chartType)
            {
                case "Line":
                    chart = this.renderLineChart(chart);
                    break;
                case "Columns":
                    chart = this.renderColumnsChart(chart); 
                    break;
                case "Pie":
                    chart = this.renderPieChart(chart); 
                    break;
                case "Bubbles":
                    chart = this.renderBubbleChart(chart); 
                    break;
            } 
                    
            chart.connectToPlot("default", 
                lang.hitch(this, function(evt) { 
                        var text = "Event: " + evt.type;
                        if(evt.type == "onmouseout" || evt.type == "onmouseover" || evt.type == "onclick")
                        {
                            text += " X: " + evt.x + " Y: " + evt.y;
                        }
                        domConstruct.create("li", { innerHTML: text }, this.eventList, "first"); 
                    })
                );    
            
            if(this.highlightCheckBox.checked) {
                var chartHighlight = new dojox.charting.action2d.Highlight(chart, "default");
            }  
            if(this.magnifyCheckBox.checked) {
                var chartMagnify = new Magnify(chart, "default", { scale: 2 });
            }
            if(this.moveSliceCheckBox.checked) {
                var chartMoveSlice = new MoveSlice(chart, "default", { scale: 2, shift: 7 });
            }
            if(this.shakeCheckBox.checked) {
                var chartShake = new Shake(chart, "default", { shiftX: 5, shiftY: 5 });
            }
            if(this.tooltipCheckBox.checked) {
                var chartTooltip = new Tooltip(chart, "default");
            }
            if(this.mousezoomandpanCheckBox.checked) {
                var chartMousezoomandpan = new MouseZoomAndPan(chart, "default", { axis: "x"});
            }
            if(this.mouseindicatorCheckBox.checked) {
                var chartMouseindicator = new MouseIndicator(chart, "default", { series: "Series 1",
                mouseOver: true,
                    font: "normal normal bold 12pt Tahoma",
                    fillFunc: function(v){
                        return "green";
                    },
                    labelFunc: function(v){
                        return "x: " + v.x + ", y:" + v.y;
                    }});
            }
            
            chart.render(); 
            
            if(this.legendCheckBox.checked) {
                var chartLegendElement = domConstruct.create("div", { class: "chartLegend" }, this.chartsContainer);                
                var selectableLegend = new SelectableLegend({chart: chart, outline: true}, chartLegendElement);
            }  
        },
        
        
        renderLineChart: function(chart) {              
            chart.addPlot("default", { type: "Lines", tension: "X", markers: true });            
            
            var lineChartXaxisData = [
                {value: 1, text: "2007"},
                {value: 2, text: "2008"},
                {value: 3, text: "2009"},
                {value: 4, text: "2010"},
                {value: 5, text: "2011"},
                {value: 6, text: "2012"},
                {value: 7, text: "2013"},
                {value: 8, text: "2014"},
                {value: 9, text: "2015"},
                {value: 10, text: "2016"}];
                
            var lineChartDataSet1 = [200, 350, 550, 230, 780, 810, 120, 320, 499, 100]; 
            var lineChartDataSet2 = [90,360, 230, 670, 410, 150, 480, 190, 290, 590]; 
            
            chart.addAxis("y", { min: 1, max: 1000, vertical: true, fixLower: "major", fixUpper: "major", microTicks: false, minorTicks: false,  title: "Y ax", titleOrientation: "away" });
            chart.addAxis("x",  { labels: lineChartXaxisData, title: "X ax", titleOrientation: "away", microTicks: false, minorTicks: false });
            
            chart.addSeries("Series 1", lineChartDataSet1, { stroke: { color: "blue"} });
            chart.addSeries("Series 2", lineChartDataSet2, { stroke: { color: "green"} })

            return chart;
        },
        
        renderPieChart: function(chart) {
            chart.addPlot("default", { type: "Pie", tension: "X" });
            
            var dataSet1 = [{
                                y: 3,
                                text: "2012"
                            }, {
                                y: 7,
                                text: "2013"
                            },{
                                y: 4,
                                text: "2014"
                            },{
                                y: 9,
                                text: "2015"
                            },{
                                y: 6,
                                text: "2016"
                            }];
            var dataSet2 = [2,5,2,5,7,3,1];
                            
            chart.addSeries("Series 1",dataSet1);
            
            return chart;
        },
        
        renderBubbleChart: function(chart) {
            chart.addPlot("default", { type: "Bubble" });
            chart.addAxis("x", { natual:true, includeZero: true, max:7});
            chart.addAxis("y", { natual:true, vertical: true, includeZero: true, max:10 });
            
            chart.addSeries("Series 1",[{ x:3, y:5, size:1 },{ x:1, y:7, size:1 },{ x:4, y:2, size:3 }]);
            return chart;
        },
        
        renderColumnsChart: function(chart) {            
            chart.addPlot("default", { type: "Columns", gap: 2 });
            chart.addAxis("y", { min: 1, max: 800, vertical: true, fixLower: "major", fixUpper: "major" });
            
            var lineChartXaxisData = [
                {value: 1, text: "2007"},
                {value: 2, text: "2008"},
                {value: 3, text: "2009"},
                {value: 4, text: "2010"},
                {value: 5, text: "2011"},
                {value: 6, text: "2012"},
                {value: 7, text: "2013"},
                {value: 8, text: "2014"},
                {value: 9, text: "2015"},
                {value: 10, text: "2016"}];
                
            chart.addAxis("x", { labels: lineChartXaxisData });
            chart.addSeries("Series 1",[90,360, 230, 670, 410, 150, 480, 190, 290, 590]);
            return chart;
        }
    })
});
