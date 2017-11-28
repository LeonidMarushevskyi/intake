/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import 'babel-polyfill'
import 'jquery'
import 'common/jquery-helpers'

import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import routes from 'common/routes'

import Autocompleter from 'common/Autocompleter'

// CSS
import 'bootstrap/dist/css/bootstrap'
import 'react-wood-duck/dist/styles/application'
import '../../assets/stylesheets/helpers'
import '../../assets/stylesheets/accessibility'
import '../../assets/stylesheets/form'
import '../../assets/stylesheets/list'
import '../../assets/stylesheets/navigation'
import '../../assets/stylesheets/typography'
import 'react-select/dist/react-select.css'
import 'react-widgets/dist/css/react-widgets.css'
import '../../assets/stylesheets/multi-select'
import '../../assets/stylesheets/ie'
import '../../assets/stylesheets/google-api'
import '../../assets/stylesheets/page-error'
import '../../assets/stylesheets/shame_overrides'

if (document.getElementById('app')) {
  ReactDOM.render(routes, document.getElementById('app'))
}

if (document.getElementById('app-release-one')) {
  ReactDOM.render(
    <div>
      <label className='no-gap' htmlFor='people'>People</label>
      <Autocompleter id='people' />
    </div>,
    document.getElementById('app-release-one')
  )
}
