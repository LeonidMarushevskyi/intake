# frozen_string_literal: true

# User controller will provide additional info from the current user
module Api
  module V1
    class UserController < ApiController # :nodoc:
      def user_info
        user_payload = {}
        user_payload = session[:user_details] if session[:user_details]
        render json: user_payload, status: 200
      end
    end
  end
end
