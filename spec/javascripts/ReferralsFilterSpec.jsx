import React from 'react'
import ReferralsFilter from 'ReferralsFilter'
import {render, mount} from 'enzyme'

describe('ReferralsFilter', () => {
  describe('render', () => {
    it('renders Response Times', () => {
      const view = render(<ReferralsFilter />)
      expect(view.text()).toContain('Response Time')
      expect(view.text()).toContain('Immediate')
      expect(view.text()).toContain('Within 24 hours')
      expect(view.text()).toContain('More than 24 hours')
    })

    it('renders selected filters', () => {
      const query = { 'response_times[]': ['immediate', 'more_than_twenty_four_hours'] }
      const view = render(<ReferralsFilter query={query} />)
      expect(view.find('input')[0].attribs.checked).toBeDefined()
      expect(view.find('input')[1].attribs.checked).not.toBeDefined()
      expect(view.find('input')[2].attribs.checked).toBeDefined()
    })
  })
})
