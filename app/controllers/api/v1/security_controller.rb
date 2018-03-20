# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class SecurityController < ApiController # :nodoc:
      respond_to :json

      def check_permissions
        permissions = params[:permissions].split ','
        unless permissions_set?(permissions) && permissions.empty?
          payload = generate_permissions_payload(permissions)
        end

        render json: payload || {}
      end

      private

      PRIVILEGES = {
        add_sensitive_people: 'Sensitive Persons',
        can_see_hotline: 'CARES Hotline',
        can_see_snapshot: 'CARES Snapshot'
      }.freeze

      def generate_permissions_payload(permission_list)
        permission_payload = {}
        permission_list.each do |perm|
          permission = perm.to_sym
          if PRIVILEGES[permission]
            permission_payload[permission] = validate_perm(permission) || false
          end
        end
        permission_payload
      end

      def validate_perm(permission)
        session[:user_details]['privileges']&.include?(PRIVILEGES[permission])
      end

      def permissions_set?(permissions)
        permissions.blank? ||
          session[:user_details].blank? ||
          session[:user_details]['privileges'].blank?
      end
    end
  end
end
