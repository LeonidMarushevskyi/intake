# frozen_string_literal: true

# Investigations Controller handles all service request for
# the creation and modification of investigation objects.
module Api
  module V1
    class InvestigationsController < ApiController # :nodoc:
      respond_to :json

      def screening
        screening_summary = FerbAPI.make_api_call(
          session['security_token'],
          ExternalRoutes.ferb_api_investigations_screening(params[:id]),
          :get
        )
        render json: screening_summary.body, status: screening_summary.status
      end
    end
  end
end
