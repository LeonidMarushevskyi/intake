import CheckboxField from 'components/common/CheckboxField'
import CROSS_REPORT from 'CrossReport'
import InputField from 'components/common/InputField'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'

export default class CrossReportEditView extends React.Component {
  constructor(props) {
    super(props)
  }

  persistedInfo(agencyType) {
    return this.props.crossReport.toJS().find((item) => item.agency_type === agencyType)
  }

  crossReportData() {
    return CROSS_REPORT.map((agencyType) => {
      const persistedInfo = this.persistedInfo(agencyType)
      return {
        agencyType: agencyType,
        selected: Boolean(persistedInfo),
        agencyName: persistedInfo && persistedInfo.agency_name,
      }
    })
  }

  changeAgencyType(selectedType, isChecked) {
    const {crossReport} = this.props
    let newReport
    if (isChecked) {
      newReport = crossReport.push(Immutable.Map({agency_type: selectedType}))
    } else {
      newReport = crossReport.filterNot((item) => item.get('agency_type') === selectedType)
    }
    this.props.onChange(['cross_reports'], newReport)
  }

  changeAgencyName(selectedType, value) {
    const {crossReport} = this.props
    let newReport
    const index = crossReport.toJS().findIndex((item) => item.agency_type === selectedType)
    if (value) {
      newReport = crossReport.set(index, Immutable.Map({agency_type: selectedType, agency_name: value}))
    } else {
      newReport = crossReport.set(index, Immutable.Map({agency_type: selectedType}))
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
                      </li>)
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
    return (
      <div className='card edit double-gap-top' id='cross-report-card'>
        <div className='card-header'>
          <span>Cross Report</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row col-md-12'>
            <label>Cross reported to</label>
          </div>
          <div className='row gap-top'>
            {this.renderCrossReport(crossReportData.slice(startIndex, halfIndex))}
            {this.renderCrossReport(crossReportData.slice(halfIndex))}
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
  crossReport: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
