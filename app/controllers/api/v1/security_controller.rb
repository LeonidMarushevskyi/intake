# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class SecurityController < ApiController # :nodoc:
      respond_to :json

      def check_permission
        permission = params[:permission].to_sym
        if permissions_set?(permission)
          render json: false
        elsif permission == :add_sensitive_people &&
              session[:user_details]['privileges'].include?('Sensitive Persons')
          render json: true
        else
          render json: false
        end
      end

      private

      def permissions_set?(permission)
        permission.blank? ||
          session[:user_details].blank? ||
          session[:user_details]['privileges'].blank?
      end
    end
  end
end
