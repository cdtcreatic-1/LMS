import numpy as np

from shared.db_utils import consult_data_by_fields
from shared.db_utils import consult_data
from shared.utils import verbosity

class User():
    
    def __init__(self, id_user):
        self.id_user = id_user
        self.id_type_user = 1
        
    
    def get_id_user(self):
        return self.id_user
    
    
    def get_id_type_user(self):
        return self.id_type_user
    
    
    def set_id_type_user(self, type_user):
        self.id_type_user = type_user

class CourseRecommendationOperation():
    
    def __init__(self, connection_element, id_user: int,
                                                tl_ini:int = 3, number_of_curses_to_recommend:int = 6):
        '''
        class: CourseRecommendationOperation
        args: 
            connection_element: connection to database
            id_user: id of user
            tl_ini: level of verbosity
            number_of_curses_to_recommend: size of final list
        '''
        self.user = User(id_user)
        self.connection_element = connection_element
        self.tl_ini = tl_ini
        self.number_of_courses_to_recommend = number_of_curses_to_recommend
        
        
    def remove_duplicate_courses(self):
        verbosity('Eliminar cursos ya vistos por el usuario de la lista a recomendar', tl=self.tl_ini, level='cyan')
        
        verbosity('Consultando cursos tomados por el usuario...', tl=self.tl_ini)
        self.ids_courses_taken_by_user = consult_data_by_fields(
            self.connection_element, 'users_courses_table',
            'id_course', f'id_user={self.user.get_id_user()}'
            ).values.flatten()
        self.tl_ini+=1
        
        verbosity(f'Cursos tomados por el usuario: {self.ids_courses_taken_by_user}', tl=self.tl_ini)
                
        verbosity('Comparando cursos no vistos por el usuario...', tl=self.tl_ini)
        
        self.courses_to_recommend = np.setdiff1d(self.courses_to_recommend, self.ids_courses_taken_by_user)
                        
        verbosity(f'lista de cursos a recomendar: {self.courses_to_recommend}', tl=self.tl_ini)
        
    
    def complete_courses_to_recommend_list(self):
        
        verbosity('Ingreso a la función para completar la lista de forma aleatoria', tl=self.tl_ini, level='cyan')
        self.tl_ini+=1
        verbosity('Obteniendo la lista total de cursos', tl=self.tl_ini)
        courses_complete_list = consult_data_by_fields(
            self.connection_element, 'course_table', 'id_course'
            ).values.flatten()
        verbosity(f'lista total de cursos: {courses_complete_list}', tl=self.tl_ini)
        
        
        new_courses_to_recommend = np.setdiff1d(courses_complete_list, self.ids_courses_taken_by_user)
        new_courses_to_recommend = np.setdiff1d(new_courses_to_recommend, self.courses_to_recommend)
        
        verbosity(f'cursos que falta por recomendar: {new_courses_to_recommend} curso(s)', tl=self.tl_ini)
        
        self.tl_ini+=1
        
        number_required_courses = self.number_of_courses_to_recommend-len(self.courses_to_recommend)
        
        if(number_required_courses>len(new_courses_to_recommend)):
            number_required_courses = len(new_courses_to_recommend)
        new_courses_id = np.random.choice(a=new_courses_to_recommend, size=number_required_courses, replace=False)
        
        
        verbosity(f'nuevo(s) curso(s) obtenido(s) de forma aleatoria: {new_courses_id}', tl=self.tl_ini)
        verbosity(f'añadiendo curso(s) a la lista', tl=self.tl_ini)
                
        self.courses_to_recommend = np.append(self.courses_to_recommend, new_courses_id)
        
        verbosity(f'nueva lista de cursos a recomendar: {self.courses_to_recommend}', tl=self.tl_ini)
        
    
    def damage_control_in_courses_to_recommend_list(self):
        self.tl_ini+=1
        verbosity('Se ingresó a la función para añadir cursos si ya hay una lista de cursos a recomendar', tl=self.tl_ini)
        try:
            self.courses_to_recommend = np.append(self.courses_to_recommend, self.aux_courses_to_recommend)
            verbosity(f'Ya existen algunos cursos a recomendar, añadiendo los nuevos', tl=self.tl_ini)
        except(AttributeError):
            verbosity(f'No existe la lista aún, creando lista:', tl=self.tl_ini)
            self.courses_to_recommend=np.copy(self.aux_courses_to_recommend)
            
        verbosity(f'Lista final: {self.courses_to_recommend}', tl=self.tl_ini)
        verbosity(f'Saliendo de la función', tl=self.tl_ini)
        self.tl_ini-=1
            
    def remove_duplicates_from_np_array(self, np_array):
        np_array = set(np_array)
        np_array = np.array(list(np_array))
        return np_array

    def get_course_recommendation_by_skills_match(self):
        '''
        v1.1.0
        '''
        self.tl_ini+=1
        verbosity('Ingreso a la función para recomendar cursos por intereses del usuario', tl=self.tl_ini, level='cyan')
        verbosity('Consultando cursos que coinciden en los intereses del usuario', tl=self.tl_ini)
        
        self.aux_courses_to_recommend = consult_data(
            self.connection_element, f'select id_course from user_skill_preferences usp natural join course_skills_table where usp.id_user={self.user.get_id_user()};').flatten()
        
        self.aux_courses_to_recommend = self.remove_duplicates_from_np_array(self.aux_courses_to_recommend)
        
        verbosity(f'Se encontraron los siguientes: {self.aux_courses_to_recommend}', tl=self.tl_ini)
        
        self.damage_control_in_courses_to_recommend_list()
        
        verbosity(f'Volviendo a la función de recomendar cursos por habilidad', tl=self.tl_ini)
        
        verbosity(f'Cursos a recomendar: {self.courses_to_recommend}', tl=self.tl_ini)
        
        self.remove_duplicate_courses()
        

    def get_course_recommendation_by_user_type(self):
        
        self.tl_ini+=1
        verbosity('Ingresando a la función para obtener la recomendación basada en el tipo de usuario', tl=self.tl_ini, level='cyan')
       
        verbosity('Obteniendo los cursos que han visto otros usuarios del mismo tipo', tl=self.tl_ini)
        self.courses_to_recommend = consult_data(
            self.connection_element, f'select id_course from users_table ut natural join users_courses_table uct where ut.id_role={self.user.get_id_type_user()};').flatten()
        
        verbosity(f'Se encontraron los siguientes curso: \n{self.courses_to_recommend}', tl=self.tl_ini)
        self.remove_duplicate_courses()
        
        if(len(self.courses_to_recommend)<self.number_of_courses_to_recommend):
            verbosity('Se detectó que faltan cursos en la lista y se añadirán de acuerdo a las preferencias', tl=self.tl_ini)
            self.get_course_recommendation_by_skills_match()
        
        
    def get_user_type_id(self):
        user_type_ids = consult_data_by_fields(
            self.connection_element, 'user_role', 'id_role', where=f'id_user={self.user.get_id_user()}'
            ).values.flatten()
        
        if ((1 in user_type_ids) and 2 in user_type_ids):
            user_type_id = 5
        elif ((1 in user_type_ids) ):
            user_type_id = 1
        elif ((2 in user_type_ids) ):
            user_type_id = 2
        else:
            user_type_id = 3
            
        return user_type_id
        
    def order_courses_to_recommend_list(self):
        courses_list = consult_data(
            self.connection_element, f'select id_course, count(*) as total from users_courses_table uct group by id_course order by total desc;')
        verbosity(f'Lista de cursos ordenada {self.courses_to_recommend}',
            tl=self.tl_ini, level='cyan')
        # for id_course, total in 
        
        
        
    
    def get_course_recommendation(self):
        # - Skills selected by user
        verbosity('Ingresando al recomendador de cursos',
            tl=self.tl_ini, level='cyan')
        
        verbosity('Obteniendo los tipos de usuario', tl=self.tl_ini)
        self.user.set_id_type_user(self.get_user_type_id())
        
        self.tl_ini+=1
        
        verbosity(f'id de tipo de usuario: {self.user.get_id_type_user()}',
            tl=self.tl_ini)
        
        if(self.user.get_id_type_user()==1 or self.user.get_id_type_user()==2):
            
            self.tl_ini+=1
            
            verbosity('El tipo de usuario es vendedor o empresario', tl=self.tl_ini)
            
            self.get_course_recommendation_by_user_type()
        else:
            verbosity('El tipo de usuario es diferente de vendedor o empresario', tl=self.tl_ini)
            self.get_course_recommendation_by_skills_match()
            
        verbosity(f'El numero de cursos final es: {len(self.courses_to_recommend)}', tl=self.tl_ini)
        
        if(len(self.courses_to_recommend)<self.number_of_courses_to_recommend):
            verbosity('Se detectó que faltan cursos en la lista y se añadirán de forma aleatoria', tl=self.tl_ini)
            self.complete_courses_to_recommend_list()
        
        self.tl_ini-=2
        
        if(len(self.courses_to_recommend)>self.number_of_courses_to_recommend):
            verbosity('Se detectó que sobran cursos en la lista y serán restados', tl=self.tl_ini, level='cyan')
            self.courses_to_recommend = self.courses_to_recommend[:self.number_of_courses_to_recommend]
            verbosity(f'nueva lista de cursos a recomendar: {self.courses_to_recommend}', tl=self.tl_ini)
         
        self.order_courses_to_recommend_list()
         
        return self.courses_to_recommend
