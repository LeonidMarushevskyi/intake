import React from 'react'
import ReferralsFilter from 'ReferralsFilter'
import ReferralsTable from 'ReferralsTable'
import * as Utils from 'utils/http'

export default class ReferralsIndexPage extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      referrals: [],
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  componentDidMount() {
    this.updateIndex()
  }

  componentDidUpdate(prevProps, _prevState) {
    if (prevProps.location !== this.props.location) {
      this.updateIndex()
    }
  }

  updateIndex() {
    const {pathname, search} = this.props.location
    const url = `${pathname}.json${search}`
    const xhr = Utils.request('GET', url, null, null)
    xhr.done((xhrResp) => {
      this.setState({referrals: xhrResp.responseJSON})
    })
  }

  render() {
    const {query} = this.props.location
    return (
      <div>
        <div className='col-md-3'>
          <ReferralsFilter query={query} />
        </div>
        <div className='col-md-9'>
          <ReferralsTable referrals={this.state.referrals} />
        </div>
      </div>
    )
  }
}

ReferralsIndexPage.propTypes = {
  location: React.PropTypes.object,
}
