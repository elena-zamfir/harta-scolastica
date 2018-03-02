import React from 'react'
import {render} from 'react-dom'


class App extends React.Component {

  render() {
    return (
      <div id="app">
        hello app!
      </div>
    )
  }

}


function main() {
  render(React.createElement(App), document.querySelector('#app-container'))
}

window.main = main
