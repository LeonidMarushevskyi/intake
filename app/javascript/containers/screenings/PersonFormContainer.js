import {connect} from 'react-redux'
import PersonForm from 'views/people/PersonForm'
import {ROLE_TYPE} from 'enums/RoleType'
import NAME_SUFFIXES from 'enums/NameSuffixes'
import {Map} from 'immutable'
import {getPeopleSelector} from 'selectors/peopleFormSelectors'
import legacySourceFormatter from 'utils/legacySourceFormatter'

const mapStateToProps = (state, {personId}) => {
  const roleOptions = ROLE_TYPE.map((value) => ({label: value, value}))
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
    nameSuffixOptions,
    roleOptions,
  }
}
export default connect(mapStateToProps)(PersonForm)
