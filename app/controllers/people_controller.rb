# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
  end

  def create
    respond_to do |format|
      format.json do
        person = PersonService.create(person_params.to_h)
        render json: person
      end
    end
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
