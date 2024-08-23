import { Router } from '@angular/router';
import { ROUTES } from '../constants';

export const ProtectedRouteAdminLogin = (router: Router) => {
  const adminLogin = localStorage.getItem('@adminLogin');
  if (!adminLogin) {
    router.navigate([ROUTES.ADMIN_LOGIN]);
  }
};

export const handleKeyDown = (e: any) => {
  const key = e.key;
  if (
    key !== '0' &&
    key !== '1' &&
    key !== '2' &&
    key !== '3' &&
    key !== '4' &&
    key !== '5' &&
    key !== '6' &&
    key !== '7' &&
    key !== '8' &&
    key !== '9' &&
    key !== 'Backspace' &&
    key !== 'Delete' &&
    key !== 'ArrowRight' &&
    key !== 'ArrowLeft' &&
    key !== 'Tab'
  ) {
    e.preventDefault();
  }
};

export const handleSpeakMessage = (message: string) => {
  const utterance = new SpeechSynthesisUtterance(message);
  return window.speechSynthesis.speak(utterance);
};
