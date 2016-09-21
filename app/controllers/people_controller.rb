# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
    @person = Person.new(address: {})
  end

  def create
    @person = Person.create(person_params.to_h)
    redirect_to person_path(@person)
  end

  def show
    @person = Person.find(params[:id])
  end

  def search
    people = PeopleRepo.search(params[:query])
    render json: people.map(&:attributes)
  end

  def person_params
    params.require(:person).permit(
      :first_name,
      :last_name,
      :gender,
      :date_of_birth,
      :ssn,
      address: [
        :street_address,
        :city,
        :state,
        :zip
      ]
    )
  end
end
