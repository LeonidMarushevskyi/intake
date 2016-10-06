import 'jquery-helpers'
import 'jquery-ujs'

import 'babel-polyfill'
import 'bootstrap'
import $ from 'jquery'
import Autocompleter from 'Autocompleter'
import React from 'react'
import ReactDOM from 'react-dom'
import ReferralsApp from 'ReferralsApp'

function bindReactComponent(Component, containerId) {
  const container = document.getElementById(containerId)
  if (container) {
    const props = $(container).data('props')
    ReactDOM.render(<Component {...props} />, container)
  }
}

$(document).ready(() => {
  bindReactComponent(Autocompleter, 'add-person')
  bindReactComponent(ReferralsApp, 'referrals-app')
})
