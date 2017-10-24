import React from 'react'
import * as IntakeConfig from 'common/config'

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div className='error-panel centered'>
        <h4>
          <i className='fa fa-warning c-red gap-right'/>
          Sorry, this is not the page you want.
        </h4>
        <div className='gap-top'>
          <span>It may have been deleted or doesn&apos;t exist. Please check the address or</span>
          <br/>
          <a href={IntakeConfig.dashboardUrl()}>return to your dashboard</a>
          <span>.</span>
        </div>
      </div>
    )
  }
}
