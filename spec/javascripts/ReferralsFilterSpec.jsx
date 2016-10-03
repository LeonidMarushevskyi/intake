import React from 'react'
import ReferralsFilter from 'ReferralsFilter'
import ResponseTimeFilter from 'ResponseTimeFilter'
import ScreeningDecisionFilter from 'ScreeningDecisionFilter'
import {mount, shallow} from 'enzyme';
import {browserHistory} from 'react-router'

describe('ReferralsFilter', () => {
  describe('render', () => {
    it('contains an ScreeningDecisionFilter component', function () {
      const wrapper = mount(<ReferralsFilter/>)
      expect(wrapper.find(ScreeningDecisionFilter).length).toEqual(1)
    });

    it('contains an ResponseTimeFilter component', function () {
      const wrapper = mount(<ReferralsFilter/>)
      expect(wrapper.find(ResponseTimeFilter).length).toEqual(1)
    });
  })

  describe('onChange', () => {
    beforeEach(() => spyOn(browserHistory, 'push'))

    it('updates browser history', () => {
      const wrapper = shallow(<ReferralsFilter/>).instance()
      wrapper.onChange({'response_times[]': ['a'], 'screening_decisions[]': ['b', 'c']})
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: '/referrals',
        query: {'response_times[]': ['a'], 'screening_decisions[]': ['b', 'c']},
      })
    })
  })
})
