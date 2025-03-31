import BirthdayPicker from './index';
import './_preview.css';

const el = document.querySelector('.bp');

const options = {
  locale: 'de',
  defaultDate: 'now',
};

new BirthdayPicker(el, options);
