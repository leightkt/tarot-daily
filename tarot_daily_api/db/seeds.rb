# require 'rest-client'
# require 'json'
Reading.destroy_all
User.destroy_all
Card.destroy_all


kat = User.create(name: "Kat", user_name: "kitkat", password: "pw", star_sign: "Aries")

response = RestClient.get 'https://rws-cards-api.herokuapp.com/api/v1/cards/'
result = JSON.parse response
cards = result["cards"]
cards.map do |card|
    Card.create(
    name: card["name"],
    name_short: card["name_short"],
    value: card["value"],
    value_int: card["value_int"],
    suit: card["suit"],
    card_type: card["type"],
    meaning_up: card["meaning_up"],
    meaning_rev: card["meaning_rev"],
    desc: card["desc"]
    )
end

magician = Card.find_by(name: "The Magician")
devil = Card.find_by(name: "The Devil")
six_wands = Card.find_by(name: "Six of Wands")

Reading.create(
    date: Time.now.to_s.split(' ')[0],
    question: "What does a bad bitch need to know?",
    user: kat,
    card: magician,
    direction: "up"
)