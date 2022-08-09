const refs = {
  btnStartEl: document.querySelector('button[data-start]'),
  spanDays: document.querySelector('span[data-days]'),
  spanHours: document.querySelector('span[data-hours]'),
  spanMinutes: document.querySelector('span[data-minutes]'),
  spanSeconds: document.querySelector('span[data-seconds]'),
};
class Timer {
  constructor({ dateStart, updateUI }) {
    this.dateStart = dateStart;
    this.intervalId = null;

    this.updateUI = updateUI;
    this.update();
  }

  update(remainder = 0) {
    this.updateUI(this.convertMs(remainder));
  }

  startCountdown() {
    let dateCurrent = Date.now();

    this.intervalId = setInterval(() => {
      dateCurrent = Date.now();

      let remainder = dateStart - dateCurrent;

      if (remainder <= 0) {
        this.stop();
        return;
      }

      this.update(remainder);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.update();
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

refs.btnStartEl.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.parse(selectedDates[0]) < Date.now()) {
      window.alert('Please choose a date in the future');
      refs.btnStartEl.disabled = true;
      return;
    }
    refs.btnStartEl.disabled = false;

    const timer = new Timer({
      dateStart: Date.parse(selectedDates[0]),
      updateUI: updateClockface,
    });
    refs.btnStartEl.addEventListener('click', timer.startCountdown.bind(timer));
  },
});

function updateClockface({ days, hours, minutes, seconds }) {
  console.log(`${days}:${hours}:${minutes}:${seconds}`);
  refs.spanDays.textContent = days;
  refs.spanHours.textContent = hours;
  refs.spanMinutes.textContent = minutes;
  refs.spanSeconds.textContent = seconds;
}
