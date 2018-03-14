# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'History card' do
  let(:existing_screening) { FactoryBot.create(:screening) }

  context 'with no history of envolvements' do
    scenario 'while editting an existing screening displays the no HOI copy' do
      stub_and_visit_edit_screening(existing_screening)

      within '.card', text: 'History' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end

    scenario 'while viewing an existing screening displays the no HOI copy' do
      stub_and_visit_show_screening(existing_screening)
      visit screening_path(id: existing_screening.id)

      within '.card', text: 'History' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end
  end

  context 'a screening with participants and HoI' do
    let(:screenings) do
      [
        {
          id: '1234',
          start_date: '2016-09-10',
          county: {
            id: '1101',
            description: 'El Dorado'
          },
          assigned_social_worker: { id: 'wrk1234', first_name: 'Bob', last_name: 'Smith' },
          reporter: { id: 'rpt1234', first_name: 'Alex', last_name: 'Hanson' },
          all_people: [
            { first_name: 'Bob', last_name: 'Smith', roles: ['Assigned Social Worker'] },
            { first_name: 'Alex', last_name: 'Hanson', roles: ['Reporter'] },
            { first_name: 'Sally', last_name: 'Johnson', roles: ['Victim'] },
            { first_name: 'Sam', last_name: 'Anderson', roles: ['Perpetrator'] },
            { first_name: 'James', last_name: 'Robinson', roles: [] }
          ]
        },
        {
          start_date: '2016-08-10',
          end_date: '2016-11-12',
          county: {
            id: '1101',
            description: 'El Dorado'
          },
          reporter: { first_name: nil, last_name: nil },
          assigned_social_worker: { first_name: nil, last_name: nil },
          all_people: []
        }
      ]
    end

    let(:referrals) do
      [
        {
          id: '1234',
          start_date: '2016-11-14',
          end_date: '2016-12-14',
          county: {
            id: '1234',
            description: 'Madera'
          },
          response_time: {
            id: '1520'
          },
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
              type: { description: 'General Neglect' },
              disposition: {
                id: '45',
                description: 'Entered in Error'
              },
              victim: {
                first_name: 'Victim1',
                last_name: 'v1LastName'
              },
              perpetrator: {
                first_name: 'Perpetrator1',
                last_name: 'p1LastName'
              }
            }
          ],
          legacy_descriptor: {
            legacy_ui_id: '0853-2115-5670-6000802'
          },
          access_limitation: {
            limited_access_code: 'SEALED'
          }
        },
        {
          start_date: '2016-05-06',
          county: {
            id: '415',
            description: 'San Francisco'
          },
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
              type: { description: 'Severe Neglect' },
              victim: {
                first_name: 'Victim2',
                last_name: 'v2LastName'
              },
              perpetrator: {
                first_name: 'Perpetrator2',
                last_name: 'p2LastName'
              }
            }
          ],
          legacy_descriptor: {
            legacy_ui_id: '0202-9769-1248-2000283'
          },
          access_limitation: {
            limited_access_code: 'SENSITIVE'
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
          county: {
            id: '1101',
            description: 'El Dorado'
          },
          service_component: {
            id: '1695',
            description: 'Family Reunification'
          },
          parents: [
            {
              last_name: 'p1Last',
              id: 'AbiQA5q0Bo',
              first_name: 'Parent1',
              relationship: {
                id: 'p1234',
                description: 'Father/Son (Step)'
              }
            },
            {
              last_name: 'p2Last',
              id: 'CaTvuzq0Bo',
              first_name: 'Parent2',
              relationship: {
                id: 'p1234',
                description: 'Mother/Son (Adoptive)'
              }
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
            limited_access_code: 'SEALED'
          }
        },
        {
          start_date: '2016-02-03',
          focus_child: {
            last_name: 'fc2Last',
            id: '1234567',
            first_name: 'fChild2'
          },
          county: {
            id: 'p123',
            description: 'Plumas'
          },
          parents: [
            {
              last_name: 'p3Last',
              id: 'ABC123',
              first_name: 'Parent3',
              relationship: {
                id: 'p1234',
                description: 'Father/Son (Adoptive)'
              }
            },
            {
              last_name: 'p4Last',
              id: 'ABCDEFG',
              first_name: 'Parent4',
              relationship: {
                id: 'p1234',
                description: 'Mother/Son (Adoptive)'
              }
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
            limited_access_code: 'NONE'
          }
        }
      ]
    end

    let(:screening_involvement) do
      {
        referrals: referrals,
        screenings: screenings,
        cases: cases
      }
    end

    before do
      existing_screening.participants = [FactoryBot.create(:participant)]

      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).and_return(json_body(existing_screening.to_json))

      stub_request(
        :get,
        ferb_api_url(
          ExternalRoutes.ferb_api_screening_history_of_involvements_path(existing_screening.id)
        )
      ).and_return(json_body(screening_involvement.to_json, status: 200))
      stub_empty_relationships_for_screening(existing_screening)
    end

    scenario 'copy button' do
      visit screening_path(id: existing_screening.id)
      within '#history-card.card.show', text: 'History' do
        click_button 'Copy'
      end
      #
      # Capybara has no way of checking the clipboard contents, so we insert a textarea
      # to this card to paste into and check the value.
      #
      js = [
        'var spec_meta = document.createElement("textarea")',
        'var label = document.createElement("label")',
        'label.setAttribute("for", "spec_meta")',
        'spec_meta.setAttribute("id", "spec_meta")',
        'document.getElementById("history-card").appendChild(spec_meta)',
        'document.getElementById("spec_meta").appendChild(label)'
      ].join(';')
      page.execute_script js
      find('#spec_meta').send_keys [:control, 'v']
      expect(find('#spec_meta').value).not_to be_empty
    end

    scenario 'viewing a screening' do
      visit screening_path(id: existing_screening.id)

      within '#history-card.card.show', text: 'History' do
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
                expect(page).to have_content('Severe Neglect')
                expect(page).to have_no_content('()')
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

      expect(
        a_request(
          :get,
          ferb_api_url(
            ExternalRoutes.ferb_api_screening_history_of_involvements_path(existing_screening.id)
          )
        )
      ).to have_been_made
    end

    scenario 'editing a screening' do
      visit edit_screening_path(id: existing_screening.id)

      expect(
        a_request(
          :get,
          ferb_api_url(
            ExternalRoutes.ferb_api_screening_history_of_involvements_path(existing_screening.id)
          )
        )
      ).to have_been_made

      within '#history-card.card.show', text: 'History' do
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
                expect(page).to have_content('Severe Neglect')
                expect(page).to have_no_content('()')
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

    context 'hoi comes from the intake API' do
      around do |example|
        Feature.run_with_activated(:hoi_from_intake_api) do
          screenings[0][:county_name] = 'el_dorado'
          screenings[0][:county] = nil
          screenings[0][:assigned_social_worker] = { first_name: nil, last_name: 'Bob Smith' }
          screenings[0][:reporter] = { first_name: 'Alex', last_name: 'Hanson' }
          screenings[0][:all_people][0][:last_name] = 'Bob Smith'
          screenings[1][:county_name] = 'el_dorado'
          screenings[1][:county] = nil
          referrals[0][:response_time] = 'Immediate'
          referrals[0][:county_name] = 'Madera'
          referrals[0][:county] = nil
          referrals[0][:allegations] = [{
            allegation_description: 'General Neglect',
            disposition_description: 'Entered in Error',
            perpetrator_first_name: 'Perpetrator1',
            perpetrator_last_name: 'p1LastName',
            victim_first_name: 'Victim1',
            victim_last_name: 'v1LastName'
          }]
          referrals[0][:access_limitation] = { limited_access_code: 'R' }
          referrals[1][:county_name] = 'San Francisco'
          referrals[1][:county] = nil
          referrals[1][:allegations] = [{
            allegation_description: 'Severe Neglect',
            perpetrator_first_name: 'Perpetrator2',
            perpetrator_last_name: 'p2LastName',
            victim_first_name: 'Victim2',
            victim_last_name: 'v2LastName'
          }]
          referrals[1][:access_limitation] = { limited_access_code: 'S' }
          cases[0][:county_name] = 'El Dorado'
          cases[0][:county] = nil
          cases[0][:service_component] = 'Family Reunification'
          cases[0][:parents] = [
            { first_name: 'Parent1', last_name: 'p1Last', id: 'AbiQA5q0Bo' },
            { first_name: 'Parent2', last_name: 'p2Last', id: 'CaTvuzq0Bo' }
          ]
          cases[0][:access_limitation] = { limited_access_code: 'R' }
          cases[1][:county_name] = 'Plumas'
          cases[1][:county] = nil
          cases[1][:parents] = [
            { first_name: 'Parent3', last_name: 'p3Last', id: 'ABC123' },
            { first_name: 'Parent4', last_name: 'p4Last', id: 'ABCDEFG' }
          ]
          cases[1][:access_limitation] = { limited_access_code: 'N' }
          screening_involvement = { referrals: referrals, screenings: screenings, cases: cases }

          stub_request(
            :get,
            intake_api_url(
              ExternalRoutes.intake_api_history_of_involvements_path(existing_screening.id)
            )
          ).and_return(json_body(screening_involvement.to_json, status: 200))
          example.run
        end
      end

      scenario 'editing a screening displays HOI' do
        visit edit_screening_path(id: existing_screening.id)

        expect(
          a_request(
            :get,
            intake_api_url(
              ExternalRoutes.intake_api_history_of_involvements_path(existing_screening.id)
            )
          )
        ).to have_been_made

        within '#history-card.card.show', text: 'History' do
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
                  expect(page).to have_content('Severe Neglect')
                  expect(page).to have_no_content('()')
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
              expect(page).to have_content('Sealed')
              expect(page).to have_content('Focus Child: fChild1 fc1Last')
              expect(page).to have_content('Parent(s): Parent1 p1Last, Parent2 p2Last')
              expect(page).to have_content('Worker: SocialWorker1 sw1LastName')
            end

            within cases.last do
              expect(page).to have_content('02/03/2016')
              expect(page).to have_no_content('2016 -')
              expect(page).to have_content('Case')
              expect(page).to have_content('0208-9997-9274-0000863')
              expect(page).to have_content('Open')
              expect(page).to have_content('Plumas')
              expect(page).to_not have_content('Sealed')
              expect(page).to_not have_content('Sensitive')
              expect(page).to have_content('Focus Child: fChild2 fc2Last')
              expect(page).to have_content('Parent(s): Parent3 p3Last, Parent4 p4Last')
              expect(page).to have_content('Worker: SocialWorker2 sw2LastName')
            end
          end
        end
      end
    end
  end
end
