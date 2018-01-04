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
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {PageHeader} from 'react-wood-duck'

export class PageLayout extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
  }

  pageHeaderButton() {
    const {
      pageHeaderButtonDisabled,
      pageHeaderButtonText,
      pageHeaderHasButton,
      pageHeaderLocation,
    } = this.props.pageHeaderDetails

    if (!pageHeaderHasButton) { return null }
    return (
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={pageHeaderButtonDisabled}
        onClick={() => {
          if (pageHeaderLocation === 'dashboard') {
            this.props.actions.createScreening()
          } else if (pageHeaderLocation === 'screening') {
            this.props.actions.submitScreening(this.props.params.id)
          }
        }}
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
  pageHeaderDetails: PropTypes.object.isRequired,
  params: PropTypes.object,
}
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({fetchSystemCodesAction, createScreening, submitScreening}, dispatch),
})

const mapStateToProps = (state, ownProps) => ({
  hasError: getHasGenericErrorValueSelector(state),
  pageErrorMessage: getPageErrorMessageValueSelector(state),
  pageHeaderDetails: getPageHeaderDetailSelector(ownProps.location.pathname, state),
})

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout)

