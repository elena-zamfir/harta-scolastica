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
          {(perioade || []).map((record) => (
            <p key={record.id}>
              <Bulina />
              <a href='#' onClick={(e) => {e.preventDefault(); this.setState({page: 'perioade', subpage: record.id})}}>
                {record.nume}
              </a>
            </p>
          ))}
        </div>

        <div id="map"></div>

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

    console.log(this.map)

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

    let pointToLayer = function(feature, latlng) {
      let marker = L.marker(latlng)
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
      return marker
    }

    let layer = L.geoJSON(record.layer, {pointToLayer: pointToLayer, style: {color: '#59c1da', weight: 5}})
    console.log(this.map)
    layer.addTo(this.map)
    this.layers.push(layer)
  }

}


async function main() {
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
}

window.main = main
