import AlertInfoMessage from 'common/AlertInfoMessage'
import CheckboxField from 'common/CheckboxField'
import CountySelectField from 'common/CountySelectField'
import DateField from 'common/DateField'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import {
  AGENCY_TYPES,
  DISTRICT_ATTORNEY,
  COMMUNICATION_METHODS,
} from 'enums/CrossReport'

class CrossReportForm extends React.Component {
  render() {
    const {
      actions: {
        fetchCountyAgencies,
        resetFieldValues,
        saveScreening,
        setAgencyTypeField,
        setField,
        touchField,
      },
      counties,
      county_id,
      countyAgencies,
      districtAttorney,
      hasAgencies,
      inform_date,
      method,
      screening,
      screeningWithEdits,
      toggleShow,
    } = this.props
    const cancel = () => {
      resetFieldValues(screening)
      toggleShow()
    }
    const save = () => {
      saveScreening(screeningWithEdits)
      toggleShow()
    }
    return (
      <div className='card-body no-pad-top'>
        { this.props.alertInfoMessage && <AlertInfoMessage message={this.props.alertInfoMessage} /> }
        <div className='row col-md-12'>
          <label>This report has cross reported to:</label>
        </div>
        <div className='row'>
          <CountySelectField
            gridClassName='col-md-6'
            id='cross_report_county'
            onChange={({target: {value}}) => {
              fetchCountyAgencies(value)
              setField('county_id', value)
            }}
            onBlur={() => touchField('county_id')}
            counties={counties}
            value={county_id}
          />
        </div>
        <div className='row gap-top'>
          <div className='col-md-6'>
            <ul className='unstyled-list'>
              <li key={DISTRICT_ATTORNEY}>
                <CheckboxField
                  id='type-DISTRICT_ATTORNEY'
                  checked={districtAttorney.selected}
                  disabled={countyAgencies[DISTRICT_ATTORNEY] === undefined || countyAgencies[DISTRICT_ATTORNEY].length === 0}
                  label={AGENCY_TYPES[DISTRICT_ATTORNEY]}
                  onChange={({target: {checked}}) => {
                    setAgencyTypeField(DISTRICT_ATTORNEY, checked)
                    touchField(DISTRICT_ATTORNEY)
                  }}
                  // required={this.props.isAgencyRequired(agencyType)}
                  value={DISTRICT_ATTORNEY}
                />
              </li>
            </ul>
          </div>
          <div className='col-md-6'>
            <ul className='unstyled-list' />
          </div>
        </div>
        <div className='row gap-top'>
          {
            hasAgencies &&
            <fieldset className='fieldset-inputs'>
              <legend>Communication Time and Method</legend>
              <DateField
                gridClassName='col-md-6'
                id='cross_report_inform_date'
                label='Cross Reported on Date'
                hasTime={false}
                onChange={({target: {value}}) => {
                  setField('inform_date', value)
                }}
                onBlur={() => touchField('inform_date')}
                required
                value={inform_date}
              />
              <SelectField
                gridClassName='col-md-6'
                id='cross_report_method'
                label='Communication Method'
                onChange={({target: {value}}) => {
                  setField('method', value)
                }}
                onBlur={() => touchField('method')}
                required
                value={method}
              >
                <option key='' />
                {COMMUNICATION_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectField>
            </fieldset>
          }
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={save}>Save</button>
            <button className='btn btn-default' onClick={cancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

CrossReportForm.propTypes = {
  actions: PropTypes.object.isRequired,
  alertInfoMessage: PropTypes.string,
  counties: PropTypes.array.isRequired,
  countyAgencies: PropTypes.object,
  county_id: PropTypes.string,
  districtAttorney: PropTypes.object.isRequired,
  errors: PropTypes.object,
  hasAgencies: PropTypes.bool.isRequired,
  inform_date: PropTypes.string,
  method: PropTypes.string,
  screening: PropTypes.object,
  screeningWithEdits: PropTypes.object,
  toggleShow: PropTypes.func.isRequired,
}

export default CrossReportForm
