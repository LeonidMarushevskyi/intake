import {connect} from 'react-redux'
import {Relationships} from 'investigations/Relationships'
import {
  getPeopleSelector,
} from 'selectors/relationshipsSelectors'

const mapStateToProps = (state, _ownProps) => ({
  people: getPeopleSelector(state).toJS(),
})

export default connect(mapStateToProps)(Relationships)
