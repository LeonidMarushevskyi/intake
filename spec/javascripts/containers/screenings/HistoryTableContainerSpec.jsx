import HistoryTableContainer from 'containers/screenings/HistoryTableContainer'
import React from 'react'
import {createMockStore} from 'redux-test-utils'
import {fromJS} from 'immutable'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('HistoryTableContainer', () => {
  const state = fromJS({
    involvements: {
      screenings: [
        {
          id: '1234',
          start_date: '2017-12-02',
          end_date: '2017-12-02',
          county: {
            id: '1101',
            description: 'Sacramento',
          },
          decision: 'promote to referral',
          decision_detail: 'drug counseling',
          reporter: {
            id: 'jhgjhgjh',
            first_name: 'Reporter First Name',
            last_name: 'Reporter Last Name',
            role: 'MANDATED_REPORTER',
            legacy_descriptor: {
              legacy_id: 'jhgjhgjh',
              legacy_ui_id: 'jhgjhgjh-hohj-jkj',
              legacy_last_updated: '2017-12-03T09:11:22.204-0800',
              legacy_table_name: 'REPTR_T',
              legacy_table_description: 'Reporter',
            },
          },
          assigned_social_worker: {
            id: 'jhgguhgjh',
            first_name: 'Worker First Name',
            last_name: 'Worker Last Name',
            legacy_descriptor: {
              legacy_id: 'jhgguhgjh',
              legacy_ui_id: 'jhgguhgjh-hohj-jkj',
              legacy_last_updated: '2017-12-03T09:11:22.091-0800',
              legacy_table_name: 'STFPERST',
              legacy_table_description: 'Staff',
            },
          },
          all_people: [
            {
              id: 'bbbbbbbbb',
              first_name: 'John',
              last_name: 'S',
              legacy_descriptor: {
                legacy_id: 'bbbbbbbbb',
                legacy_ui_id: 'bbbbbbbbb-hohj-jkj',
                legacy_last_updated: '2017-12-03T09:11:22.204-0800',
                legacy_table_name: 'CLIENT_T',
                legacy_table_description: 'Client',
              },
            },
            {
              id: 'aaaaaaa',
              first_name: 'Jane',
              last_name: 'S',
              legacy_descriptor: {
                legacy_id: 'aaaaaaaaa',
                legacy_ui_id: 'aaaaaaaaa-hohj-jkj',
                legacy_last_updated: '2017-12-03T09:11:22.204-0800',
                legacy_table_name: 'CLIENT_T',
                legacy_table_description: 'Client',
              },
            },
          ],
        },
      ],
      cases: [
        {
          id: 'ccccccccc',
          start_date: '2017-12-02',
          end_date: '2017-12-02',
          county: {
            id: '1101',
            description: 'Sacramento',
          },
          service_component: {
            id: '1695',
            description: 'Permanent Placement',
          },
          focus_child: {
            id: 'iiiiiii',
            first_name: 'Victim First Name',
            last_name: 'Victim Last Name',
            legacy_descriptor: {
              legacy_id: 'iiiiiii',
              legacy_ui_id: 'iiiiiii-hohj-jkj',
              legacy_last_updated: '2017-12-03T11:59:42.715-0800',
              legacy_table_name: 'CLIENT_T',
              legacy_table_description: 'Client',
            },
            limited_access_code: 'SEALED',
          },
          assigned_social_worker: {
            id: 'jhgguhgjh',
            first_name: 'Worker First Name',
            last_name: 'Worker Last Name',
            legacy_descriptor: {
              legacy_id: 'jhgguhgjh',
              legacy_ui_id: 'jhgguhgjh-hohj-jkj',
              legacy_last_updated: '2017-12-03T11:59:42.631-0800',
              legacy_table_name: 'STFPERST',
              legacy_table_description: 'Staff',
            },
          },
          access_limitation: {
            limited_access_code: 'SEALED',
            limited_access_date: '2017-12-02',
            limited_access_description: 'bla bla blah',
            limited_access_government_entity: {
              id: '1101',
              description: 'Sacramento',
            },
          },
          parents: [
            {
              id: 'fafafafafa',
              first_name: 'Father First Name',
              last_name: 'Father Last Name',
              legacy_descriptor: {
                legacy_id: 'fafafafafa',
                legacy_ui_id: 'fafafafafa-hohj-jkj',
                legacy_last_updated: '2017-12-03T11:59:42.716-0800',
                legacy_table_name: 'CLIENT_T',
                legacy_table_description: 'Client',
              },
              relationship: {
                id: '214',
                description: 'Father/Son (Step)',
              },
              limited_access_code: 'NONE',
            },
            {
              id: 'mmmmmmmmmm',
              first_name: 'Mother First Name',
              last_name: 'Mother Last Name',
              legacy_descriptor: {
                legacy_id: 'mmmmmmmmmm',
                legacy_ui_id: 'mmmmmmmmmm-hohj-jkj',
                legacy_last_updated: '2017-12-03T11:59:42.716-0800',
                legacy_table_name: 'CLIENT_T',
                legacy_table_description: 'Client',
              },
              relationship: {
                id: '250',
                description: 'Mother/Son (Adoptive)',
              },
              limited_access_code: 'NONE',
            },
          ],
          legacy_descriptor: {
            legacy_id: 'ccccccccc',
            legacy_ui_id: 'ccccccccc-hohj-jkj',
            legacy_last_updated: '2017-12-03T11:59:42.715-0800',
            legacy_table_name: 'CASE_T',
            legacy_table_description: 'Case',
          },
        },
      ],
      referrals: [
        {
          id: 'jhvuify0X5',
          start_date: '2017-12-02',
          end_date: '2017-12-02',
          county: {id: '1101', description: 'Sacramento'},
          response_time: {id: '1518', description: 'Immediate'},
          reporter: {
            id: 'jhgjhgjh',
            first_name: 'Templeton',
            last_name: 'Pec',
            role: 'MANDATED_REPORTER',
            legacy_descriptor: {
              legacy_id: 'jhgjhgjh',
              legacy_ui_id: 'jhgjhgjh-hohj-jkj',
              legacy_last_updated: '2017-12-03T12:08:50.910-0800',
              legacy_table_name: 'REPTR_T',
              legacy_table_description: 'Reporter',
            },
          },
          assigned_social_worker: {
            id: 'jhgguhgjh',
            first_name: 'Howling',
            last_name: 'Murdock',
            legacy_descriptor: {
              legacy_id: 'jhgguhgjh',
              legacy_ui_id: 'jhgguhgjh-hohj-jkj',
              legacy_last_updated: '2017-12-03T12:08:50.910-0800',
              legacy_table_name: 'STFPERST',
              legacy_table_description: 'Staff',
            },
          },
          access_limitation: {
            limited_access_code: 'SEALED',
            limited_access_date: '2017-12-02',
            limited_access_description: 'bla bla blah',
            limited_access_government_entity: {id: '1101', description: 'Sacramento'},
          },
          allegations: [
            {
              id: 'jhdgfkhaj',
              type: {id: '2179', description: 'Mental Abuse'},
              disposition: {id: '45', description: 'Substantiated'},
              victim: {
                id: 'iiiiiii',
                first_name: 'Marge',
                last_name: 'Simpson',
                legacy_descriptor: {
                  legacy_id: 'iiiiiii',
                  legacy_ui_id: 'iiiiiii-hohj-jkj',
                  legacy_last_updated: '2017-12-03T12:08:50.909-0800',
                  legacy_table_name: 'CLIENT_T',
                  legacy_table_description: 'Client',
                },
                limited_access_code: 'SEALED',
              },
              perpetrator: {
                id: 'pppppppp',
                first_name: 'Bart',
                last_name: 'Simpson',
                legacy_descriptor: {
                  legacy_id: 'pppppppp',
                  legacy_ui_id: 'pppppppp-hohj-jkj',
                  legacy_last_updated: '2017-12-03T12:08:50.910-0800',
                  legacy_table_name: 'CLIENT_T',
                  legacy_table_description: 'Client',
                },
                limited_access_code: 'NONE',
              },
              legacy_descriptor: {
                legacy_id: 'jhdgfkhaj',
                legacy_ui_id: 'jhdgfkhaj-hohj-jkj',
                legacy_last_updated: '2017-12-03T12:08:50.831-0800',
                legacy_table_name: 'ALLGTN_T',
                legacy_table_description: 'Allegation',
              },
            },
          ],
          legacy_descriptor: {
            legacy_id: 'jhvuify0X5',
            legacy_ui_id: '1694-5211-0269-2000739',
            legacy_last_updated: '2017-12-03T12:08:50.910-0800',
            legacy_table_name: 'REFERL_T',
            legacy_table_description: 'Referral',
          },
        },
      ],
    },
  })
  const store = createMockStore(state)
  let component
  beforeEach(() => {
    const context = {store}
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
    component = shallow(<HistoryTableContainer />, {context})
  })

  it('passes formatted referrals HistoryTable view', () => {
    expect(component.find('HistoryTable').props().referrals).toEqual([{
      dateRange: '12/02/2017 - 12/02/2017',
      referralId: '1694-5211-0269-2000739',
      status: 'Closed - Immediate',
      notification: 'Sealed',
      county: 'Sacramento',
      peopleAndRoles: [
        {
          victim: 'Marge Simpson',
          perpetrator: 'Bart Simpson',
          allegations: 'Mental Abuse',
          disposition: '(Substantiated)',
        },
      ],
      worker: 'Howling Murdock',
      reporter: 'Templeton Pec',
    }])
  })
  it('passes formatted cases HistoryTable view', () => {
    expect(component.find('HistoryTable').props().cases).toEqual([{
      caseId: 'ccccccccc-hohj-jkj',
      county: 'Sacramento',
      dateRange: '12/02/2017 - 12/02/2017',
      focusChild: 'Victim First Name Victim Last Name',
      parents: 'Father First Name Father Last Name, Mother First Name Mother Last Name',
      restrictedAccessStatus: 'Sealed',
      status: 'Closed - Permanent Placement',
      worker: 'Worker First Name Worker Last Name'},
    ])
  })
  it('passes formatted screenings HistoryTable view', () => {
    expect(component.find('HistoryTable').props().screenings).toEqual([{
      county: 'Sacramento',
      dateRange: '12/02/2017 - 12/02/2017',
      people: 'John S, Jane S',
      reporter: 'Reporter First Name Reporter Last Name',
      status: 'Closed',
      worker: 'Worker First Name Worker Last Name',
    }])
  })
})
