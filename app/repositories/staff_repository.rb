# frozen_string_literal: true

# Staff Repository is a service class responsible for retrieving information about staff
# resource via the API
class StaffRepository
  def self.find(security_token, id)
    response = FerbAPI.make_api_call(
      security_token,
      ExternalRoutes.ferb_api_staff_path(id),
      :get
    )
    Staff.new(response.body)
  end
end
