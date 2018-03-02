import React from 'react'
import {render} from 'react-dom'


class App extends React.Component {

  render() {
    let {text, content} = this.state || {}
    let {domnitori, migratii} = content || {}

    return (
      <div id="app">

        <div id="menu">
          <h2>România Mare</h2>

          <h2>Domnitori</h2>
          {(domnitori || []).map((record) => (
            <p>
              <a href='#' onClick={() => {this.setState({text: record.text})}}>
                {record.nume}
              </a>
            </p>
          ))}

          <h2>Năvălirea Barbarilor</h2>
          {(migratii || []).map((record) => (
            <p>
              <a href='#' onClick={() => {this.setState({text: record.text})}}>
                {record.nume}
              </a>
            </p>
          ))}


          <h2>Dacia Romană</h2>

        </div>

        <div id="map"></div>

        <div id="text">{text}</div>

      </div>
    )
  }

  componentDidMount() {
    let map = L.map('map').setView([46, 25], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    L.tileLayer('tiles/webmercator/{z}/{x}/{y}.png', {
        tms: true,
        attribution: '&copy; Muzeul Hărților'
    }).addTo(map);

    fetch('vectori.topojson')
    .then((resp) => { return resp.json() })
    .then((topo) => {
      let bataliiData = topojson.feature(topo, topo.objects.batalii);
      let graniteData = topojson.feature(topo, topo.objects.granite);

      L.geoJSON(bataliiData).addTo(map);
      L.geoJSON(graniteData).addTo(map);
    });

    fetch('content.yaml')
    .then((resp) => { return resp.text() })
    .then((body) => {
      let content = jsyaml.load(body);
      this.setState({content})
    });
  }

}


function main() {
  render(React.createElement(App), document.querySelector('#app-container'))
}

window.main = main
