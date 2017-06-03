import CheckboxField from 'components/common/CheckboxField'
import DateField from 'components/common/DateField'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'components/common/SelectField'
import {AGENCY_TYPES, COMMUNICATION_METHODS} from 'CrossReport'

export default class CrossReportEditView extends React.Component {
  constructor(props) {
    super(props)
  }

  persistedInfo(agencyType) {
    return this.props.crossReports.toJS().find((item) => item.agency_type === agencyType)
  }

  crossReportData() {
    return AGENCY_TYPES.map((agencyType) => {
      const persistedInfo = this.persistedInfo(agencyType)
      return {
        agencyType: agencyType,
        selected: Boolean(persistedInfo),
        agencyName: persistedInfo && persistedInfo.agency_name,
      }
    })
  }

  changeAgencyType(selectedType, isChecked) {
    const {crossReports} = this.props
    let newReport
    if (isChecked) {
      newReport = crossReports.push(Immutable.Map({agency_type: selectedType}))
    } else {
      newReport = crossReports.filterNot((item) => item.get('agency_type') === selectedType)
    }
    this.props.onChange(['cross_reports'], newReport)
  }

  changeAgencyName(selectedType, value) {
    const {crossReports} = this.props
    let newReport
    const index = crossReports.toJS().findIndex((item) => item.agency_type === selectedType)
    if (value) {
      newReport = crossReports.set(index, Immutable.Map({agency_type: selectedType, agency_name: value}))
    } else {
      newReport = crossReports.set(index, Immutable.Map({agency_type: selectedType}))
    }
    this.props.onChange(['cross_reports'], newReport)
  }

  renderCrossReport(crossReportOptions) {
    return (
        <div className='col-md-6'>
          <ul className='unstyled-list'>
            {
              crossReportOptions.map((item) => {
                const {agencyType, selected, agencyName} = item
                const typeId = agencyType.replace(/ /gi, '_')
                return (
                  <li key={agencyType}>
                    <div className='half-gap-bottom'>
                      <CheckboxField
                        id={`type-${typeId}`}
                        value={agencyType}
                        checked={selected}
                        onChange={(event) => this.changeAgencyType(agencyType, event.target.checked)}
                      />
                      {
                        selected &&
                          <InputField
                            id={`${typeId}-agency-name`}
                            label={`${agencyType} agency name`}
                            labelClassName='hidden'
                            maxLength='128'
                            onChange={(event) => this.changeAgencyName(agencyType, event.target.value)}
                            placeholder='Agency Name'
                            value={agencyName || ''}
                          />
                      }
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
    )
  }

  render() {
    const crossReportData = this.crossReportData()
    const startIndex = 0
    const halfIndex = 2
    const hasCrossReport = !this.props.crossReport.isEmpty()
    return (
      <div className='card edit double-gap-top' id='cross-report-card'>
        <div className='card-header'>
          <span>Cross Report</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row col-md-12'>
            <label>This report has cross reported to:</label>
          </div>
          <div className='row gap-top'>
            {this.renderCrossReport(crossReportData.slice(startIndex, halfIndex))}
            {this.renderCrossReport(crossReportData.slice(halfIndex))}
          </div>
          <div className='row gap-top'>
            {
              hasCrossReport &&
                <fieldset className='fieldset-inputs'>
                  <legend>Communication Time and Method</legend>
                  <DateField
                    gridClassName='col-md-6'
                    id='cross_report_reported_on'
                    label='Cross Reported on Date'
                  />
                  <SelectField
                    gridClassName='col-md-6'
                    id='cross_report_communication_method'
                    label='Communication Method'
                  >
                    <option key='' value='' />
                    {COMMUNICATION_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </SelectField>
                </fieldset>
            }
          </div>
          <div className='row'>
            <div className='centered'>
              <button className='btn btn-primary' onClick={this.props.onSave}>Save</button>
              <button className='btn btn-default' onClick={this.props.onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CrossReportEditView.propTypes = {
  crossReports: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
