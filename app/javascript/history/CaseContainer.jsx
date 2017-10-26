import {connect} from 'react-redux'
import CaseView from 'history/CaseView'
import {
  getCaseAtIndexSelector,
  getFormattedParentNamesSelector,
  getRestrictedAccessStatusSelector,
  getStatusAndServiceComponentStringSelector,
} from 'selectors/historyOfInvolvementCaseSelectors'
import {dateRangeFormatter} from 'utils/dateFormatter'
import nameFormatter from 'utils/nameFormatter'

const mapStateToProps = (state, {index}) => {
  const hoiCase = getCaseAtIndexSelector(state, index)
  return {
    caseId: hoiCase.getIn(['legacy_descriptor', 'legacy_ui_id']),
    county: hoiCase.get('county_name'),
    dateRange: dateRangeFormatter(hoiCase.toJS()),
    focusChild: nameFormatter(hoiCase.get('focus_child').toJS()),
    parents: getFormattedParentNamesSelector(state, index),
    restrictedAccessStatus: getRestrictedAccessStatusSelector(state, index),
    status: getStatusAndServiceComponentStringSelector(state, index),
    worker: nameFormatter({name_default: '', ...hoiCase.get('assigned_social_worker').toJS()}),
  }
}

export default connect(mapStateToProps)(CaseView)
