# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Investigation History of Involvement' do
  let(:investigation_id) { '1234' }

  before do
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
    ).and_return(json_body({ history_of_involvement: hoi }.to_json, status: 200))
  end

  context 'when there is no history associated with the investigation' do
    let(:hoi) { {} }

    scenario 'the history card displays the no HOI present message' do
      visit investigation_path(id: investigation_id)
      within '.card.show', text: 'History' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end
  end

  context 'when there is associated history with the investigation' do
    let(:screenings) do
      [
        {
          start_date: '2016-09-10',
          county_name: 'el_dorado',
          # until we have users, TPT is saving the entire name in the last_name field
          assigned_social_worker: { first_name: nil, last_name: 'Bob Smith' },
          reporter: { first_name: 'Alex', last_name: 'Hanson' },
          all_people: [
            { first_name: 'Bob', last_name: 'Bob Smith', roles: ['Assigned Social Worker'] },
            { first_name: 'Alex', last_name: 'Hanson', roles: ['Reporter'] },
            { first_name: 'Sally', last_name: 'Johnson', roles: ['Victim'] },
            { first_name: 'Sam', last_name: 'Anderson', roles: ['Perpetrator'] },
            { first_name: 'James', last_name: 'Robinson', roles: [] }
          ]
        },
        {
          start_date: '2016-08-10',
          end_date: '2016-11-12',
          county_name: 'el_dorado',
          reporter: { first_name: nil, last_name: nil },
          assigned_social_worker: { first_name: nil, last_name: nil },
          all_people: []
        }
      ]
    end

    let(:referrals) do
      [
        {
          start_date: '2016-11-14',
          end_date: '2016-12-14',
          response_time: 'Immediate',
          county_name: 'Madera',
          reporter: {
            first_name: 'Reporter1',
            last_name: 'r1LastName'
          },
          assigned_social_worker: {
            first_name: 'Social1',
            last_name: 's1LastName'
          },
          allegations: [
            {
              allegation_description: 'General Neglect',
              disposition_description: 'Entered in Error',
              perpetrator_first_name: 'Perpetrator1',
              perpetrator_last_name: 'p1LastName',
              victim_first_name: 'Victim1',
              victim_last_name: 'v1LastName'
            }
          ],
          legacy_descriptor: {
            legacy_ui_id: '0853-2115-5670-6000802'
          },
          access_limitation: {
            limited_access_code: 'R'
          }
        },
        {
          start_date: '2016-05-06',
          county_name: 'San Francisco',
          reporter: {
            first_name: 'Reporter2',
            last_name: 'r2LastName'
          },
          assigned_social_worker: {
            first_name: 'Social2',
            last_name: 's2LastName'
          },
          allegations: [
            {
              allegation_description: 'Severe Neglect',
              disposition_description: 'Confirmed',
              perpetrator_first_name: 'Perpetrator2',
              perpetrator_last_name: 'p2LastName',
              victim_first_name: 'Victim2',
              victim_last_name: 'v2LastName'
            }
          ],
          legacy_descriptor: {
            legacy_ui_id: '0202-9769-1248-2000283'
          },
          access_limitation: {
            limited_access_code: 'S'
          }
        }
      ]
    end

    let(:cases) do
      [
        {
          start_date: '2016-01-01',
          end_date: '2016-11-01',
          focus_child: {
            last_name: 'fc1Last',
            id: '0rumtwQ0Bn',
            first_name: 'fChild1'
          },
          county_name: 'El Dorado',
          service_component: 'Family Reunification',
          parents: [
            {
              last_name: 'p1Last',
              id: 'AbiQA5q0Bo',
              first_name: 'Parent1'
            },
            {
              last_name: 'p2Last',
              id: 'CaTvuzq0Bo',
              first_name: 'Parent2'
            }
          ],
          assigned_social_worker: {
            last_name: 'sw1LastName',
            first_name: 'SocialWorker1'
          },
          legacy_descriptor: {
            legacy_ui_id: '0393-5909-1798-6027230'
          },
          access_limitation: {
            limited_access_code: 'R'
          }
        },
        {
          start_date: '2016-02-03',
          focus_child: {
            last_name: 'fc2Last',
            id: '1234567',
            first_name: 'fChild2'
          },
          county_name: 'Plumas',
          parents: [
            {
              last_name: 'p3Last',
              id: 'ABC123',
              first_name: 'Parent3'
            },
            {
              last_name: 'p4Last',
              id: 'ABCDEFG',
              first_name: 'Parent4'
            }
          ],
          assigned_social_worker: {
            last_name: 'sw2LastName',
            first_name: 'SocialWorker2'
          },
          legacy_descriptor: {
            legacy_ui_id: '0208-9997-9274-0000863'
          },
          access_limitation: {
            limited_access_code: 'N'
          }
        }
      ]
    end

    let(:hoi) { { cases: cases, referrals: referrals, screenings: screenings } }

    scenario 'viewing a screening' do
      visit investigation_path(id: investigation_id)

      within '.card.show', text: 'History' do
        within first('tbody') do
          screenings = page.all('tr', text: 'Screening')
          expect(screenings.length).to eq 2

          within screenings.first do
            expect(page).to have_content('09/10/2016')
            expect(page).to have_no_content('09/10/2016 -')
            expect(page).to have_content('Screening (In Progress)')
            expect(page).to have_content('El Dorado')
            expect(page).to have_content('Sally Johnson')
            expect(page).to have_content('Sam Anderson')
            expect(page).to have_content('James Robinson')
            expect(page).to have_content('Reporter: Alex Hanson')
            expect(page).to have_content('Worker: Bob Smith')
          end

          within screenings.last do
            expect(page).to have_content('08/10/2016 - 11/12/2016')
            expect(page).to have_content('Screening (Closed)')
            expect(page).to have_content('Reporter: ')
            expect(page).to have_content('Worker: ')
          end

          referrals = page.all('tr', text: 'Referral')
          expect(referrals.length).to eq 2

          within referrals.first do
            expect(page).to have_content('11/14/2016 - 12/14/2016')
            expect(page).to have_content('Referral')
            expect(page).to have_content('0853-2115-5670-6000802')
            expect(page).to have_content('(Closed - Immediate)')
            expect(page).to have_content('Madera')
            expect(page).to have_content('Sealed')

            within 'table' do
              allegation_rows = page.all('tr')

              within allegation_rows[0] do
                expect(page).to have_content('Victim')
                expect(page).to have_content('Perpetrator')
                expect(page).to have_content('Allegation(s) & Disposition')
              end

              within allegation_rows[1] do
                expect(page).to have_content('Victim1 v1LastName')
                expect(page).to have_content('Perpetrator1 p1LastName')
                expect(page).to have_content('General Neglect (Entered in Error)')
              end
            end

            expect(page).to have_content('Reporter: Reporter1 r1LastName')
            expect(page).to have_content('Worker: Social1 s1LastName')
          end

          within referrals.last do
            expect(page).to have_content('05/06/2016')
            expect(page).to have_content('Referral')
            expect(page).to have_content('0202-9769-1248-2000283')
            expect(page).to have_content('(Open)')
            expect(page).to have_content('San Francisco')
            expect(page).to have_content('Sensitive')

            within 'table' do
              allegation_rows = page.all('tr')

              within allegation_rows[0] do
                expect(page).to have_content('Victim')
                expect(page).to have_content('Perpetrator')
                expect(page).to have_content('Allegation(s) & Disposition')
              end

              within allegation_rows[1] do
                expect(page).to have_content('Victim2 v2LastName')
                expect(page).to have_content('Perpetrator2 p2LastName')
                expect(page).to have_content('Severe Neglect (Confirmed)')
              end
            end

            expect(page).to have_content('Reporter: Reporter2 r2LastName')
            expect(page).to have_content('Worker: Social2 s2LastName')
          end

          cases = page.all('tr', text: 'Case')
          expect(cases.length).to eq 2

          within cases.first do
            expect(page).to have_content('01/01/2016 - 11/01/2016')
            expect(page).to have_content('Case')
            expect(page).to have_content('0393-5909-1798-6027230')
            expect(page).to have_content('(Closed - Family Reunification)')
            expect(page).to have_content('El Dorado')
            expect(page).to have_content('Focus Child: fChild1 fc1Last')
            expect(page).to have_content('Parent(s): Parent1 p1Last, Parent2 p2Last')
            expect(page).to have_content('Worker: SocialWorker1 sw1LastName')
            expect(page).to have_content('Sealed')
          end

          within cases.last do
            expect(page).to have_content('02/03/2016')
            expect(page).to have_no_content('2016 -')
            expect(page).to have_content('Case')
            expect(page).to have_content('0208-9997-9274-0000863')
            expect(page).to have_content('Open')
            expect(page).to have_content('Plumas')
            expect(page).to have_content('Focus Child: fChild2 fc2Last')
            expect(page).to have_content('Parent(s): Parent3 p3Last, Parent4 p4Last')
            expect(page).to have_content('Worker: SocialWorker2 sw2LastName')
            expect(page).to_not have_content('Sealed')
            expect(page).to_not have_content('Sensitive')
          end
        end
      end
    end
  end
end
