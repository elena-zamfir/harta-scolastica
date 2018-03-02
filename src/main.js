import React from 'react'
import {render} from 'react-dom'


class App extends React.Component {

  render() {
    return (
      <div id="app">
        <div id="menu"></div>
        <div id="map"></div>
        <div id="text"></div>
      </div>
    )
  }

  componentDidMount() {
    var map = L.map('map').setView([46, 25], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    L.tileLayer('tiles/webmercator/{z}/{x}/{y}.png', {
        tms: true,
        attribution: '&copy; Muzeul Hărților'
    }).addTo(map);

    fetch('vectori.topojson')
    .then(function(resp) { return resp.json() })
    .then(function(topo) {
      var bataliiData = topojson.feature(topo, topo.objects.batalii);
      var graniteData = topojson.feature(topo, topo.objects.granite);

      L.geoJSON(bataliiData).addTo(map);
      L.geoJSON(graniteData).addTo(map);
    });

    fetch('content.yaml')
    .then(function(resp) { return resp.text() })
    .then(function(body) {
      var content = jsyaml.load(body);

      var menu = $('#menu');
      $('<h2>').text("România Mare").appendTo('#menu');
      $('<h2>').text("Domnitori").appendTo('#menu');
      content['domnitori'].forEach(function(record) {
        var link = $('<a href="#">').text(record.nume)
        $('<p>').append(link).appendTo('#menu');
        link.on('click', function() {
          $('#text').text(record.text);
        });
      });
      $('<h2>').text("Năvălirea Barbarilor").appendTo('#menu');
      content['migratii'].forEach(function(record) {
        var link = $('<a href="#">').text(record.nume)
        $('<p>').append(link).appendTo('#menu');
        link.on('click', function() {
          $('#text').text(record.text);
        });
      });
      $('<h2>').text("Dacia Romană").appendTo('#menu');
    });
  }

}


function main() {
  render(React.createElement(App), document.querySelector('#app-container'))
}

window.main = main
