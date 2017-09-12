import React from 'react'
import PropTypes from 'prop-types'
import DateField from 'common/DateField'

class InvestigationContact extends React.Component {
  componentDidMount() {
    const {
      investigationId,
      actions: {setContact}
    } = this.props
    setContact({investigation_id: investigationId})
  }
  render() {
    const {
      investigationId,
      contact: {started_at},
      actions: {setContact}
    } = this.props
    const onChange = (fieldValues) => setContact({...this.props.contact, ...fieldValues})
    return (
      <div className='card show double-gap-top'>
        <div className='card-header'>
          <span>{`New Contact - Investigation ${investigationId}`}</span>
        </div>
        <div className='card-body'>
          <form>
            <div className='row'>
              <DateField
                gridClassName='col-md-6'
                id='started_at'
                label='Date/Time'
                value={started_at}
                onChange={(value) => onChange({started_at: value})}
              />
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
  investigationId: PropTypes.string.isRequired,
}

export default InvestigationContact
