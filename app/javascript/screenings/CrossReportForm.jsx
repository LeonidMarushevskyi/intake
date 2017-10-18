import AlertInfoMessage from 'common/AlertInfoMessage'
import CountySelectField from 'common/CountySelectField'
import DateField from 'common/DateField'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import AgencyField from 'screenings/crossReports/AgencyField'
import {
  COMMUNICATION_METHODS,
  COMMUNITY_CARE_LICENSING,
  COUNTY_LICENSING,
  DEPARTMENT_OF_JUSTICE,
  DISTRICT_ATTORNEY,
  LAW_ENFORCEMENT,
} from 'enums/CrossReport'

class CrossReportForm extends React.Component {
  render() {
    const {
      actions: {
        fetchCountyAgencies,
        resetFieldValues,
        saveScreening,
        setAgencyTypeField,
        setAgencyField,
        setField,
        touchAgencyField,
        touchField,
      },
      counties,
      county_id,
      countyAgencies,
      departmentOfJustice,
      districtAttorney,
      countyLicensing,
      communityCareLicensing,
      lawEnforcement,
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
    const agencyFieldActions = {
      setAgencyTypeField,
      setAgencyField,
      touchField,
      touchAgencyField,
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
                <AgencyField
                  type={DISTRICT_ATTORNEY}
                  data={districtAttorney}
                  countyAgencies={countyAgencies[DISTRICT_ATTORNEY]}
                  actions={agencyFieldActions}
                />
              </li>
              <li key={LAW_ENFORCEMENT}>
                <AgencyField
                  type={LAW_ENFORCEMENT}
                  data={lawEnforcement}
                  countyAgencies={countyAgencies[LAW_ENFORCEMENT]}
                  actions={agencyFieldActions}
                />
              </li>
            </ul>
          </div>
          <div className='col-md-6'>
            <ul className='unstyled-list'>
              <li key={DEPARTMENT_OF_JUSTICE}>
                <AgencyField
                  type={DEPARTMENT_OF_JUSTICE}
                  data={departmentOfJustice}
                  countyAgencies={countyAgencies[DEPARTMENT_OF_JUSTICE]}
                  actions={agencyFieldActions}
                />
              </li>
              <li key={COUNTY_LICENSING}>
                <AgencyField
                  type={COUNTY_LICENSING}
                  data={countyLicensing}
                  countyAgencies={countyAgencies[COUNTY_LICENSING]}
                  actions={agencyFieldActions}
                />
              </li>
              <li key={COMMUNITY_CARE_LICENSING}>
                <AgencyField
                  type={COMMUNITY_CARE_LICENSING}
                  data={communityCareLicensing}
                  countyAgencies={countyAgencies[COMMUNITY_CARE_LICENSING]}
                  actions={agencyFieldActions}
                />
              </li>
            </ul>
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
  communityCareLicensing: PropTypes.object.isRequired,
  counties: PropTypes.array.isRequired,
  countyAgencies: PropTypes.object,
  countyLicensing: PropTypes.object.isRequired,
  county_id: PropTypes.string.isRequired,
  departmentOfJustice: PropTypes.object.isRequired,
  districtAttorney: PropTypes.object.isRequired,
  errors: PropTypes.object,
  hasAgencies: PropTypes.bool.isRequired,
  inform_date: PropTypes.string,
  lawEnforcement: PropTypes.object.isRequired,
  method: PropTypes.string,
  screening: PropTypes.object,
  screeningWithEdits: PropTypes.object,
  toggleShow: PropTypes.func.isRequired,
}

export default CrossReportForm
