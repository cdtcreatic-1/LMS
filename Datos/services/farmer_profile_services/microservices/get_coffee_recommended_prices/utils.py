import requests
from bs4 import BeautifulSoup
import math

from .constants import url_reference_coffee_price, url_reference_dollar_value

def get_colombian_price_milds(url_reference_coffee_price):
    response = requests.get(url_reference_coffee_price)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser') 
        # - Extract price
        description = soup.find_all(class_='price')[0].text
        description = description.split(' ')[1]
        coffee_colombian_milds = description.replace('.','')
        len_coffee_colombian_milds = len(coffee_colombian_milds)
        if(len_coffee_colombian_milds<=4):
            coffee_colombian_milds = float(coffee_colombian_milds.replace(',','.'))
            return coffee_colombian_milds
        else: 
            coffee_colombian_milds = float(coffee_colombian_milds.replace(',','.'))
            coffee_colombian_milds = (coffee_colombian_milds/(1*10**(len_coffee_colombian_milds - 4)))
            return coffee_colombian_milds
    else:
        return None

def get_dollar_value(url_reference_dollar_value):
    response = requests.get(url_reference_dollar_value)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # - Extract value
        description = soup.find_all(class_='price')[0].text
        description = description.split(' ')[1]
        usd_value = float(description.replace('.','').replace(',','.'))

        return usd_value
    else:
        return None
    
def higher_price_calculator(variety_name):
    coefficients_dict = {
        'Score': 0.077,
        'Countries': 
            {
                'Colombia': -0.145,
            },
        'Varieties': 
            {
                'Catuai': -0.056,
                'Caturra': 0.049,
                'Typica': -0.002,
                'Pacamara': 0.158,
                'other': 0.002,
            },
    }

    variety_name = variety_name if variety_name in coefficients_dict['Varieties'].keys() else 'other'

    price = get_colombian_price_milds(url_reference_coffee_price)
    # if (coffee_values['Score'] > 87):
    price = price + (coefficients_dict['Score'])
    price = price + (coefficients_dict['Varieties'][variety_name])
    price = price + (coefficients_dict['Countries']['Colombia'])
    return pow(math.e, price)

def get_coffee_recommended_prices(variety_name):

    # - Get dollar value and colombian coffee milds
    usd_value = get_dollar_value(url_reference_dollar_value)
    colombian_coffee_milds = get_colombian_price_milds(url_reference_coffee_price)

    # - Get recommended prices
    # -- Lower price
    lower_price = colombian_coffee_milds * usd_value
    # -- Higher price
    higher_price = higher_price_calculator(variety_name)
    higher_price = higher_price*usd_value
    # -- Recommended price
    recommended_price = higher_price * 0.5
    
    prices = (lower_price, recommended_price, higher_price)
    prices = [round(p, 2) for p in prices] 

    return prices
