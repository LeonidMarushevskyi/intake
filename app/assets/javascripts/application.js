import 'jquery-helpers'
import 'jquery-ujs'

import 'babel-polyfill'
import 'bootstrap'
import $ from 'jquery'
import Autocompleter from 'Autocompleter'
import PeopleApp from 'PeopleApp'
import React from 'react'
import ReactDOM from 'react-dom'
import ScreeningsApp from 'ScreeningsApp'

function bindReactComponent(Component, containerId) {
  const container = document.getElementById(containerId)
  if (container) {
    const props = $(container).data('props')
    ReactDOM.render(<Component {...props} />, container)
  }
}

$(document).ready(() => {
  bindReactComponent(Autocompleter, 'add-person')
  bindReactComponent(ScreeningsApp, 'screenings-app')
  bindReactComponent(PeopleApp, 'people-app')
})
