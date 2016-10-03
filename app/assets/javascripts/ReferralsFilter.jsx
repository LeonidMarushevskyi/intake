import React from 'react'
import {browserHistory} from 'react-router'
import ResponseTimeFilter from 'ResponseTimeFilter'
import ScreeningDecisionFilter from 'ScreeningDecisionFilter'

export default class ReferralsFilter extends React.Component {
  constructor() {
    super(...arguments)
    this.onChange = this.onChange.bind(this)
  }

  valueAsArray(queryValue) {
    if (queryValue) {
      return [].concat(queryValue)
    } else {
      return []
    }
  }

  onChange(query) {
    browserHistory.push({
      pathname: '/referrals',
      query: query,
    })
  }

  render() {
    var responseTimes = this.valueAsArray(this.props.query['response_times[]'])
    var screeningDecisions = this.valueAsArray(this.props.query['screening_decisions[]'])
    return (
      <div>
        <ResponseTimeFilter
          selected={responseTimes}
          onChange={(newResponseTimes) => this.onChange({
            'response_times[]': newResponseTimes,
            'screening_decisions[]': screeningDecisions,
          })}
        />
        <ScreeningDecisionFilter
          selected={screeningDecisions}
          onChange={(newScreeningDecisions) => this.onChange({
            'response_times[]': responseTimes,
            'screening_decisions[]': newScreeningDecisions,
          })}
        />
      </div>
    )
  }
}

ReferralsFilter.propTypes = {
  query: React.PropTypes.object,
}

ReferralsFilter.defaultProps = {
  query: {},
}
