# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      respond_to :json

      def search
        people_results = PersonSearchRepository.search(
          session[:security_token],
          params[:search_term]
        )
        render json: people_results
      end
    end
  end
end
