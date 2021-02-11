Rails.application.routes.draw do
  resources :readings, except: [:update]
  resources :cards, only: [:show, :index]
  resources :users
  get "/reading", to: "cards#random_card"
  post "/login", to: "users#login"
  get "/horoscope", to: "horoscopes#daily_horoscope"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
