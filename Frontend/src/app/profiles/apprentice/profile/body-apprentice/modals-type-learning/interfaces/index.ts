export interface DataStepsApprentice {
  id_question: number;
  question_content: string;
  answers: { id_answer: number; answer_content: string; isSelected: boolean }[];
}
