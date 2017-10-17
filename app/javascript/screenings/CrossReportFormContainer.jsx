import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CrossReportForm from 'screenings/CrossReportForm'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {setField} from 'actions/crossReportFormActions'
import {saveScreening} from 'actions/screeningActions'

const mapStateToProps = (state, _ownProps) => ({
  counties: state.get('counties').toJS(),
  county: state.getIn(['crossReport', 'county_id', 'value']),
  screening: state.get('screening').toJS(),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({fetchCountyAgencies, setField, saveScreening}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CrossReportForm)
