import React from 'react'
import PropTypes from 'prop-types'
import DateField from 'common/DateField'
import SelectField from 'common/SelectField'
import FormField from 'common/FormField'

class Contact extends React.Component {
  componentDidMount() {
    const {investigationId, actions: {build}} = this.props
    build({investigation_id: investigationId})
  }
  render() {
    const {
      investigationId,
      contact: {started_at, communication_method, location, status, note, purpose},
      actions: {setField, touchField, create},
      statuses,
      purposes,
      communicationMethods,
      locations,
      errors,
      inPersonCode,
    } = this.props
    const onSubmit = (event) => {
      event.preventDefault()
      create(this.props.contact)
    }
    return (
      <div className='card show double-gap-top'>
        <div className='card-header'>
          <span>{`New Contact - Investigation ${investigationId}`}</span>
        </div>
        <div className='card-body'>
          <form onSubmit={onSubmit}>
            <div className='row'>
              <div className='col-md-6'>
                <div className='row'>
                  <DateField
                    gridClassName='col-md-12'
                    id='started_at'
                    label='Date/Time'
                    value={started_at}
                    onChange={(value) => setField('started_at', value)}
                    onBlur={() => touchField('started_at')}
                    errors={errors.started_at}
                  />
                </div>
                <div className='row'>
                  <SelectField
                    gridClassName='col-md-12'
                    id='communication_method'
                    label='Communication Method'
                    value={communication_method}
                    onChange={(event) => setField('communication_method', event.target.value)}
                    onBlur={() => touchField('communication_method')}
                    errors={errors.communication_method}
                  >
                    <option key='' value='' />
                    {communicationMethods.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
                  </SelectField>
                </div>
                { communication_method === inPersonCode &&
                  <div className='row'>
                    <SelectField
                      gridClassName='col-md-12'
                      id='location'
                      label='Location'
                      value={location}
                      onChange={(event) => setField('location', event.target.value)}
                      onBlur={() => touchField('location')}
                      errors={errors.location}
                    >
                      <option key='' value='' />
                      {locations.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
                    </SelectField>
                  </div>
                }
                <div className='row'>
                  <SelectField
                    gridClassName='col-md-12'
                    id='status'
                    label='Status'
                    value={status}
                    onChange={(event) => setField('status', event.target.value)}
                    onBlur={() => touchField('status')}
                    errors={errors.status}
                  >
                    <option key='' value='' />
                    {statuses.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
                  </SelectField>
                </div>
                <div className='row'>
                  <SelectField
                    gridClassName='col-md-12'
                    id='purpose'
                    label='Purpose'
                    value={purpose}
                    onChange={(event) => setField('purpose', event.target.value)}
                    onBlur={() => touchField('purpose')}
                    errors={errors.purpose}
                  >
                    <option key='' value='' />
                    {purposes.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
                  </SelectField>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='row'>
                  <FormField id='note' gridClassName='col-md-12' label='Contact Notes (Optional)'>
                    <textarea id='note' onChange={(event) => setField('note', event.target.value)}>
                      {note}
                    </textarea>
                  </FormField>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='centered'>
                <button className='btn btn-primary' type='submit'>Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

Contact.propTypes = {
  actions: PropTypes.object,
  communicationMethods: PropTypes.array.isRequired,
  contact: PropTypes.object,
  errors: PropTypes.object,
  inPersonCode: PropTypes.string,
  investigationId: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired,
  purposes: PropTypes.array.isRequired,
  statuses: PropTypes.array.isRequired,
}

Contact.defaultProps = {
  errors: {},
}

export default Contact
