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
  }

}


function main() {
  let t = new Date().getTime()
  fetch('content.yaml?t='+t)
  .then((resp) => { return resp.text() })
  .then((body) => {
    let content = jsyaml.load(body);
    ReactDOM.render(
      <App content={content} />,
      document.querySelector('#app-container')
    )
  });
}

window.main = main
