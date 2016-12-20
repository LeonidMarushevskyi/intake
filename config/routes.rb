# frozen_string_literal: true
require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_constraint')

Rails.application.routes.draw do
  root 'welcome#index'
  resources :style_guide,
    only: [:index, :show],
    constraints: Routes::InactiveReleaseOneConstraint

  resources :screenings,
    only: [:create, :edit, :show, :update, :index],
    constraints: Routes::InactiveReleaseOneConstraint do
    resources :participants, only: [:create]
  end

  resource :people, only: [:search] do
    collection do
      get 'search'
    end
  end

  resources :people,
    only: [:new, :edit, :create, :show, :update],
    constraints: Routes::InactiveReleaseOneConstraint
end
