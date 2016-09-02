# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
  end

  def create
    @person = PersonCreator.create(person_params.to_h)
    render :show
  end

  def person_params
    params.require(:person).permit(
      :first_name,
      :last_name,
      :gender,
      :date_of_birth,
      :ssn,
      :street_address,
      :city,
      :state,
      :zip
    )
  end
end
