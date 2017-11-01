import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import SAFETY_ALERT from 'enums/SafetyAlert'
import Select from 'react-select'
import selectOptions from 'utils/selectHelper'

export default class WorkerSafetyEditView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-12'>
            <label htmlFor='safety_alerts'>Worker safety alerts</label>
            <Select
              multi
              tabSelectsValue={false}
              inputProps={{id: 'safety_alerts'}}
              options={selectOptions(SAFETY_ALERT)}
              value={this.props.safetyAlerts.toJS()}
              onChange={
                (alerts) => this.props.onChange(['safety_alerts'],
                  Immutable.List(alerts.map((alert) => alert.value)) || [])
              }
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <label className='no-gap' htmlFor='safety_information'>Additional safety information</label>
            <textarea
              id='safety_information'
              onChange={(event) => this.props.onChange(['safety_information'], event.target.value || null)}
              value={this.props.safetyInformation || ''}
            />
          </div>
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={this.props.onSave}>Save</button>
            <button className='btn btn-default' onClick={this.props.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

WorkerSafetyEditView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  safetyAlerts: PropTypes.object,
  safetyInformation: PropTypes.string,
}
