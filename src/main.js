import React from 'react'
import {render} from 'react-dom'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {page: 'home'}
  }

  render() {
    let {content} = this.props
    let {page, subpage} = this.state
    let {domnitori, migratii} = content || {}

    let record = {}
    if(page == 'domnitori' || page == 'migratii') {
      record = content[page].filter((r) => r.id == subpage)[0]
    }

    let textBox = null
    if(record.text) {
      textBox = (
        <div id="text">{record.text}</div>
      )
    }

    let pozaBox = null
    if(record.poza) {
      pozaBox = (
        <div id="poza"><img src={"poze/"+record.poza}/></div>
      )
    }

    let homePage = null
    if(page == 'home') {
      homePage = (
        <div id="homepage">
          <h1>Harta Școlastică</h1>
          <h2>a Daciei și României de azi</h2>
        </div>
      )
    }

    return (
      <div id="app">

        <div id="menu">
          <h2>România Mare</h2>

          <h2>Domnitori</h2>
          {(domnitori || []).map((record) => (
            <p>
              <a href='#' onClick={() => {this.setState({page: 'domnitori', subpage: record.id})}}>
                {record.nume}
              </a>
            </p>
          ))}

          <h2>Năvălirea Barbarilor</h2>
          {(migratii || []).map((record) => (
            <p>
              <a href='#' onClick={() => {this.setState({page: 'migratii', subpage: record.id})}}>
                {record.nume}
              </a>
            </p>
          ))}


          <h2>Dacia Romană</h2>

        </div>

        <div id="map"></div>

        {textBox}

        {pozaBox}

        {homePage}

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

  }

}


function main() {
  let t = new Date().getTime()
  fetch('vectori.topojson?t='+t)
  .then((resp) => { return resp.json() })
  .then((topo) => {
    fetch('content.yaml?t='+t)
    .then((resp) => { return resp.text() })
    .then((body) => {
      let content = jsyaml.load(body);
      render(
        <App topo={topo} content={content} />,
        document.querySelector('#app-container')
      )
    });
  });

}

window.main = main
