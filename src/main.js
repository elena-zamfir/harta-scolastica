function Bulina({}) {
  return (
    <span className="bulina">
      <span className="bulina-circle"></span>
      <span className="bulina-dot"></span>
    </span>
  )
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {page: 'home'}
    this.layers = []
  }

  render() {
    let {content} = this.props
    let {page, subpage} = this.state
    let {perioade} = content || {}

    let record = {}
    if(page == 'perioade') {
      record = content[page].filter((r) => r.id == subpage)[0]
    }

    if(this.map) this.setLayersFor(record)

    return (
      <div id="app">

        <div id="menu">
          <div id="menu-content">
            {(perioade || []).map((record) => (
              <p key={record.id} className={(record.id === subpage) ? 'selected' : ''}>
                <Bulina />
                <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'perioade', subpage: record.id})}}>
                  {record.nume}
                </a>
              </p>
            ))}
          </div>
        </div>

        <div id="map"></div>

      </div>
    )
  }

  componentDidMount() {
    this.map = L.map('map').setView([46, 25], 7);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC', maxZoom: 16}).addTo(this.map);

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

    let bindFeaturePopup = function(marker, feature) {
      let p = feature.properties
      let content = `
        <h2>${p.titlu}</h2>
        <div class="poza">
          <img src="poze/${p.imagine}">
        </div>
        <div class="text">
          ${p.text}
        </div>
        <div class="clearfix"></div>
      `
      marker.bindPopup(content)
    }

    let pointToLayer = function(feature, layer) {
      bindFeaturePopup(layer, feature)
    }

    let layer = L.geoJSON(record.layer, {onEachFeature: pointToLayer, style: {color: '#59c1da', weight: 5}})
    console.log(this.map)
    layer.addTo(this.map)
    this.layers.push(layer)
  }

}


async function main() {
 try {
  let t = new Date().getTime()
  let resp = await fetch('content.yaml?t='+t)
  let body = await resp.text()
  let content = jsyaml.load(body);

  for (let p of content.perioade) {
    p.layer = await (await fetch(`layers/${p.id}.geojson`)).json()
  }

  ReactDOM.render(
    <App content={content} />,
    document.querySelector('#app-container')
  );
 } catch(e) {
   console.error(e)
 }
}

window.main = main
