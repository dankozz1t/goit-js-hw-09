const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  btnReset: document.querySelector('button[data-reset]'),
  btnStartBase: document.querySelector('button[data-startBase]'),
  btnResetBase: document.querySelector('button[data-resetBase]'),
  spanDays: document.querySelector('span[data-days]'),
  spanHours: document.querySelector('span[data-hours]'),
  spanMinutes: document.querySelector('span[data-minutes]'),
  spanSeconds: document.querySelector('span[data-seconds]'),
};
class Timer {
  constructor({ onUpdateUI, dateStart = 0, onStop = null }) {
    this.dateStart = dateStart;
    this.intervalId = null;

    this.onUpdateUI = onUpdateUI;
    this.onStop = onStop;
    this.update();
  }

  update(remainder = 0) {
    this.onUpdateUI(this.convertMs(remainder));
  }

  startCountdown() {
    let dateCurrent = Date.now();

    this.intervalId = setInterval(() => {
      dateCurrent = Date.now();

      let remainder = this.dateStart - dateCurrent;

      if (remainder <= 0) {
        this.stop();
        return;
      }

      this.update(remainder);
    }, 1000);
  }

  start() {
    // BASE TIMER
    const startTime = Date.now();

    this.intervalId = setInterval(() => {
      const curDate = Date.now();
      this.update(curDate - startTime);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.update();
    if (this.onStop) {
      this.onStop();
    }
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.btnStart.disabled = true;
refs.btnReset.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.parse(selectedDates[0]) < Date.now()) {
      Notify.failure('Please choose a date in the future');
      refs.btnStart.disabled = true;
      return;
    }
    refs.btnStart.disabled = false;

    const timer = new Timer({
      onUpdateUI: updateClockface,
      dateStart: Date.parse(selectedDates[0]),
      onStop,
    });
    refs.btnStart.addEventListener('click', () => {
      timer.startCountdown(timer);

      refs.inputDate.disabled = true;
      btnToggle(refs.btnStart, refs.btnReset);

      refs.btnStartBase.disabled = true;
    });
    refs.btnReset.addEventListener('click', () => {
      timer.stop(timer);

      refs.inputDate.disabled = false;
      btnToggle(refs.btnStart, refs.btnReset);

      refs.btnStartBase.disabled = false;
    });
  },
});

function onStop() {
  refs.btnResetBase.disabled = true;
  refs.btnReset.disabled = true;
  Notify.success('Good!');
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.spanDays.textContent = days;
  refs.spanHours.textContent = hours;
  refs.spanMinutes.textContent = minutes;
  refs.spanSeconds.textContent = seconds;
}

// BASE TIMER
const timer = new Timer({
  onUpdateUI: updateClockface,
});
refs.btnResetBase.disabled = true;

refs.btnStartBase.addEventListener('click', () => {
  timer.start();
  btnToggle(refs.btnStartBase, refs.btnResetBase);

  refs.btnStart.disabled = true;
  refs.btnReset.disabled = true;
});

refs.btnResetBase.addEventListener('click', () => {
  timer.stop();
  btnToggle(refs.btnStartBase, refs.btnResetBase);
});

function btnToggle(...btns) {
  for (const btn of btns) {
    btn.disabled = !btn.disabled;
  }
}

//TODO: fix btnToggle (bugs more click)
