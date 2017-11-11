import {connect} from 'react-redux'
import RaceForm from 'views/people/PersonEthnicityForm'
import {setField} from 'actions/peopleFormActions'
import {
  getAreEthnicityFieldsDisabledForPersonSelector,
  getPersonHispanicLatinoOriginValueSelector,
  getEthnicityDetailOptionsSelector,
  getPersonEthnicityDetaiValueSelector,
} from 'selectors/screening/peopleFormSelectors'

const mapStateToProps = (state, {personId}) => (
  {
    disableFields: getAreEthnicityFieldsDisabledForPersonSelector(state, personId),
    ethnicityDetail: getPersonEthnicityDetaiValueSelector(state, personId),
    ethnicityDetailOptions: getEthnicityDetailOptionsSelector().toJS(),
    latinoOrigin: getPersonHispanicLatinoOriginValueSelector(state, personId),
    personId,
  }
)

const mergeProps = (stateProps, {dispatch}, {personId}) => (
  {
    onChange: (field, value) => { dispatch(setField(personId, ['ethnicity', field], value)) },
    ...stateProps,
  }
)

export default connect(mapStateToProps, null, mergeProps)(RaceForm)
