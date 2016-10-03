import ResponseTime from 'ResponseTime'
import React from 'react'
import {browserHistory} from 'react-router'
import ScreeningDecision from 'ScreeningDecision'

export default class ReferralsFilter extends React.Component {
  constructor() {
    super(...arguments)
  }

  valueAsArray(queryValue) {
    if (queryValue) {
      return [].concat(queryValue)
    } else {
      return []
    }
  }

  responseTimeFilter() {
    var responseTimes = this.valueAsArray(this.props.query['response_times[]'])
    var screeningDecisions = this.valueAsArray(this.props.query['screening_decisions[]'])

    return (
      <fieldset className='fieldset-inputs sans'>
        <legend>Response Time</legend>
        <ul className='unstyled-list'>
          {
            Object.keys(ResponseTime).map((responseTime) => (
              <li key={responseTime}>
                <input
                  id={`response-time-${responseTime}`}
                  type='checkbox'
                  checked={(responseTimes || []).includes(responseTime)}
                  onChange={(event) => {
                    let newResponseTimes
                    if (event.target.checked) {
                      newResponseTimes = responseTimes.concat(responseTime)
                    } else {
                      newResponseTimes = responseTimes.filter((ele) => ele !== responseTime)
                    }
                    browserHistory.push({
                      pathname: '/referrals',
                      query: {'response_times[]': newResponseTimes, 'screening_decisions[]': screeningDecisions},
                    })
                  }}
                />
                <label htmlFor={`response-time-${responseTime}`}>{ResponseTime[responseTime]}</label>
              </li>
              ))
          }
        </ul>
      </fieldset>
    )
  }

  screeningDecisionFilter() {
    var responseTimes = this.valueAsArray(this.props.query['response_times[]'])
    var screeningDecisions = this.valueAsArray(this.props.query['screening_decisions[]'])

    return (
      <fieldset className='fieldset-inputs sans'>
        <legend>Decision</legend>
        <ul className='unstyled-list'>
          {
            Object.keys(ScreeningDecision).map((screeningDecision) => (
              <li key={screeningDecision}>
                <input
                  id={`screening-decision-${screeningDecision}`}
                  type='checkbox'
                  checked={(screeningDecisions || []).includes(screeningDecision)}
                  onChange={(event) => {
                    let newScreeningDecisions
                    if (event.target.checked) {
                      newScreeningDecisions = screeningDecisions.concat(screeningDecision)
                    } else {
                      newScreeningDecisions = screeningDecisions.filter((ele) => ele !== screeningDecision)
                    }
                    browserHistory.push({
                      pathname: '/referrals',
                      query: {'response_times[]': responseTimes, 'screening_decisions[]': newScreeningDecisions},
                    })
                  }}
                />
                <label htmlFor={`screening-decision-${screeningDecision}`}>{ScreeningDecision[screeningDecision]}</label>
              </li>
              ))
          }
        </ul>
      </fieldset>
    )
  }

  render() {
    return (
      <div>
        {this.responseTimeFilter()}
        {this.screeningDecisionFilter()}
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
