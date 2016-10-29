import 'jquery-helpers'
import 'jquery-ujs'

import 'babel-polyfill'
import 'bootstrap'
import $ from 'jquery'
import PeopleApp from 'components/PeopleApp'
import React from 'react'
import ReactDOM from 'react-dom'
import ScreeningsApp from 'components/ScreeningsApp'

function bindReactComponent(Component, containerId) {
  const container = document.getElementById(containerId)
  if (container) {
    const props = $(container).data('props')
    ReactDOM.render(<Component {...props} />, container)
  }
}

$(document).ready(() => {
  bindReactComponent(ScreeningsApp, 'screenings-app')
  bindReactComponent(PeopleApp, 'people-app')
})
