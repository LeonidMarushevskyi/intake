import ResponseTime from 'ResponseTime'
import React from 'react'
import {browserHistory} from 'react-router'

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

  render() {
    var responseTimes = this.valueAsArray(this.props.query['response_times[]'])

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
                      query: {'response_times[]': newResponseTimes},
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
}

ReferralsFilter.propTypes = {
  query: React.PropTypes.object,
}

ReferralsFilter.defaultProps = {
  query: {},
}
