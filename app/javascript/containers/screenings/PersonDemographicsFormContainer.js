import {connect} from 'react-redux'
import {
  getIsApproximateAgeDisabledSelector,
  getPersonDemographicsSelector,
  getApproximateAgeUnitOptionsSelector,
  getLanguageOptionsSelector,
  getGenderOptionsSelector,
} from 'selectors/screening/peopleFormSelectors'
import {setField} from 'actions/peopleFormActions'
import {MAX_LANGUAGES} from 'common/LanguageInfo'
import PersonDemographicsForm from 'views/people/PersonDemographicsForm'

const mapStateToProps = (state, {personId}) => (
  {
    approximateAgeUnitOptions: getApproximateAgeUnitOptionsSelector().toJS(),
    approximateAgeIsDisabled: getIsApproximateAgeDisabledSelector(state, personId),
    genderOptions: getGenderOptionsSelector().toJS(),
    languageOptions: getLanguageOptionsSelector().toJS(),
    ...getPersonDemographicsSelector(state, personId).toJS(),
  }

)

const mergeProps = (selectedProps, {dispatch}) => {
  const onChange = (field, value) => {
    const newValue = field === 'languages' ?
      value.slice(0, MAX_LANGUAGES).map((languages) => languages.value) || [] : value
    dispatch(setField(selectedProps.personId, [field], newValue))
  }
  return {onChange, ...selectedProps}
}
export default connect(mapStateToProps, null, mergeProps)(PersonDemographicsForm)
