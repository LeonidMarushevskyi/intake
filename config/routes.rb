# frozen_string_literal: true

Rails.application.routes.draw do
  root 'welcome#index'
  resources :style_guide, only: [:index, :show]
  resources :screenings, only: [:create, :edit, :show, :update, :index]
  resources :people, only: [:new, :edit, :create, :show, :update] do
    collection do
      get 'search'
    end
  end
end
