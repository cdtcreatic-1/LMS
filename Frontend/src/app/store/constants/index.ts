import {
  DataChatBoot,
  ItemsNavBar,
  ItemsNavBarNotification,
} from 'src/app/profiles/apprentice/profile/interfaces';

export const intialValueChatBooot: DataChatBoot = {
  id: 2,
  value: 'Hola, soy tu asistente. Hazme una pregunta',
};

export const reponseInvalid = '¡Lo siento! En este momento no puedo atenderte';

export const itemNavbar: ItemsNavBar[] = [
  {
    id: 1,
    name: 'Capacitación',
    route: './training-video',
    isSelected: true,
  },
  {
    id: 2,
    name: 'Evaluación',
    route: './evaluation',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Resultados',
    route: './results',
    isSelected: false,
  },
];

export const itemsNavBarNotification: ItemsNavBarNotification[] = [
  {
    id: 1,
    name: 'Cursos nuevos',
    isSelected: true,
  },
  {
    id: 2,
    name: 'Cursos terminados',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Cursos adquiridos',
    isSelected: false,
  },
];
