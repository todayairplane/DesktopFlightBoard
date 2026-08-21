(function () {

  const MODE_KEY = 'flightBoardDisplayMode';

  let previousSnapshot = new Map();
  let observer = null;
  let updateTimer = null;


  function getDisplaySelect() {
    return document.getElementById('display-select');
  }


  function getFlightList() {
    return document.getElementById('flight-list');
  }


  function getMode() {
    try {
      return localStorage.getItem(MODE_KEY) || 'normal';
    } catch (error) {
      return 'normal';
    }
  }


  function saveMode(mode) {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (error) {
      console.warn('Could not save display mode');
    }
  }


  function applyMode(mode, animateAll) {

    if (mode === 'split') {
      document.body.classList.add('split-flap-mode');
    } else {
      document.body.classList.remove('split-flap-mode');
    }


    const select = getDisplaySelect();

    if (select) {
      select.value = mode;
    }


    saveMode(mode);


    if (
      mode === 'split' &&
      animateAll
    ) {
      animateWholeBoard();
    }

  }


  function flapElementsInRow(row) {

    return [
      row.querySelector('.schedule-time'),
      row.querySelector('.estimated-time'),
      row.querySelector('.col-destination'),
      row.querySelector('.col-flight'),
      row.querySelector('.aircraft-code'),
      row.querySelector('.terminal-text'),
      row.querySelector('.gate-text')
    ].filter(Boolean);

  }


  function restartAnimation(element) {

    if (!element) {
      return;
    }

    element.classList.remove('flap-changing');

    void element.offsetWidth;

    element.classList.add('flap-changing');


    setTimeout(function () {
      element.classList.remove('flap-changing');
    }, 500);

  }


  function animateWholeBoard() {

    if (
      !document.body.classList.contains(
        'split-flap-mode'
      )
    ) {
      return;
    }


    const list = getFlightList();

    if (!list) {
      return;
    }


    const rows =
      list.querySelectorAll('.flight-row');


    rows.forEach(function (row, rowIndex) {

      const elements =
        flapElementsInRow(row);


      elements.forEach(function (element, columnIndex) {

        const delay =
          Math.min(
            rowIndex * 22 + columnIndex * 28,
            550
          );


        setTimeout(function () {
          restartAnimation(element);
        }, delay);

      });

    });

  }


  function rowKey(row) {

    const schedule =
      row.querySelector('.schedule-time')
        ?.textContent
        ?.trim() || '';

    const flight =
      row.querySelector('.main-flight .flight-number')
        ?.textContent
        ?.trim() || '';

    const location =
      row.querySelector('.dest-main')
        ?.textContent
        ?.trim() || '';


    return [
      schedule,
      flight,
      location
    ].join('|');

  }


  function rowValues(row) {

    return {

      schedule:
        row.querySelector('.schedule-time')
          ?.textContent
          ?.trim() || '',

      estimated:
        row.querySelector('.estimated-time')
          ?.textContent
          ?.trim() || '',

      destination:
        row.querySelector('.col-destination')
          ?.innerText
          ?.trim() || '',

      flight:
        row.querySelector('.col-flight')
          ?.innerText
          ?.trim() || '',

      aircraft:
        row.querySelector('.aircraft-code')
          ?.textContent
          ?.trim() || '',

      terminal:
        row.querySelector('.terminal-text')
          ?.textContent
          ?.trim() || '',

      gate:
        row.querySelector('.gate-text')
          ?.textContent
          ?.trim() || ''

    };

  }


  function compareAndAnimate() {

    const list = getFlightList();

    if (!list) {
      return;
    }


    const rows =
      Array.from(
        list.querySelectorAll('.flight-row')
      );


    const nextSnapshot =
      new Map();


    rows.forEach(function (row) {

      const key =
        rowKey(row);


      if (!key || key === '||') {
        return;
      }


      const values =
        rowValues(row);


      nextSnapshot.set(
        key,
        values
      );


      const oldValues =
        previousSnapshot.get(key);


      if (
        !document.body.classList.contains(
          'split-flap-mode'
        )
      ) {
        return;
      }


      if (!oldValues) {
        return;
      }


      if (
        oldValues.schedule !==
        values.schedule
      ) {
        restartAnimation(
          row.querySelector('.schedule-time')
        );
      }


      if (
        oldValues.estimated !==
        values.estimated
      ) {
        restartAnimation(
          row.querySelector('.estimated-time')
        );
      }


      if (
        oldValues.destination !==
        values.destination
      ) {
        restartAnimation(
          row.querySelector('.col-destination')
        );
      }


      if (
        oldValues.flight !==
        values.flight
      ) {
        restartAnimation(
          row.querySelector('.col-flight')
        );
      }


      if (
        oldValues.aircraft !==
        values.aircraft
      ) {
        restartAnimation(
          row.querySelector('.aircraft-code')
        );
      }


      if (
        oldValues.terminal !==
        values.terminal
      ) {
        restartAnimation(
          row.querySelector('.terminal-text')
        );
      }


      if (
        oldValues.gate !==
        values.gate
      ) {
        restartAnimation(
          row.querySelector('.gate-text')
        );
      }

    });


    previousSnapshot =
      nextSnapshot;

  }


  function scheduleComparison() {

    clearTimeout(updateTimer);


    updateTimer =
      setTimeout(function () {

        compareAndAnimate();

      }, 120);

  }


  function startObserver() {

    const list =
      getFlightList();


    if (!list) {

      setTimeout(
        startObserver,
        300
      );

      return;

    }


    compareAndAnimate();


    observer =
      new MutationObserver(function () {

        scheduleComparison();

      });


    observer.observe(
      list,
      {
        childList: true,
        subtree: true,
        characterData: true
      }
    );

  }


  function setupSelector() {

    const select =
      getDisplaySelect();


    if (!select) {

      setTimeout(
        setupSelector,
        300
      );

      return;

    }


    select.value =
      getMode();


    select.addEventListener(
      'change',
      function () {

        applyMode(
          select.value,
          true
        );

      }
    );

  }


  function init() {

    const savedMode =
      getMode();


    applyMode(
      savedMode,
      false
    );


    setupSelector();

    startObserver();

  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();
