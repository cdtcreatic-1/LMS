export interface ResponseGetAllInfoCourse {
  id_course: number;
  course_title: string;
  course_description: string;
  course_duration: string;
  course_instructor_name: string;
  course_price: number;
  course_curriculum_file: string;
  course_start_date: Date;
  course_photo: string;
  course_video: string;
  course_status: boolean;
  course_created_at: Date;
  course_updated_at: Date;
  Modules: Module[];
}

export interface Module {
  id_module: number;
  module_title: string;
  module_description: string;
  module_created_at: Date;
  module_updated_at: null;
  module_status: boolean;
  id_course: number;
  isSelected: boolean;
  isAccordion: boolean;
  Submodules: Submodules[];
}

export interface Submodules {
  id_submodule: number;
  submodule_title: string;
  submodule_summary: string;
  submodule_resources: string;
  submodule_class_video: string;
  submodule_created_at: Date;
  submodule_updated_at: null;
  submodule_status: boolean;
  id_module: number;
  isSelected: boolean;
  is_enabled: boolean;
  UserSubmoduleProgress: {
    id: number;
    id_user: number;
    id_submodule: number;
    is_completed: boolean;
    success_rate: number;
  };
}

// Mapping Data Modules

export interface DataModules {
  id_module: number;
  module_title: string;
  isSelected: boolean;
  submodules: (Submodules & { isSelected: boolean })[];
}

// Data evaluation

export interface ResponseGetAllQuestionsAnswers {
  id_submodule: number;
  submodule_title: string;
  submodule_summary: string;
  submodule_resources: string;
  submodule_class_video: string;
  submodule_created_at: Date;
  submodule_updated_at: null;
  submodule_status: boolean;
  id_module: number;
  SubmoduleQuestions: SubmoduleQuestion[];
}

export interface SubmoduleQuestion {
  id_question: number;
  question_content: string;
  id_submodule: number;
  question_description: null;
  SubmoduleAnswers: SubmoduleAnswer[];
}

export interface SubmoduleAnswer {
  id_answer: number;
  answers_content: string;
  answers_validity: boolean;
  id_question: number;
  isSelected: boolean | null;
  isSelected_false: boolean | null;
}

// Send http request

export interface DataAnswers {
  id_question: number;
  id_answer: number[];
}

// REsponse question answers table

export interface InitialFormTableQuestionResult {
  idSubmodule: string;
}

export interface ResponseDataQuestionAnswers {
  status: string;
  success_rate: number;
  user_answers: UserAnswer[];
}

export interface UserAnswer {
  order: number;
  question_content: string;
  validity: boolean;
}

// Percentage table

export interface DataPercentageTable {
  progress_rate: number;
  status: string;
  data: DataGraphicsPercentage[];
}

export interface DataGraphicsPercentage {
  label: string;
  value: number;
}

// Certificate

export interface GeneratedCertificated {
  certificate_file_path: string;
  status: string;
}
