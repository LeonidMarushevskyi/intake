import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {getPageHeaderDetailSelector} from 'selectors/pageLayoutSelectors'
import {
  getHasGenericErrorValueSelector,
  getPageErrorMessageValueSelector,
} from 'selectors/errorsSelectors'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {createScreening, submitScreening} from 'actions/screeningActions'
import {createSnapshot} from 'actions/snapshotActions'
import {clearPeople} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {PageHeader} from 'react-wood-duck'
import {isFeatureActive} from 'common/config'

export class PageLayout extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
  }

  pageHeaderButton() {
    const {
      pageHeaderButtonDisabled,
      pageHeaderButtonText,
      pageHeaderButtonOnClick,
      pageHeaderHasButton,
    } = this.props.pageHeaderDetails

    if (!pageHeaderHasButton) { return null }
    return (
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={pageHeaderButtonDisabled}
        onClick={pageHeaderButtonOnClick}
      >
        {pageHeaderButtonText}
      </button>
    )
  }

  render() {
    const {hasError, pageErrorMessage} = this.props
    const {pageHeaderTitle} = this.props.pageHeaderDetails

    return (
      <div>
        <PageHeader pageTitle={pageHeaderTitle} button={this.pageHeaderButton()}>
          {(hasError) && <PageError pageErrorMessage={pageErrorMessage} />}
        </PageHeader>
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
  hasError: PropTypes.bool,
  pageErrorMessage: PropTypes.string,
  pageHeaderDetails: PropTypes.shape({
    pageHeaderButtonDisabled: PropTypes.bool,
    pageHeaderButtonText: PropTypes.string,
    pageHeaderButtonOnClick: PropTypes.func,
    pageHeaderHasButton: PropTypes.bool,
    pageHeaderLocation: PropTypes.string,
    pageHeaderTitle: PropTypes.string,
  }),
  params: PropTypes.object,
}
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({
    fetchSystemCodesAction,
    createScreening,
    createSnapshot,
    submitScreening,
    clearPeople,
    clearHistoryOfInvolvement,
  }, dispatch),
})

const mergeProps = (stateProps, {actions}, ownProps) => {
  const {pageHeaderDetails: {pageHeaderLocation}} = stateProps
  let pageHeaderButtonOnClick
  if (pageHeaderLocation === 'dashboard') {
    pageHeaderButtonOnClick = isFeatureActive('release_two') ? actions.createSnapshot : actions.createScreening
  } else if (pageHeaderLocation === 'screening') {
    pageHeaderButtonOnClick = () => actions.submitScreening(ownProps.params.id)
  } else if (pageHeaderLocation === 'snapshot') {
    pageHeaderButtonOnClick = () => {
      actions.createSnapshot()
      actions.clearPeople()
      actions.clearHistoryOfInvolvement()
    }
  }
  const pageHeaderDetails = {...stateProps.pageHeaderDetails, pageHeaderButtonOnClick}
  const children = ownProps.children
  return {...stateProps, pageHeaderDetails, actions, children}
}

const mapStateToProps = (state, ownProps) => ({
  hasError: getHasGenericErrorValueSelector(state),
  pageErrorMessage: getPageErrorMessageValueSelector(state),
  pageHeaderDetails: getPageHeaderDetailSelector(ownProps.location.pathname, state),
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PageLayout)

