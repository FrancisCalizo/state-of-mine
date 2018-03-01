// All Scripts for Dashboard Map
var map = AmCharts.makeChart( "chartdiv", {
  "type": "map",
  "theme": "none",

  "panEventsEnabled": true,
  //"backgroundColor": "#666666",
  //"backgroundAlpha": 1,
  "dataProvider": {
    "map": "usaLow",
    "getAreasFromMap": true,
  },
  "areasSettings": {
    "autoZoom": false,
    "color": "#FFF",
    "colorSolid": "#5EB7DE",
    "selectedColor": "rgb(83, 249, 27)",
    "outlineColor": "#666666",
    "rollOverColor": "gainsboro",
    "rollOverOutlineColor": "#FFFFFF",
    "selectable": true
  },
  "listeners": [ {
    "event": "clickMapObject",
    "method": function( event ) {
      // deselect the area by assigning all of the dataProvider as selected object
      map.selectedObject = map.dataProvider;

      // toggle showAsSelected
      event.mapObject.showAsSelected = !event.mapObject.showAsSelected;

      // bring it to an appropriate color
      map.returnInitialColor( event.mapObject );

      // let's build a list of currently selected states
      var states = [];
      for ( var i in map.dataProvider.areas ) {
        var area = map.dataProvider.areas[ i ];
        if ( area.showAsSelected ) {
          states.push( area.title );
        }
      }
    }
  } ],
  "export": {
    "enabled": true
  }
} );



//selectedColorReal
//map.validateNow();



