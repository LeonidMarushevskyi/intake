# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
    respond_to do |format|
      format.html do
        render :show
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        person = Person.new(person_params.to_h)
        created_person = PersonRepository.create(person)
        render json: created_person
      end
    end
  end

  def edit
    respond_to do |format|
      format.html do
        render :show
      end
    end
  end

  def show
    respond_to do |format|
      format.html do
        render :show
      end
      format.json do
        person = PersonRepository.find(params[:id])
        render json: person
      end
    end
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
