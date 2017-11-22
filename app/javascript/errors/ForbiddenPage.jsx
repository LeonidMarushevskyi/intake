import React from 'react'
import {Link} from 'react-router'

const ForbiddenPage = () => (
  <div className='error-panel centered'>
    <h4>
      <i className='fa fa-warning c-red gap-right'/>
      This page is restricted.
    </h4>
    <div className='gap-top'>
      <span>You don&apos;t have the appropriate permissions to view this page.</span>
      <br/>
      <Link to='/'>Return to your dashboard</Link>
      <span>.</span>
    </div>
  </div>
)

export default ForbiddenPage
