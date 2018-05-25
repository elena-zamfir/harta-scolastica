class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {page: 'home'}
    this.layers = []
  }

  render() {
    let {content} = this.props
    let {page, subpage} = this.state
    let {domnitori, migratii} = content || {}

    let record = {}
    if(page == 'domnitori' || page == 'migratii') {
      record = content[page].filter((r) => r.id == subpage)[0]
    }

    this.setLayersFor(record)

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
          <div id="homepage-buttons">
            <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'domnitori', subpage: 'litovoi'})}}>Litovoi</a>
            <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'domnitori', subpage: 'stefan_cel_mare'})}}>Ștefan cel Mare</a>
          </div>
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
              <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'domnitori', subpage: record.id})}}>
                {record.nume}
              </a>
            </p>
          ))}

          <h2>Năvălirea Barbarilor</h2>
          {(migratii || []).map((record) => (
            <p>
              <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'migratii', subpage: record.id})}}>
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
    this.map = L.map('map').setView([46, 25], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(this.map);

    L.tileLayer('https://qp.grep.ro/harta-ro-scolastica/app/tiles/webmercator/{z}/{x}/{y}.png', {
        tms: true,
        attribution: '&copy; Muzeul Hărților'
    }).addTo(this.map);

  }

  setLayersFor(record) {
    for(let l of this.layers) {
      l.removeFrom(this.map)
    }
    this.layers = []

    let smallIcon = new L.Icon({
       iconSize: [50, 50],
       iconAnchor: [13, 27],
       popupAnchor:  [1, -24],
       iconUrl: 'poze/arme.png'
    });

    let {topo} = this.props

    for(let layerDef of record.geo || []) {
      let layerData = topojson.feature(topo, topo.objects[layerDef.layer])
      let filterFeatures = (feature) => {
        console.log(feature.properties.nume)
        return layerDef.features.indexOf(feature.properties.nume) > -1
      }
      let pointToLayer = function(feature, latlng) {
        return L.marker(latlng, {icon: smallIcon});
      }

      let layer = L.geoJSON(layerData, {filter: filterFeatures, pointToLayer: pointToLayer, style: {color: '#59c1da', weight: 5}})
      layer.addTo(this.map)
      this.layers.push(layer)
    }
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
      ReactDOM.render(
        <App topo={topo} content={content} />,
        document.querySelector('#app-container')
      )
    });
  });

}

window.main = main
