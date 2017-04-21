import EditLink from 'components/common/EditLink'
import React from 'react'
import ShowField from 'components/common/ShowField'

export default class WorkerSafetyShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card show double-gap-top' id='worker-safety-card'>
        <div className='card-header'>
          <span>Worker Safety</span>
          <EditLink ariaLabel='Edit worker safety' onClick={this.props.onEdit} />
        </div>
        <div className='card-body'>
          <div className='row'>
            <ShowField gridClassName='col-md-12' label='Worker safety alerts'>
              {}
            </ShowField>
          </div>
          <div className='row'>
            <ShowField gridClassName='col-md-6' labelClassName='no-gap' label='Additional safety information'>
              {}
            </ShowField>
          </div>
        </div>
      </div>
    )
  }
}

WorkerSafetyShowView.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
}
