import React from 'react'

export default class CrossReportEditView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card edit double-gap-top' id='cross-report-card'>
        <div className='card-header'>
          <span>Cross Report</span>
        </div>
        <div className='card-body no-pad-top' />
      </div>
    )
  }
}
