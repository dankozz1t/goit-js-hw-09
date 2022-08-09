class ChangerColor {
  constructor({ btnStartEl, btnStopEl, bodyEl }) {
    this.btnStart = btnStartEl;
    this.btnStop = btnStopEl;
    this.color = bodyEl;

    this.onChange = null;
    this.#btnToggle(this.btnStop);
  }

  start() {
    this.#btnToggle(this.btnStart);
    this.#btnToggle(this.btnStop);

    this.onChange = setInterval(() => {
      this.color.style.backgroundColor = this.#getRandomHexColor();
    }, 1000);
  }

  stop() {
    this.#btnToggle(this.btnStop);
    this.#btnToggle(this.btnStart);

    clearInterval(this.onChange);
  }

  #getRandomHexColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  #btnToggle(btn) {
    btn.disabled = !btn.disabled;
  }
}

const refs = {
  btnStartEl: document.querySelector('button[data-start]'),
  btnStopEl: document.querySelector('button[data-stop]'),
  bodyEl: document.body,
};

const changerColor = new ChangerColor(refs);

refs.btnStartEl.addEventListener(
  'click',
  changerColor.start.bind(changerColor)
);
refs.btnStopEl.addEventListener('click', changerColor.stop.bind(changerColor));
