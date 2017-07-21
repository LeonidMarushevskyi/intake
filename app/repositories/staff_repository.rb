# frozen_string_literal: true

# Staff Repository is a service class responsible for retrieving information about staff
# resource via the API
class StaffRepository
  def self.find(security_token, id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_staff_path(id),
      :get
    )
    Staff.new(response.body)
  end
end
