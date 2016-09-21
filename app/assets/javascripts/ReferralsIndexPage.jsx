import React from 'react'
import ReferralsTable from 'ReferralsTable'
import {request} from 'utils/http'

export default class ReferralsIndexPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      referrals: [],
    }
  }

  componentDidMount() {
    const xhr = request('GET', '/referrals.json', null, null)
    xhr.done((xhrResp) => {
      this.setState({referrals: xhrResp.responseJSON})
    })
  }

  render() {
    return (
      <div>
        <ReferralsTable referrals={this.state.referrals}/>
      </div>
    )
  }
}
