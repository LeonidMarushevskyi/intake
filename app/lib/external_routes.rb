# frozen_string_literal: true

# The external routes will be accessible from here.
class ExternalRoutes
  class << self
    def intake_api_people_search_v2_path(param)
      "/api/v2/people_search?#{param.to_param}"
    end

    def intake_api_screening_path(id)
      "/api/v1/screenings/#{id}"
    end

    def intake_api_screenings_path(*param)
      if param.empty?
        '/api/v1/screenings'
      else
        "/api/v1/screenings?#{param.to_param}"
      end
    end

    def intake_api_history_of_involvements_path(id)
      "/api/v1/screenings/#{id}/history_of_involvements"
    end

    def intake_api_screening_submit_path(id)
      "/api/v1/screenings/#{id}/submit"
    end

    def intake_api_participants_path
      '/api/v1/participants'
    end

    def intake_api_participant_path(id)
      "/api/v1/participants/#{id}"
    end

    def intake_api_screening_people_path(id)
      "/api/v1/screenings/#{id}/people"
    end

    def intake_api_relationships_by_screening_path(id)
      "/api/v1/screenings/#{id}/relationships"
    end

    def dora_people_light_index_path
      '/dora/people-summary/person-summary/_search'
    end

    def ferb_api_investigation_path(id)
      "/investigations/#{id}"
    end

    def ferb_api_investigations_contacts_path(id)
      "/investigations/#{id}/contacts"
    end

    def ferb_api_investigations_contact_path(investigation_id, contact_id)
      "/investigations/#{investigation_id}/contacts/#{contact_id}"
    end

    def ferb_api_screening_history_of_involvements_path(id)
      "/screenings/#{id}/history_of_involvements"
    end

    def ferb_api_lov_path
      '/lov'
    end

    def ferb_api_cross_report_agency
      '/cross_report_agency'
    end

    def ferb_api_staff_path(id)
      "/staffpersons/#{id}"
    end

    def ferb_api_client_authorization_path(id)
      "/authorize/client/#{id}"
    end

    def sdm_path
      'https://ca.sdmdata.org'
    end
  end
end
