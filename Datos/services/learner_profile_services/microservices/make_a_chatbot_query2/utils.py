import openai
from os import path, remove, rename
import pandas as pd

from shared.func_utils import execute_function_with_timeout
from shared.utils import verbosity
from .constants import dic_course_thematic_mapping

'''
    This code was adapted from https://github.com/DimensionPardo/chatbot
'''

'''
Is important install nltk, tensorflow and keras
'''

import random
import json
import pickle
import numpy as np
import nltk
nltk.download(['punkt', 'wordnet'])

from keras.models import load_model

from nltk.stem import WordNetLemmatizer

from keras.models import load_model

lemmatizer = WordNetLemmatizer()

from .constants import *

cwd = path.dirname(path.abspath(__file__))


class Model:
    def __init__(self, course_name):
        self.course_name = course_name
        course_parameters = {
            'curso de tostador':{
                'intents_path': path.join(cwd, 'static/roasting_models/intents_roasting.json'),
                'words_path': path.join(cwd, 'static/roasting_models/words_roasting.pkl'),
                'classes_path': path.join(cwd, 'static/roasting_models/classes_roasting.pkl'),
                'model_path': path.join(cwd, 'static/roasting_models/model_roasting.keras'),
                'std_ref': 0.1
                },
            'catación de café':{
                'intents_path': path.join(cwd, 'static/tasting_models/intents_tasting.json'),
                'words_path': path.join(cwd, 'static/tasting_models/words_tasting.pkl'),
                'classes_path': path.join(cwd, 'static/tasting_models/classes_tasting.pkl'),
                'model_path': path.join(cwd, 'static/tasting_models/model_tasting.keras'),
                'std_ref': 0.1
                }
            }    
        
        intents_path = course_parameters[course_name]['intents_path']
        words_path = course_parameters[course_name]['words_path']
        classes_path = course_parameters[course_name]['classes_path']
        model_path = course_parameters[course_name]['model_path']
        
        self.std_ref = course_parameters[course_name]['std_ref']

        self.intents = json.loads(open(intents_path).read())
        self.words = pickle.load(open(words_path, 'rb'))
        self.classes = pickle.load(open(classes_path, 'rb'))
        self.model = load_model(model_path)
    
    def get_course_name (self):
       return self.course_name
    
    def get_std_ref (self):
       return self.std_ref
   
    def get_intents (self):
       return self.intents
   
    def get_words (self):
       return self.words
   
    def get_classes (self):
       return self.classes
    
    def get_model (self):
       return self.model

