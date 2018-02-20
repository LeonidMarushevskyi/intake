import React from 'react'
import PropTypes from 'prop-types'
import DateField from 'common/DateField'
import SelectField from 'common/SelectField'
import CheckboxField from 'common/CheckboxField'
import FormField from 'common/FormField'
import PageHeader from 'common/PageHeader'

class ContactForm extends React.Component {
  componentDidMount() {
    const {
      id,
      investigationId,
      actions: {build, edit},
    } = this.props
    if (id) {
      edit({investigation_id: investigationId, id})
    } else {
      build({investigation_id: investigationId})
    }
  }
  render() {
    const {
      actions: {
        deselectPerson,
        save,
        selectPerson,
        setField,
        touchAllFields,
        touchField,
      },
      communicationMethod,
      communicationMethods,
      errors,
      hasCancel,
      id,
      inPersonCode,
      investigationId,
      location,
      locations,
      note,
      officeLocationCode,
      onCancel,
      pageTitle,
      people,
      purpose,
      purposes,
      selectedPeopleIds,
      startedAt,
      status,
      statuses,
      valid,
    } = this.props
    const onSubmit = (event) => {
      event.preventDefault()
      if (valid) {
        save({
          id,
          investigation_id: investigationId,
          started_at: startedAt,
          communication_method: communicationMethod,
          location,
          status,
          note,
          purpose,
          people: selectedPeopleIds,
        })
      } else {
        touchAllFields()
      }
    }
    const peopleAriaLabel = people.map((_person, index) => `person_${index}`).join(' ')
    return (
      <div>
        <div>
          <PageHeader pageTitle={pageTitle} button={null} />
        </div>
        <div className='container'>
          <div className='card show double-gap-top'>
            <div className='card-header'>
              <span>{`Contact - Investigation ${investigationId}`}</span>
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
                        value={startedAt}
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
                        value={communicationMethod}
                        onChange={({target: {value}}) => {
                          setField('communication_method', value)
                          if (value === inPersonCode) {
                            setField('location', null)
                          } else {
                            setField('location', officeLocationCode)
                          }
                        }}
                        onBlur={() => touchField('communication_method')}
                        errors={errors.communication_method}
                      >
                        <option key='' value='' />
                        {communicationMethods.map(({code, value}) => <option key={code} value={code}>{value}</option>)}
                      </SelectField>
                    </div>
                    { communicationMethod === inPersonCode &&
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
                      <FormField gridClassName='col-md-12' label='People Present' htmlFor={peopleAriaLabel} errors={errors.people}>
                        <ul className='unstyled-list'>
                          {
                            people.map((person, index) =>
                              <li key={index}>
                                <CheckboxField
                                  key={`person_${index}`}
                                  id={`person_${index}`}
                                  value={person.name}
                                  label={person.name}
                                  checked={person.selected}
                                  onChange={({target: {checked}}) => {
                                    if (checked === true) {
                                      return selectPerson(index)
                                    } else {
                                      return deselectPerson(index)
                                    }
                                  }}
                                />
                              </li>
                            )
                          }
                        </ul>
                      </FormField>
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
                      <FormField htmlFor='note' gridClassName='col-md-12' label='Contact Notes (Optional)'>
                        <textarea id='note' onChange={(event) => setField('note', event.target.value)} value={note || ''} />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='centered'>
                    <button className='btn btn-primary' type='submit'>Save</button>
                    { hasCancel &&
                        <button
                          className='btn btn-default'
                          onClick={(event) => {
                            event.preventDefault()
                            onCancel()
                          }}
                        >Cancel</button>
                    }
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ContactForm.propTypes = {
  actions: PropTypes.object,
  communicationMethod: PropTypes.string,
  communicationMethods: PropTypes.array.isRequired,
  errors: PropTypes.object,
  hasCancel: PropTypes.bool,
  id: PropTypes.string,
  inPersonCode: PropTypes.string,
  investigationId: PropTypes.string.isRequired,
  location: PropTypes.string,
  locations: PropTypes.array.isRequired,
  note: PropTypes.string,
  officeLocationCode: PropTypes.string,
  onCancel: PropTypes.func,
  pageTitle: PropTypes.string,
  people: PropTypes.array.isRequired,
  purpose: PropTypes.string,
  purposes: PropTypes.array.isRequired,
  selectedPeopleIds: PropTypes.array,
  startedAt: PropTypes.string,
  status: PropTypes.string,
  statuses: PropTypes.array.isRequired,
  valid: PropTypes.bool,
}

ContactForm.defaultProps = {
  errors: {},
}

export default ContactForm
