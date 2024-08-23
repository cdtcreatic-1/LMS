from os import path

cwd = path.dirname(__file__)

STD_REF = 0.035

dic_course_thematic_mapping = {
    'curso de tostador': {
        'thematic': 'Proceso de tostado del café y sus técnicas',
        'ref_word': 'roasting',
        },
    'catación de café': {
        'thematic': 'Catación, apreciación y evaluación sensorial del café.',
        'ref_word': 'tasting',
        }
    }

training_excel_file_path = path.join(cwd, 'static/courses_intents.xlsx')
