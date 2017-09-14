import React from 'react'
import PropTypes from 'prop-types'
import DateField from 'common/DateField'
import SelectField from 'common/SelectField'

class InvestigationContact extends React.Component {
  componentDidMount() {
    const {
      investigationId,
      actions: {setContact},
    } = this.props
    setContact({investigation_id: investigationId})
  }
  render() {
    const {
      investigationId,
      contact: {started_at, status},
      actions: {setContactField, touchContactField},
      statuses,
      errors,
    } = this.props

    return (
      <div className='card show double-gap-top'>
        <div className='card-header'>
          <span>{`New Contact - Investigation ${investigationId}`}</span>
        </div>
        <div className='card-body'>
          <form>
            <div className='row'>
              <DateField
                gridClassName='col-md-12'
                id='started_at'
                label='Date/Time'
                value={started_at}
                onChange={(value) => setContactField('started_at', value)}
                onBlur={() => touchContactField('started_at')}
                errors={errors.started_at}
              />
            </div>
            <div className='row'>
              <SelectField
                gridClassName='col-md-12'
                id='status'
                label='Status'
                value={status}
                onChange={(event) => setContactField('status', event.target.value)}
              >
                <option key='' value='' />
                {statuses.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
              </SelectField>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

InvestigationContact.propTypes = {
  actions: PropTypes.object,
  contact: PropTypes.object,
  errors: PropTypes.object,
  investigationId: PropTypes.string.isRequired,
  statuses: PropTypes.array.isRequired,
}

InvestigationContact.defaultProps = {
  errors: {},
}

export default InvestigationContact
