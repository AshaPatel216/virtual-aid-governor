import { AfterViewInit, Component, OnDestroy } from '@angular/core';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';

import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_thailandLow from '@amcharts/amcharts5-geodata/thailandLow';
import am5geodata_data_countries2 from '@amcharts/amcharts5-geodata/data/countries2';
import { state } from '@angular/animations';
import { IComponentDataItem } from '@amcharts/amcharts5/.internal/core/render/Component';
@Component({
  selector: 'app-thailand',
  templateUrl: './thailand.component.html',
  styleUrls: ['./thailand.component.scss'],
})
export class ThailandComponent {
  private root!: am5.Root;
  usersAvailable = false;
  state = '';
  numberOfPeople = 0;
  lastClickedPolygon: am5map.MapPolygon | null = null;
  legendData = [
    { name: "> 8000", fill: am5.color(0x4DB509) },
    { name: "5000 - 8000", fill: am5.color(0x8CE552) },
    { name: "2000 - 5000", fill: am5.color(0xC5FBA2) },
    { name: "500 - 2000", fill: am5.color(0xFF6767) },
    { name: "< 500", fill: am5.color(0xB60909) },
  ]
  constructor() { }

  ngAfterViewInit() {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new('chartdiv');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Responsive.new(root)]);

    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'none',
        panY: 'none',
        projection: am5map.geoMercator(),
        minZoomLevel: 1,
        maxZoomLevel: 1,
      })
    );

    // Create polygon series for the map to add Thailand chart
    var polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_thailandLow,
      })
    );

    // template to add custom settings
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: '{name} : {value}',
      interactive: false,
      templateField: 'polygonSettings',
      strokeOpacity: 0,
      shadowColor: am5.color(0x000000),
      shadowBlur: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    });

    // add event listener to scroll page from inside map area
    window.addEventListener('wheel', function (event) {
      window.scrollBy(5, event.deltaY);
    }, { passive: false });

    // get length of the total states/areas in Thailand
    let length = 0;
    for (var id in am5geodata_thailandLow['features']) {
      length++;
    }

    // set state data
    var stateData = [];
    for (let i = 0; i < length; i++) {
      let state = am5geodata_thailandLow['features'][i];
      let randomValue = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
      let stateColor = '';
      if (randomValue < 500) {
        stateColor = '#B60909';
      } else if (randomValue >= 500 && randomValue < 2000) {
        stateColor = '#FF6767';
      } else if (randomValue >= 2000 && randomValue < 5000) {
        stateColor = '#C5FBA2';
      } else if (randomValue >= 5000 && randomValue < 8000) {
        stateColor = '#8CE552';
      } else {
        stateColor = '#4DB509';
      }

      // Set visibility to false for areas with value (randomValue > 1000)
      let isVisible = randomValue > 1000;
      console.log(randomValue + ': ' + isVisible)
      stateData.push({
        id: state.id,
        value: randomValue > 1000 ? randomValue : '',
        polygonSettings: {
          fill: stateColor,
          visible: isVisible // Sets visibility based on the condition
        },
      });


      // Additional logic or processing can go here
    }


    // Create and configure a legend
    let legend = chart.children.push(am5.Legend.new(root, {
      // Legend configuration options
      layout: root.verticalLayout,
      clickTarget: "none"
    }));

    // Change legend marker style to square
    legend.markers.template.setAll({
      width: 30, // width of the square
      height: 15, // height of the square

      background: am5.Rectangle.new(root, {
        strokeWidth: 0,
      })
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10
    });

    // push the legendData to the legend
    am5.array.each(this.legendData, function (group) {
      var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        name: group.name,
        fill: group.fill
      }));
      legend.data.push(polygonSeries);
    });


    // creating series to add labels in all areas
    var bubbleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id',
      })
    );


    // push
    bubbleSeries.bullets.push(function (root) {
      let container = am5.Container.new(root, {});

      container.children.push(
        am5.Label.new(root, {
          text: '{value}', // value which is shown in each area
          populateText: true,
          fontWeight: 'bold',
          fontSize: 8,
          centerX: am5.p50,
          centerY: am5.p50,
        })
      );

      return am5.Bullet.new(root, {
        sprite: container,
        dynamic: true,
      });
    });

    // on clicking of any of the area in map, show user details to right section
    polygonSeries.mapPolygons.template.events.on('click', (ev) => {
      this.usersAvailable = true;
      let dataItem: am5.DataItem<IComponentDataItem> | undefined =
        ev.target.dataItem;
      let data: any = dataItem?.dataContext;
      this.state = data.name;
      this.numberOfPeople = data.value;

      // reduce opacity of all area
      polygonSeries.mapPolygons.each((polygon) => {
        polygon.setAll({ opacity: 0.5 });
      });

      // remove/unset shadow of last clicked area
      if (this.lastClickedPolygon) {
        this.lastClickedPolygon.setAll({
          strokeOpacity: 1,
          shadowBlur: 1,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          strokeWidth: 0,
        });
      }

      // add shadow and full opacity to clicked area
      let clickedPolygon = ev.target;
      ev.target.setAll({
        strokeOpacity: 1,
        shadowColor: am5.color(0x000000),
        shadowBlur: 10,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
        opacity: 1,
      });

      this.lastClickedPolygon = clickedPolygon;
    });


    // set stateData to series and its data
    polygonSeries.data.setAll(stateData);
    bubbleSeries.data.setAll(stateData);
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  }
}
