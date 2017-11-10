import {connect} from 'react-redux'
import PersonInformationForm from 'views/people/PersonInformationForm'
import NAME_SUFFIXES from 'enums/NameSuffixes'
import {Map} from 'immutable'
import {getPeopleSelector, getFilteredPersonRolesSelector} from 'selectors/screening/peopleFormSelectors'
import {setField} from 'actions/peopleFormActions'
import legacySourceFormatter from 'utils/legacySourceFormatter'

const mapStateToProps = (state, {personId}) => {
  const nameSuffixOptions = Object.keys(NAME_SUFFIXES).map((value) => (
    {label: NAME_SUFFIXES[value], value}
  ))
  const person = getPeopleSelector(state).get(personId)
  const roles = person.getIn(['roles', 'value']).toJS()
  const legacySourceDescription = legacySourceFormatter(person.getIn(['legacy_descriptor', 'value'], Map()).toJS())
  return {
    personId,
    roles,
    legacySourceDescription,
    firstName: person.getIn(['first_name', 'value']),
    middleName: person.getIn(['middle_name', 'value']),
    lastName: person.getIn(['last_name', 'value']),
    nameSuffix: person.getIn(['name_suffix', 'value']),
    ssn: person.getIn(['ssn', 'value']),
    nameSuffixOptions,
    roleOptions: getFilteredPersonRolesSelector(state, personId).toJS(),
  }
}
const mergeProps = ({
  personId,
  roles,
  legacySourceDescription,
  firstName,
  middleName,
  lastName,
  nameSuffix,
  ssn,
  nameSuffixOptions,
  roleOptions,
}, {dispatch}) => {
  const onChange = (field, value) => dispatch(setField(personId, [field], value))
  return {
    personId,
    roles,
    legacySourceDescription,
    firstName,
    middleName,
    lastName,
    nameSuffix,
    ssn,
    nameSuffixOptions,
    roleOptions,
    onChange,
  }
}
export default connect(mapStateToProps, null, mergeProps)(PersonInformationForm)
