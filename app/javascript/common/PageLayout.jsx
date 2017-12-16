import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {
  getHasGenericErrorValueSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {PageHeader} from 'react-wood-duck'

export class PageLayout extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
  }

  render() {
    const {errorCount, hasError, pageTitle} = this.props
    return (
      <div>
        <PageHeader pageTitle={pageTitle} />
        {(hasError) && <PageError errorCount={errorCount} />}
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

PageLayout.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  errorCount: PropTypes.number,
  hasError: PropTypes.bool,
  pageTitle: PropTypes.string,
}
const mapStateToProps = (state) => ({
  errorCount: getTotalScreeningSubmissionErrorValueSelector(state),
  hasError: getHasGenericErrorValueSelector(state) || Boolean(getTotalScreeningSubmissionErrorValueSelector(state)),
  pageTitle: 'testing title',
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({fetchSystemCodesAction}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout)

