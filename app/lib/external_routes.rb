# frozen_string_literal: true

# The external routes will be accessible from here.
class ExternalRoutes
  class << self
    def intake_api_person_path(id)
      "/api/v1/people/#{id}"
    end

    def intake_api_people_path
      '/api/v1/people'
    end

    def intake_api_people_search_path(param)
      "/api/v1/people_search?#{param.to_param}"
    end

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

    def intake_api_relationships_by_screening_path(id)
      "/api/v1/screenings/#{id}/relationships"
    end

    def intake_api_staff_path(id)
      "/api/v1/staff/#{id}"
    end
  end
end
