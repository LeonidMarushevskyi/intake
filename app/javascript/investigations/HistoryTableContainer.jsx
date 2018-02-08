import {connect} from 'react-redux'
import HistoryTable from 'views/history/HistoryTable'
import {
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
  getFormattedScreeningsSelector,
} from 'selectors/investigation/historyOfInvolvementSelectors'
import * as IntakeConfig from 'common/config'

const resetCopyStyling = (copyContent) => {
  if (window.clipboardData === undefined) {
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((el) => (el.removeAttribute('disabled')))
    copyContent.removeAttribute('style')
    document.body.removeAttribute('style')
  }
  Array.from(copyContent.querySelectorAll('table, th, td')).forEach((el) => (el.removeAttribute('style')))
}

const mapStateToProps = (state) => (
  {
    showCopyButton: IntakeConfig.jsClipboardSupported(),
    cases: getFormattedCasesSelector(state).toJS(),
    referrals: getFormattedReferralsSelector(state).toJS(),
    screenings: getFormattedScreeningsSelector(state).toJS(),
    // To make the copied table fit in MS Word, we have to temporarily restyle it.
    onCopy: (copyContent) => {
      // >= IE11 does not need this hack
      if (window.clipboardData === undefined) {
        // hack to prevent scrolling when styles disappear
        document.body.style.height = `${document.body.clientHeight}px`
        Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((el) => (el.setAttribute('disabled', 'disabled')))
        copyContent.style.width = '1%'
      }
      Array.from(copyContent.querySelectorAll('table, th, td')).forEach((el) => (el.style.border = '1px solid black'))
      Array.from(copyContent.querySelectorAll('table')).forEach((el) => {
        el.style.borderCollapse = 'collapse'
        el.style.fontSize = '12px'
      })
      return copyContent
    },
    onSuccess: (copyContent) => {
      resetCopyStyling(copyContent)
    },
    onError: (copyContent) => {
      resetCopyStyling(copyContent)
    },
  }
)

export default connect(mapStateToProps)(HistoryTable)
