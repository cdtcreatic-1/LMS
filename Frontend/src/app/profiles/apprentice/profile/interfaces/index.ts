export interface AllCourses {
  id_course: number;
  course_title: string;
  course_description: string;
  course_duration: string;
  course_instructor_name: string;
  course_price: number;
  course_presentation_content: string;
  course_start_date: string;
  course_photo: string;
  id_status: number;
  course_created_at: string;
  course_updated_at: null;
  id_course_profile: number;
  is_purchasable: boolean;
  modules: Module[];
  submodules: Submodule[];
  CourseObjectives: CourseObjetives[];
}

// My courses

export interface ResponseGetMyCourses {
  message: string;
  data: MyCourseInfo[];
}

export interface MyCourseInfo {
  id_user: number;
  id_course: number;
  registration_date: Date;
  learner_opinion_about_course: null;
  progress_percent: number;
  learning_style: null;
  Course: MyCourse;
  Modules: Module[];
  submodule: Submodule;
}

export interface MyCourse {
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
  course_updated_at: null;
}

export interface Module {
  id_module: number;
  module_title: string;
  module_description: string;
  module_created_at: Date;
  module_updated_at: null;
  module_status: boolean;
  id_course: number;
}

export interface Submodule {
  id_submodule: number;
  submodule_title: string;
  submodule_summary: string;
  submodule_resources: string;
  submodule_class_video: string;
  submodule_created_at: Date;
  submodule_updated_at: null;
  submodule_status: boolean;
  id_module: number;
}

export interface CourseObjetives {
  id_course: number;
  id_objective: number;
  objective_text: string;
}

// CarShop Courses

export interface ResponseGetCarCourses {
  message: string;
  cartCourses: CartCourse[];
}

export interface CartCourse {
  id_cart_course: number;
  is_in_purchase: boolean;
  cart_created_at: Date;
  cart_updated_at: null;
  Course: Course;
}

export interface Course {
  id_course: number;
  course_title: string;
  course_description: string;
  course_price: number;
  course_photo: string;
  id_status: number;
  id_course_profile: number;
}

// Purchase

export interface RequestPurchase {
  shipping_address: string;
  additional_notes: string;
  id_shipping_option: number;
  courseData: CoursePurchaseData[];
}

export interface CoursePurchaseData {
  id_cart_course: number;
}

export interface ResponsePurcahse {
  message: string;
  purchases: PurchaseApprentice[];
}

export interface PurchaseApprentice {
  id_course: number;
  session_id: string;
}

// Chat boot

export interface DataChatBoot {
  value: string;
  id: number;
}

export interface ResponseChatBoot {
  answer: string;
}

// Notification
export interface ItemsNavBarNotification {
  id: number;
  name: string;
  isSelected: boolean;
}

// Evaluation flow

// Item navbar

export interface ItemsNavBar {
  id: number;
  name: string;
  route: string;
  isSelected: boolean;
}

// Type learning

export interface AnswerQuery {
  id_question: number;
  id_answer: number;
}

// Kills

export interface AllSkills {
  id_skill: number;
  skill_name: string;
}

export interface QuerySkills {
  id_skill: number;
}
