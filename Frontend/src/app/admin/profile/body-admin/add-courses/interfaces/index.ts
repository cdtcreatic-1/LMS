// All Courses

export interface ResponseAllCourses {
  id_course: number;
  course_title: string;
  course_description: string;
  course_duration: string;
  course_instructor_name: string;
  course_price: number;
  course_presentation_content: string;
  course_start_date: Date;
  course_photo: string;
  id_status: number;
  course_created_at: Date;
  course_updated_at: null;
  id_course_profile: number;
  Modules: Module[];
  CourseLearnings: CourseLearning[];
  CourseObjectives: CourseObjective[];
}

export interface CourseLearning {
  id_learning: number;
  learning_text: string;
  id_course: number;
}

export interface CourseObjective {
  id_objective: number;
  objective_text: string;
  id_course: number;
}

export interface Module {
  id_module: number;
  module_title: string;
  module_description: string;
  module_resources: string;
  module_created_at: Date;
  module_updated_at: null;
  id_status: number;
  id_course: number;
  Submodules: Submodule[];
}

export interface Submodule {
  id_submodule: number;
  submodule_title: string;
  submodule_summary: string;
  submodule_resources: string;
  submodule_class_video: string;
  submodule_pass_percentage: number;
  submodule_created_at: Date;
  submodule_updated_at: null;
  id_status: number;
  id_module: number;
}

// CRUD Course

export interface ResponseGetCourse {
  id_course: number;
  course_title: string;
  course_description: string;
  course_duration: string;
  course_instructor_name: string;
  course_price: number;
  course_presentation_content: string;
  course_start_date: Date;
  course_photo: string;
  id_status: number;
  course_created_at: Date;
  course_updated_at: null;
  id_course_profile: number;
}

////////////////// Add Objetives //////////////////

export interface ResponseGetObjetives {
  objectives: Objetives[];
}

export interface Objetives {
  id_objective: number;
  objective_text: string;
  id_course: number;
}

//////////////// Add Skills ////////////////////////

export interface ResponseGetSkills {
  skills: Skill[];
}

export interface Skill {
  id_course: number;
  id_skill: number;
  skill_name: string;
}

// ////////////// ADD Modules ///////////////

export interface ResponseGetAllModules {
  modules: Modules[];
}

export interface Modules {
  id_module: number;
  module_title: string;
  module_description: string;
  module_resources: string;
  module_created_at: Date;
  module_updated_at: null;
  id_status: number;
  id_course: number;
}

export interface DataModule {
  id_module: number;
  module_title: string;
  module_description: string;
  module_resources: string;
  module_created_at: string;
  module_updated_at: Date;
  id_status: number;
  id_course: number;
}

/////////// Add Submodules ////////////

export interface ResponseGetAllSubModules {
  submodules: Submodule[];
}

export interface Submodule {
  id_submodule: number;
  submodule_title: string;
  submodule_summary: string;
  submodule_resources: string;
  submodule_class_video: string;
  submodule_pass_percentage: number;
  submodule_created_at: Date;
  id_status: number;
  id_module: number;
}

////////// Add Evaluaction //////////////

export interface ResponseGetEvaluation {
  id_evaluation: number;
  evaluation_title: string;
  evaluation_description: string;
  id_submodule: number;
}

/////////// Add Question and response ////////

export interface DataQuestions {
  id: number;
  idQuestion: number;
  name: string;
  question: string;
  isSelected: boolean;
  answers: AnswersLocal[];
}

export interface AnswersLocal {
  id: number;
  idAnswer: number;
  key: string;
  value: string;
  keyCheck: string;
  checked: boolean;
}

// Response

export interface ResponseGetQuestionAnswers {
  questions: Question[];
  answers: Array<Answer[]>;
}

export interface Answer {
  id_answer: number;
  answers_content: string;
  answers_validity: boolean;
  id_question: number;
}

export interface Question {
  id_question: number;
  question_content: string;
  id_submodule: number;
}

// request

export interface DataRequestQuestionAnswers {
  id_question?: number;
  question_content: string;
  answers: Answers[];
}

export interface Answers {
  id_answer?: number;
  answers_content: string;
  answers_validity: boolean;
}
