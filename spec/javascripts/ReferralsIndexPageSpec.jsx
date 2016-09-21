import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import ReferralsIndexPage from 'ReferralsIndexPage'
import ReferralsTable from 'ReferralsTable'
import TestUtils from 'react-addons-test-utils'

describe('ReferralsIndexPage', () => {
  it('renders ReferralsTable', () => {
    const view = TestUtils.renderIntoDocument(<ReferralsIndexPage />)
    const tables = TestUtils.scryRenderedComponentsWithType(view, ReferralsTable)
    expect(tables.length).toEqual(1)
  })
})