class ChatBotPreprocessingFunctions():
    
    #Pasamos las palabras de oración a su forma raíz
    def clean_up_sentence(self, sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
        return sentence_words

    #Convertimos la información a unos y ceros según si están presentes en los patrones
    def bag_of_words(self, sentence):
        sentence_words = self.clean_up_sentence(sentence)
        bag = [0]*len(self.model.get_words())
        # print(f'words: {words}')
        for w in sentence_words:
            for i, word in enumerate(self.model.get_words()):
                if word == w:
                    bag[i]=1

        return np.array(bag)


class ChatbotPredictor(ChatBotPreprocessingFunctions):
    
    def __init__(self, model:Model):
        self.model = model
    
    
    #Predecimos la categoría a la que pertenece la oración
    def predict_class(self, sentence):
        bow =self.bag_of_words(sentence)
        res = self.model.get_model().predict(np.array([bow]))[0]
        max_index = np.where(res ==np.max(res))[0][0]
        category = self.model.get_classes()[max_index]
        return category, res.std()


    #Obtenemos una respuesta aleatoria
    def format_response(self, tag, intents_json):
        list_of_intents = intents_json['intents']
        result = ""
        for i in list_of_intents:
            if i["tag"]==tag:
                result = random.choice(i['responses'])
                break
        return result

    #Obtenemos la respuesta
    def get_answer(self, message:str, std_ref):
        category, standard_deviation = self.predict_class(message)
        # print(standard_deviation)
        verbosity(f'{category}. {standard_deviation:.5f}', tl=3)
        if (standard_deviation > std_ref):
            result = self.format_response(category, self.model.get_intents())
        else:
            result = False
        return result

    def make_query(self, question: str, tl_ini: int = 3):
    
        verbosity(f'Buscando respuesta en modelo', tl= tl_ini, level='cyan')
        answer = self.get_answer(question, self.model.get_std_ref())
        
        if answer:
            verbosity(f'Respuesta encontrada...', tl= tl_ini, level='cyan')
            return answer
        else:
            verbosity('Respuesta no encontrada en modelo', tl=tl_ini, level='error')


def consult_chatgpt(question: str, course_name: str,
                    api_key:str, model: str = 'gpt-3.5-turbo'):
    '''
    Updated for various courses thematics
    v2.0.0
    '''

    # - Set api key
    openai.api_key = api_key

    # - Asistant message
    asistant_message = 'Vas a actuar como un experto con conocimientos para un curso con la siguiente temática: "<thematic>", \
    tu labor consiste en responder preguntas únicamente sobre dicha temática. \
    Rechaza preguntas fuera de este tema, aclarando que solo respondes a consultas explícitamente relacionadas con la temática en cuestión.'
    
    asistant_message = asistant_message.replace('<thematic>',
                                                dic_course_thematic_mapping[course_name]['thematic'])

    # - Get response
    verbosity(f'Obteniendo respuesta...', tl=3)
    response = openai.ChatCompletion.create(
        model= model,
        messages = [
            {'role': 'system', 'content': asistant_message},
            {'role': 'user', 'content': question}
        ],
        temperature = 0
    )
    # verbosity(response)

    total_tokens = response.usage.total_tokens
    answer = response.choices[0].message.content
    verbosity(f'Numero de tokens usados: {total_tokens}', tl=3, level='cyan')

    return answer

# Functions
def excel_intents_to_json(excel_file_path: str, tl_ini: int=3):

    # - Read excel file
    ef = pd.ExcelFile(excel_file_path)

    # - Scroll through excel sheets
    for sheet_name in ef.sheet_names:
        df = ef.parse(sheet_name)
        # - Drop empty rows
        df.fillna('_',inplace=True)

        # - Separate entities
        poss_ini_entities = list(np.where(df['tag'].to_numpy() != '_')[0])
        poss_ini_entities += [len(df)]
        list_intents = []
        for i in range(len(poss_ini_entities)-1):
            a,b = poss_ini_entities[i], poss_ini_entities[i+1]
            sdf = df[a:b]
            sdf.reset_index(drop=True, inplace=True)

            d_intents = {
                'tag': sdf.loc[0, 'tag'],
                'patterns': [v for v in sdf['patterns'] if v != '_'],
                'responses': [v for v in sdf['responses'] if v != '_'],
            }
            list_intents.append(d_intents)

        sheet_name = sheet_name.split('_course')[0]
        output_file_name = f'intents_{sheet_name}.json'
        output_file_dir = path.join(path.dirname(excel_file_path), f'{sheet_name}_models')
        with open(path.join(output_file_dir, output_file_name), 'w') as fp:
            json.dump({'intents': list_intents}, fp, ensure_ascii=False, indent=2)

    return 1

def add_intent_to_excel(excel_file_path: str, course_name: str,
                        question: str, answer: str, tl_ini: int=3):
    
    # - Build new subdataframe
    ndf = pd.DataFrame({
            'tag': ['XXXX'],
            'patterns': [question],
            'responses': [answer],
            'revised': [0],
        })
    
    # - Save data in temporal file
    temp_file_path = excel_file_path.replace('.xlsx', '~temp.xlsx')
    ref_word = dic_course_thematic_mapping[course_name]['ref_word']
    updated = False
    with pd.ExcelWriter(temp_file_path) as writer:
        # - Read original excel
        ef = pd.ExcelFile(excel_file_path)
        # - Scroll through excel sheets
        for sheet_name in ef.sheet_names:
            df = ef.parse(sheet_name)
            if sheet_name == f'{ref_word}_course':
                if question not in df['patterns'].values:
                    verbosity(f'Datos de [{sheet_name}] actualizados', tl=tl_ini+1)
                    df = pd.concat([df, ndf])
                    updated = True
            df.to_excel(writer, sheet_name=sheet_name, index=False)

    # - Replace file
    remove(excel_file_path)
    rename(temp_file_path, excel_file_path)

    return 1, updated

def use_chatgpt_as_chatbot(question: str, course_name: str, api_key: str, model: str = 'gpt-3.5-turbo',
                           execute_with_timeout: bool = True, maximum_wait_time: int = 30,
                           verb: bool = False):
    
    dic_params = {
        'question': question,
        'course_name': course_name,
        'api_key': api_key,
        'model': model
    }

    if api_key is None:
        raise ValueError("Api key no proporcionada")
    else:
        try:
            if execute_with_timeout:
                answer = execute_function_with_timeout(maximum_wait_time, consult_chatgpt,
                                                    dic_params)
            else:
                answer = consult_chatgpt(**dic_params)

        except Exception as e:
            verbosity(e, level='error')
            answer = None
        
    return answer

# Main function
def make_a_chatbot_query2(question: str, course_name: str,
                          api_key: str, tl_ini: int = 3):

    verbosity(f'Cargando modelo y creando objeto requerido', tl=tl_ini)
    model = Model(course_name)
    predictor = ChatbotPredictor(model)
    answer = predictor.make_query(question)

    if not answer:
        verbosity('Consultando a ChatGPT...', tl=tl_ini, level='cyan')
        answer = use_chatgpt_as_chatbot(question, course_name, api_key)
        # - Add answer to training file
        verbosity('Actualizando data de entrenamiento...', tl=tl_ini, level='cyan')
        success, excel_updated = add_intent_to_excel(training_excel_file_path, course_name, question, answer)
        if not success:
            s = 'Fallo al actualizar excel de entrenamiento'
            verbosity(s, tl=tl_ini+1, level='error')
            raise RuntimeError(s)
        else:
            if not excel_updated:
                verbosity('Pregunta ya existente en archivo excel.', tl=tl_ini+1)
            else:
                verbosity('Archivo excel de entrenamiento actualizado.', tl=tl_ini+1)
                # - Update intents json
                jsons_updated = excel_intents_to_json(training_excel_file_path)
                if jsons_updated:
                    verbosity('Archivo json de entrenamiento actualizados.', tl=tl_ini+1)
                else:
                    s = 'Fallo al actualizar json de entrenamiento'
                    verbosity(s, tl=tl_ini+1, level='error')
                    raise RuntimeError(s)
        
    return answer
