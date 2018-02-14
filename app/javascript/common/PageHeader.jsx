import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {PageHeader as WoodDuckPageHeader} from 'react-wood-duck'
import PageError from 'common/PageError'
import {
  getHasGenericErrorValueSelector,
  getPageErrorMessageValueSelector,
} from 'selectors/errorsSelectors'

export const PageHeader = ({button, errorMessage, hasError, pageTitle}) => (
  <WoodDuckPageHeader pageTitle={pageTitle} button={button}>
    {hasError && <PageError pageErrorMessage={errorMessage} />}
  </WoodDuckPageHeader>
)

PageHeader.propTypes = {
  button: PropTypes.object,
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  pageTitle: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  pageTitle: ownProps.pageTitle,
  button: ownProps.button,
  hasError: getHasGenericErrorValueSelector(state),
  errorMessage: getPageErrorMessageValueSelector(state),
})

export default connect(mapStateToProps)(PageHeader)
