import * as Validator from 'utils/validator'
import CrossReportFormContainer from 'screenings/crossReports/CrossReportFormContainer'
import CrossReportShowContainer from 'screenings/crossReports/CrossReportShowContainer'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import {
  AGENCY_TYPES,
  ALLEGATIONS_REQUIRE_CROSS_REPORTS_MESSAGE,
  CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS,
  LAW_ENFORCEMENT,
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'

export default class CrossReportCardView extends React.Component {
  constructor(props) {
    super(props)
    this.toggleShow = this.toggleShow.bind(this)
    this.isAgencyChecked = this.isAgencyChecked.bind(this)
    this.isAgencyRequired = this.isAgencyRequired.bind(this)
    this.onEvent = this.onEvent.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.validateField = this.validateField.bind(this)
    this.fieldValidations = Immutable.fromJS({
      [LAW_ENFORCEMENT]: {
        agency_type: [{
          rule: 'isRequiredIf',
          message: 'Please indicate cross-reporting to law enforcement.',
          condition: () => this.isAgencyRequired(LAW_ENFORCEMENT),
        }],
        agency_code: [{
          rule: 'isRequiredIf',
          message: 'Please enter an agency name.',
          condition: () => this.isAgencyChecked(LAW_ENFORCEMENT),
        }],
        communication_method: [{
          rule: 'isRequiredIf',
          message: 'Please select cross-report communication method.',
          condition: () => this.isAgencyChecked(LAW_ENFORCEMENT),
        }],
        reported_on: [{
          rule: 'isRequiredIf',
          message: 'Please enter a cross-report date.',
          condition: () => this.isAgencyChecked(LAW_ENFORCEMENT),
        }],
      },
      [DISTRICT_ATTORNEY]: {
        agency_type: [{
          rule: 'isRequiredIf',
          message: 'Please indicate cross-reporting to district attorney.',
          condition: () => this.isAgencyRequired(DISTRICT_ATTORNEY),
        }],
        agency_code: [{
          rule: 'isRequiredIf',
          message: 'Please enter an agency name.',
          condition: () => this.isAgencyChecked(DISTRICT_ATTORNEY),
        }],
        communication_method: [{
          rule: 'isRequiredIf',
          message: 'Please select cross-report communication method.',
          condition: () => this.isAgencyChecked(DISTRICT_ATTORNEY),
        }],
        reported_on: [{
          rule: 'isRequiredIf',
          message: 'Please enter a cross-report date.',
          condition: () => this.isAgencyChecked(DISTRICT_ATTORNEY),
        }],
      },
      [DEPARTMENT_OF_JUSTICE]: {
        agency_code: [{
          rule: 'isRequiredIf',
          message: 'Please enter an agency name.',
          condition: () => this.isAgencyChecked(DEPARTMENT_OF_JUSTICE),
        }],
        communication_method: [{
          rule: 'isRequiredIf',
          message: 'Please select cross-report communication method.',
          condition: () => this.isAgencyChecked(DEPARTMENT_OF_JUSTICE),
        }],
        reported_on: [{
          rule: 'isRequiredIf',
          message: 'Please enter a cross-report date.',
          condition: () => this.isAgencyChecked(DEPARTMENT_OF_JUSTICE),
        }],
      },
      [COUNTY_LICENSING]: {
        agency_code: [{
          rule: 'isRequiredIf',
          message: 'Please enter an agency name.',
          condition: () => this.isAgencyChecked(COUNTY_LICENSING),
        }],
        communication_method: [{
          rule: 'isRequiredIf',
          message: 'Please select cross-report communication method.',
          condition: () => this.isAgencyChecked(COUNTY_LICENSING),
        }],
        reported_on: [{
          rule: 'isRequiredIf',
          message: 'Please enter a cross-report date.',
          condition: () => this.isAgencyChecked(COUNTY_LICENSING),
        }],
      },
      [COMMUNITY_CARE_LICENSING]: {
        agency_code: [{
          rule: 'isRequiredIf',
          message: 'Please enter an agency name.',
          condition: () => this.isAgencyChecked(COMMUNITY_CARE_LICENSING),
        }],
        communication_method: [{
          rule: 'isRequiredIf',
          message: 'Please select cross-report communication method.',
          condition: () => this.isAgencyChecked(COMMUNITY_CARE_LICENSING),
        }],
        reported_on: [{
          rule: 'isRequiredIf',
          message: 'Please enter a cross-report date.',
          condition: () => this.isAgencyChecked(COMMUNITY_CARE_LICENSING),
        }],
      },
    })

    let errors
    if (this.props.mode === 'show') {
      errors = this.validateAllCrossReports()
    } else {
      errors = Immutable.Map()
    }
    this.state = {
      mode: this.props.mode,
      errors: errors,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode === 'show') {
      this.setState({errors: this.validateAllCrossReports()})
    }
  }

  toggleShow() {
    this.setState({mode: 'show'})
  }

  isAgencyChecked(agencyType) {
    const result = this.props.crossReports.find((report) => report.get('agency_type') === agencyType)
    return Boolean(result)
  }

  isAgencyRequired(agencyType) {
    return CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS.includes(agencyType) && this.props.areCrossReportsRequired
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onEvent(reports, changedItemSeq) {
    const fieldName = changedItemSeq.shift()
    const agencyType = changedItemSeq.shift()
    let updatedReport
    let updatedValue
    let errors = Immutable.Map()

    switch (fieldName) {
      case 'agency_type':
        updatedReport = reports.find((report) =>
          report.get('agency_type') === agencyType
        )
        updatedValue = (updatedReport !== undefined)
        errors = this.validateField(agencyType, fieldName, updatedValue)
        break
      case 'agency_code':
        updatedReport = reports.find((report) =>
          report.get('agency_type') === agencyType
        ) || Immutable.Map()
        updatedValue = updatedReport.get('agency_code')
        errors = this.validateField(agencyType, fieldName, updatedValue)
        break
      case 'communication_method':
      case 'reported_on':
        Object.keys(AGENCY_TYPES).map((agency) => {
          updatedReport = reports.find((report) =>
            report.get('agency_type') === agency
          ) || Immutable.Map()
          updatedValue = updatedReport.get(fieldName)
          const agency_errors = this.validateField(agency, fieldName, updatedValue).get(agency)
          errors = errors.set(agency, agency_errors)
        })
    }
    this.setState({errors: errors})
  }

  onCancel() {
    this.setState({mode: 'show', errors: this.validateAllCrossReports()})
    this.props.onCancel(Immutable.fromJS(['cross_reports']))
  }

  onChange(reports, changedItemSeq) {
    let fieldErrors
    const [fieldName, agencyType] = changedItemSeq
    if (agencyType) {
      fieldErrors = this.state.errors.getIn([agencyType, fieldName]) || Immutable.fromJS([])
    } else {
      fieldErrors = this.state.errors.toSet().flatMap((item) => item.get(fieldName))
    }
    if (!fieldErrors.isEmpty()) {
      this.onEvent(reports, changedItemSeq)
    }
    this.props.onChange(['cross_reports'], reports)
  }

  onSave() {
    return this.props.onSave(Immutable.fromJS(['cross_reports'])).then(() => {
      this.setState({mode: 'show', errors: this.validateAllCrossReports()})
    })
  }

  validateField(agencyType, fieldName, value) {
    const rules = this.fieldValidations.getIn([agencyType, fieldName])
    const errors = this.state.errors.setIn([agencyType, fieldName], Validator.validateField({rules, value}))
    return errors
  }

  validateAllCrossReports() {
    const errors = {}
    this.fieldValidations.map((rules, agency) => {
      const crossReport = this.props.crossReports.find((report) =>
        report.get('agency_type') === agency
      ) || Immutable.Map()
      errors[agency] = Validator.validateAllFields({
        screening: crossReport,
        fieldValidations: rules,
      })
    })
    return Immutable.fromJS(errors)
  }

  crossReportsInclude(agencyType) {
    const present = this.props.crossReports.some((crossReport) =>
      crossReport.get('agency_type') === agencyType
    )
    return present
  }

  alertInfoMessage() {
    if (this.props.areCrossReportsRequired) {
      if (Immutable.List(CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS).every((agencyType) =>
        this.crossReportsInclude(agencyType)
      )) {
        return null
      } else {
        return ALLEGATIONS_REQUIRE_CROSS_REPORTS_MESSAGE
      }
    } else {
      return null
    }
  }

  render() {
    const {mode} = this.state
    return (
      <div className={`card ${mode} double-gap-top`} id='cross-report-card'>
        <ScreeningCardHeader
          onEdit={this.onEdit}
          title='Cross Report'
          showEdit={this.props.editable && mode === 'show'}
        />
        {mode === 'edit' && <CrossReportFormContainer toggleShow={this.toggleShow} />}
        {mode === 'show' && <CrossReportShowContainer />}
      </div>
    )
  }
}

CrossReportCardView.defaultProps = {
  allegations: Immutable.fromJS([]),
}

CrossReportCardView.propTypes = {
  actions: PropTypes.object.isRequired,
  areCrossReportsRequired: PropTypes.bool.isRequired,
  crossReports: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['edit', 'show']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
