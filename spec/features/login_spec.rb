# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'login' do
  let(:auth_login_url) { 'http://www.example.com/authn/login?callback=' }
  let(:auth_logout_url) { 'http://www.example.com/authn/logout' }
  let(:auth_validation_url) { 'http://www.example.com/authn/validate?token=123' }
  let(:auth_access_code_url) { 'http://www.example.com/authn/token?accessCode=tempToken123' }
  let(:auth_artifact) do
    { staffId: '1234' }
  end
  let(:staff_info) do
    { first_name: 'Joe', last_name: 'Cool' }
  end
  let(:screening_results) { [{ id: '1' }, { id: '2' }] }
  let(:base_path) { '' }

  around do |example|
    Feature.run_with_activated(:authentication, :perry_version_two) do
      with_config(
        authentication_base_url: 'http://www.example.com',
        authentication_login_url: auth_login_url,
        authentication_logout_url: auth_logout_url,
        base_path: base_path
      ) do
        example.run
      end
    end
  end

  scenario 'user has not logged in', browser: :poltergeist do
    visit root_path
    expect(page.current_url).to have_content(auth_login_url)
  end

  context 'user provides valid security access code', browser: :poltergeist do
    let(:staff_url) { ferb_api_url(ExternalRoutes.ferb_api_staff_path(1234)) }
    before do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screening_results, status: 200))
    end

    scenario 'and verification provides staff_id' do
      stub_request(:get, auth_access_code_url)
        .and_return(json_body('123', status: 200))
      stub_request(:get, auth_validation_url)
        .and_return(json_body(auth_artifact.to_json, status: 200))
      stub_request(:get, staff_url)
        .and_return(json_body(staff_info.to_json, status: 200))
      visit root_path(accessCode: 'tempToken123')
      expect(a_request(:get, auth_access_code_url)).to have_been_made
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(a_request(:get, staff_url)).to have_been_made
      expect(page.current_url).to_not have_content auth_login_url
      expect(page).to have_current_path(root_path(accessCode: 'tempToken123'))
    end

    scenario 'and verification does not provide staff_id' do
      stub_request(:get, auth_access_code_url)
        .and_return(json_body('123', status: 200))
      stub_request(:get, auth_validation_url)
        .and_return(status: 200)
      visit root_path(accessCode: 'tempToken123')
      expect(a_request(:get, auth_access_code_url)).to have_been_made
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(a_request(:get, staff_url)).to_not have_been_made
      expect(page.current_url).to_not have_content auth_login_url
      expect(page).to have_current_path(root_path(accessCode: 'tempToken123'))
    end

    context 'and login with different privileges' do
      before do
        stub_request(:get, auth_access_code_url)
          .and_return(json_body('123', status: 200))
        stub_request(:get, staff_url)
          .and_return(json_body(staff_info.to_json, status: 200))
      end

      scenario 'has CARES Hotline and CARES Snapshot can see screenings and snapshot' do
        privileges = ['CARES Hotline', 'CARES Snapshot']
        stub_request(:get, auth_validation_url)
          .and_return(json_body({ staffId: '1234', privileges: privileges }.to_json, status: 200))
        visit root_path(accessCode: 'tempToken123')
        expect(page).to have_button 'Start Snapshot'
        expect(page).to have_button 'Start Screening'
      end

      scenario 'has CARES Hotline, can see screenings but not snapshot' do
        privileges = ['CARES Hotline']
        stub_request(:get, auth_validation_url)
          .and_return(json_body({ staffId: '1234', privileges: privileges }.to_json, status: 200))
        visit root_path(accessCode: 'tempToken123')
        expect(page).to_not have_button 'Start Snapshot'
        expect(page).to have_button 'Start Screening'
      end

      scenario 'has CARES Snapshot, can see snapshot but not screening' do
        privileges = ['CARES Snapshot']
        stub_request(:get, auth_validation_url)
          .and_return(json_body({ staffId: '1234', privileges: privileges }.to_json, status: 200))
        visit root_path(accessCode: 'tempToken123')
        expect(page).to have_button 'Start Snapshot'
        expect(page).to_not have_button 'Start Screening'
      end
    end

    context 'and login successfully' do
      before do
        stub_request(:get, auth_access_code_url)
          .and_return(json_body('123', status: 200))
        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_artifact.to_json, status: 200))
        stub_request(:get, staff_url)
          .and_return(json_body(staff_info.to_json, status: 200))
      end

      context 'with global header' do
        before do
          stub_request(:get, staff_url)
            .and_return(json_body(staff_info.to_json, status: 200))
        end

        context 'when there is a base_path present' do
          let(:base_path) { 'intake' }

          scenario 'when user logs out' do
            pending(<<~MESSAGE)
              base path cannot be configured during the test run.
              This exposes a problem with how we are handling base path in our environment setup.
            MESSAGE
            visit root_path(accessCode: 'tempToken123')
            # regular click_link won't keep the pop-up menu open for some reason
            execute_script('$(".fa.fa-user").click()')
            click_link 'Logout'
            expect(page.current_url).to have_content 'intake/logout'
          end
        end
      end

      context 'when there is no user on the session' do
        let(:staff_info) { {} }

        scenario 'user sees "Not Available" if there is no user on session' do
          visit root_path(accessCode: 'tempToken123')
          expect(page).to have_css 'header', text: 'Not Available'
        end
      end
    end
  end

  scenario 'user provides invalid access code', browser: :poltergeist do
    stub_request(:get, auth_access_code_url).and_return(json_body('', status: 401))
    visit root_path(accessCode: 'tempToken123')
    expect(a_request(:get, auth_access_code_url)).to have_been_made
    expect(page.current_url).to have_content auth_login_url
  end

  scenario 'user has already logged in', browser: :poltergeist do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(screening_results, status: 200))
    stub_request(:get, auth_access_code_url).and_return(json_body('123', status: 200))
    stub_request(:get, auth_validation_url).and_return(status: 200)
    visit root_path(accessCode: 'tempToken123')
    expect(a_request(:get, auth_access_code_url)).to have_been_made
    expect(a_request(:get, auth_validation_url)).to have_been_made
    WebMock.reset!

    stub_system_codes
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(screening_results, status: 200))
    visit root_path
    expect(a_request(:get, %r{http://www.example.com})).to_not have_been_made
    expect(page).to have_current_path(root_path)
  end

  scenario 'user uses session access code when communicating to API' do
    screening = FactoryBot.create(:screening, name: 'My Screening')
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body([].to_json, status: 200))
    stub_empty_history_for_screening(screening)

    bobs_access_code = 'BOBS_ACCESS_CODE'
    bobs_token = 'BOBS_TOKEN'
    Capybara.using_session(:bob) do
      stub_request(:get, "http://www.example.com/authn/token?accessCode=#{bobs_access_code}")
        .and_return(json_body(bobs_token, status: 200))
      stub_request(:get, "http://www.example.com/authn/validate?token=#{bobs_token}")
        .and_return(status: 200)
      visit root_path(accessCode: bobs_access_code)
    end

    alexs_access_code = 'ALEXS_ACCESS_CODE'
    alexs_token = 'ALEXS_TOKEN'
    Capybara.using_session(:alex) do
      stub_request(:get, "http://www.example.com/authn/token?accessCode=#{alexs_access_code}")
        .and_return(json_body(alexs_token, status: 200))
      stub_request(:get, "http://www.example.com/authn/validate?token=#{alexs_token}")
        .and_return(status: 200)
      visit root_path(accessCode: alexs_access_code)
    end

    Capybara.using_session(:bob) do
      visit screening_path(screening.id)
      expect(page).to have_content 'My Screening'
      expect(
        a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .with(headers: { 'Authorization' => bobs_token })
      ).to have_been_made
    end

    Capybara.using_session(:alex) do
      visit screening_path(screening.id)
      expect(page).to have_content 'My Screening'
      expect(
        a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .with(headers: { 'Authorization' => alexs_token })
      ).to have_been_made
    end
  end
end

feature 'login perry v1' do
  let(:auth_login_url) { 'http://www.example.com/authn/login?callback=' }
  let(:auth_validation_url) { 'http://www.example.com/authn/validate?token=123' }
  let(:auth_artifact) do
    { staffId: '1234' }
  end
  let(:staff_info) do
    { first_name: 'Joe', last_name: 'Cool' }
  end
  let(:screening_results) { [{ id: '1' }, { id: '2' }] }

  around do |example|
    Feature.run_with_activated(:authentication) do
      with_config(
        authentication_base_url: 'http://www.example.com',
        authentication_login_url: auth_login_url,
        base_path: ''
      ) do
        example.run
      end
    end
  end

  scenario 'user has not logged in', browser: :poltergeist do
    visit root_path
    expect(page.current_url).to have_content(auth_login_url)
  end

  context 'user provides valid security token', browser: :poltergeist do
    let(:staff_url) { ferb_api_url(ExternalRoutes.ferb_api_staff_path(1234)) }
    before do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screening_results, status: 200))
    end

    scenario 'and verification provides staff_id' do
      stub_request(:get, auth_validation_url)
        .and_return(json_body(auth_artifact.to_json, status: 200))
      stub_request(:get, staff_url)
        .and_return(json_body(staff_info.to_json, status: 200))
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(a_request(:get, staff_url)).to have_been_made
      expect(page.current_url).to_not have_content auth_login_url
      expect(page).to have_current_path(root_path(token: 123))
    end

    scenario 'and verification does not provide staff_id' do
      stub_request(:get, auth_validation_url)
        .and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(a_request(:get, staff_url)).to_not have_been_made
      expect(page.current_url).to_not have_content auth_login_url
      expect(page).to have_current_path(root_path(token: 123))
    end

    context 'with global header' do
      scenario 'user sees his name on the global header' do
        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_artifact.to_json, status: 200))
        stub_request(:get, staff_url)
          .and_return(json_body(staff_info.to_json, status: 200))
        visit root_path(token: 123)
        expect(a_request(:get, auth_validation_url)).to have_been_made
        expect(a_request(:get, staff_url)).to have_been_made
        expect(page).to have_css 'header', text: 'Joe Cool'
      end

      scenario 'user sees "Not Available" if there is no user on session' do
        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_artifact.to_json, status: 200))
        stub_request(:get, staff_url)
          .and_return(json_body({}.to_json, status: 200))
        visit root_path(token: 123)
        expect(page).to have_css 'header', text: 'Not Available'
      end
    end
  end

  scenario 'user provides invalid security token', browser: :poltergeist do
    stub_request(:get, auth_validation_url).and_return(status: 401)
    visit root_path(token: 123)
    expect(a_request(:get, auth_validation_url)).to have_been_made
    expect(page.current_url).to have_content auth_login_url
  end

  scenario 'user has already logged in', browser: :poltergeist do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(screening_results, status: 200))
    stub_request(:get, auth_validation_url).and_return(status: 200)
    visit root_path(token: 123)
    expect(a_request(:get, auth_validation_url)).to have_been_made
    WebMock.reset!

    stub_system_codes
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(screening_results, status: 200))
    visit root_path
    expect(a_request(:get, %r{http://www.example.com})).to_not have_been_made
    expect(page).to have_current_path(root_path)
  end

  scenario 'user uses session token when communicating to API' do
    Feature.run_with_activated(:authentication) do
      screening = FactoryBot.create(:screening, name: 'My Screening')
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body([].to_json, status: 200))
      stub_request(:get, auth_validation_url)
        .and_return(json_body(auth_artifact.to_json, status: 200))
      stub_empty_history_for_screening(screening)
      stub_empty_relationships_for_screening(screening)

      bobs_token = 'BOBS_TOKEN'
      Capybara.using_session(:bob) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{bobs_token}")
          .and_return(status: 200)
        visit root_path(token: bobs_token)
      end

      alexs_token = 'ALEXS_TOKEN'
      Capybara.using_session(:alex) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{alexs_token}")
          .and_return(status: 200)
        visit root_path(token: alexs_token)
      end

      Capybara.using_session(:bob) do
        visit screening_path(screening.id)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
          .with(headers: { 'Authorization' => bobs_token })
        ).to have_been_made
      end

      Capybara.using_session(:alex) do
        visit screening_path(screening.id)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
          .with(headers: { 'Authorization' => alexs_token })
        ).to have_been_made
      end
    end
  end
end
