import {connect} from 'react-redux'
import {Relationships} from 'common/Relationships'
import {
  getPeopleSelector,
} from 'selectors/investigation/relationshipsSelectors'

const mapStateToProps = (state, _ownProps) => ({
  people: getPeopleSelector(state).toJS(),
})

export default connect(mapStateToProps)(Relationships)
