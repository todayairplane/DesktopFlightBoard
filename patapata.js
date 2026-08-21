(function () {

  const MODE_KEY = 'flightBoardDisplayMode';

  let previousSnapshot = new Map();
  let observer = null;
  let compareTimer = null;
  let testRunning = false;


  function getDisplaySelect() {
    return document.getElementById('display-select');
  }


  function getFlightList() {
    return document.getElementById('flight-list');
  }


  function getMode() {

    try {

      return (
        localStorage.getItem(MODE_KEY) ||
        'normal'
      );

    } catch (error) {

      return 'normal';

    }

  }


  function saveMode(mode) {

    try {

      localStorage.setItem(
        MODE_KEY,
        mode
      );

    } catch (error) {

      console.warn(
        'Could not save display mode'
      );

    }

  }


  function applyMode(
    mode,
    animateAll = false
  ) {

    if (mode === 'split') {

      document.body.classList.add(
        'split-flap-mode'
      );

    } else {

      document.body.classList.remove(
        'split-flap-mode'
      );

    }


    const select =
      getDisplaySelect();


    if (select) {

      select.value =
        mode;

    }


    saveMode(mode);


    if (
      mode === 'split' &&
      animateAll
    ) {

      setTimeout(
        animateWholeBoard,
        80
      );

    }

  }


  function restartAnimation(
    element
  ) {

    if (!element) {
      return;
    }


    element.classList.remove(
      'flap-changing'
    );


    void element.offsetWidth;


    element.classList.add(
      'flap-changing'
    );


    setTimeout(
      function () {

        element.classList.remove(
          'flap-changing'
        );

      },
      500
    );

  }


  function animateWholeBoard() {

    if (
      !document.body.classList.contains(
        'split-flap-mode'
      )
    ) {
      return;
    }


    const list =
      getFlightList();


    if (!list) {
      return;
    }


    const rows =
      list.querySelectorAll(
        '.flight-row'
      );


    rows.forEach(
      function (
        row,
        rowIndex
      ) {

        const elements = [

          row.querySelector(
            '.schedule-time'
          ),

          row.querySelector(
            '.estimated-time'
          ),

          row.querySelector(
            '.col-destination'
          ),

          row.querySelector(
            '.col-flight'
          ),

          row.querySelector(
            '.aircraft-code'
          ),

          row.querySelector(
            '.terminal-text'
          ),

          row.querySelector(
            '.gate-text'
          )

        ].filter(Boolean);


        elements.forEach(
          function (
            element,
            columnIndex
          ) {

            const delay =
              Math.min(
                rowIndex * 18 +
                columnIndex * 25,
                600
              );


            setTimeout(
              function () {

                restartAnimation(
                  element
                );

              },
              delay
            );

          }
        );

      }
    );

  }


  function rowKey(row) {

    const schedule =
      row
        .querySelector(
          '.schedule-time'
        )
        ?.textContent
        ?.trim() || '';


    const flight =
      row
        .querySelector(
          '.main-flight .flight-number'
        )
        ?.textContent
        ?.trim() || '';


    const location =
      row
        .querySelector(
          '.dest-main'
        )
        ?.textContent
        ?.trim() || '';


    return (
      schedule +
      '|' +
      flight +
      '|' +
      location
    );

  }


  function rowValues(row) {

    return {

      estimated:
        row
          .querySelector(
            '.estimated-time'
          )
          ?.textContent
          ?.trim() || '',

      aircraft:
        row
          .querySelector(
            '.aircraft-code'
          )
          ?.textContent
          ?.trim() || '',

      terminal:
        row
          .querySelector(
            '.terminal-text'
          )
          ?.textContent
          ?.trim() || '',

      gate:
        row
          .querySelector(
            '.gate-text'
          )
          ?.textContent
          ?.trim() || ''

    };

  }


  function compareRealChanges() {

    if (testRunning) {
      return;
    }


    const list =
      getFlightList();


    if (!list) {
      return;
    }


    const rows =
      Array.from(
        list.querySelectorAll(
          '.flight-row'
        )
      );


    const nextSnapshot =
      new Map();


    rows.forEach(
      function (row) {

        const key =
          rowKey(row);


        if (
          !key ||
          key === '||'
        ) {
          return;
        }


        const values =
          rowValues(row);


        nextSnapshot.set(
          key,
          values
        );


        const old =
          previousSnapshot.get(
            key
          );


        if (!old) {
          return;
        }


        if (
          !document.body.classList.contains(
            'split-flap-mode'
          )
        ) {
          return;
        }


        if (
          old.estimated !==
          values.estimated
        ) {

          restartAnimation(
            row.querySelector(
              '.estimated-time'
            )
          );

        }


        if (
          old.aircraft !==
          values.aircraft
        ) {

          restartAnimation(
            row.querySelector(
              '.aircraft-code'
            )
          );

        }


        if (
          old.terminal !==
          values.terminal
        ) {

          restartAnimation(
            row.querySelector(
              '.terminal-text'
            )
          );

        }


        if (
          old.gate !==
          values.gate
        ) {

          restartAnimation(
            row.querySelector(
              '.gate-text'
            )
          );

        }

      }
    );


    previousSnapshot =
      nextSnapshot;

  }


  function scheduleComparison() {

    if (testRunning) {
      return;
    }


    clearTimeout(
      compareTimer
    );


    compareTimer =
      setTimeout(
        compareRealChanges,
        150
      );

  }


  function randomCharacter() {

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


    return chars[
      Math.floor(
        Math.random() *
        chars.length
      )
    ];

  }


  function animateCharacters(
    element,
    targetText,
    duration = 1000
  ) {

    return new Promise(
      function (resolve) {

        if (!element) {

          resolve();
          return;

        }


        const target =
          String(
            targetText || ''
          );


        const length =
          Math.max(
            target.length,
            1
          );


        const startTime =
          performance.now();


        restartAnimation(
          element
        );


        function frame(now) {

          const progress =
            Math.min(
              (
                now -
                startTime
              ) /
              duration,
              1
            );


          const fixed =
            Math.floor(
              progress *
              length
            );


          let text = '';


          for (
            let i = 0;
            i < length;
            i++
          ) {

            const real =
              target[i] || ' ';


            if (
              i < fixed ||
              real === ' ' ||
              real === ':' ||
              real === '→'
            ) {

              text += real;

            } else {

              text +=
                randomCharacter();

            }

          }


          element.textContent =
            text;


          if (
            progress < 1
          ) {

            requestAnimationFrame(
              frame
            );

          } else {

            element.textContent =
              target;

            restartAnimation(
              element
            );

            resolve();

          }

        }


        requestAnimationFrame(
          frame
        );

      }
    );

  }


  function addMinutes(
    timeText,
    minutes
  ) {

    const match =
      String(
        timeText
      ).match(
        /^(\d{1,2}):(\d{2})$/
      );


    if (!match) {

      return '23:25';

    }


    let hour =
      Number(
        match[1]
      );


    let minute =
      Number(
        match[2]
      );


    minute +=
      minutes;


    hour +=
      Math.floor(
        minute / 60
      );


    minute =
      minute % 60;


    hour =
      hour % 24;


    return (
      String(hour)
        .padStart(
          2,
          '0'
        ) +
      ':' +
      String(minute)
        .padStart(
          2,
          '0'
        )
    );

  }


  function changedGate(
    current
  ) {

    const number =
      parseInt(
        current,
        10
      );


    if (
      Number.isFinite(
        number
      )
    ) {

      return String(
        number + 2
      );

    }


    return '63';

  }


  function changedAircraft(
    current
  ) {

    const value =
      String(
        current || ''
      ).toUpperCase();


    if (
      value === 'B789'
    ) {

      return 'A359';

    }


    if (
      value === 'A359'
    ) {

      return 'B789';

    }


    return 'B789';

  }


  function changedTerminal(
    current
  ) {

    const value =
      String(
        current || ''
      ).toUpperCase();


    if (
      value === 'T1'
    ) {

      return 'T2';

    }


    return 'T1';

  }


  function createTestBadge() {

    let badge =
      document.getElementById(
        'patapata-test-badge'
      );


    if (badge) {

      badge.style.display =
        'block';

      return badge;

    }


    badge =
      document.createElement(
        'div'
      );


    badge.id =
      'patapata-test-badge';


    badge.textContent =
      'TEST MODE';


    Object.assign(
      badge.style,
      {

        position:
          'fixed',

        right:
          '20px',

        bottom:
          '18px',

        zIndex:
          '99999',

        background:
          '#d8ac24',

        color:
          '#080808',

        padding:
          '7px 12px',

        borderRadius:
          '4px',

        fontFamily:
          'Courier New, monospace',

        fontSize:
          '12px',

        fontWeight:
          '700',

        letterSpacing:
          '1px',

        boxShadow:
          '0 4px 18px rgba(0,0,0,.35)'

      }
    );


    document.body.appendChild(
      badge
    );


    return badge;

  }


  function hideTestBadge() {

    const badge =
      document.getElementById(
        'patapata-test-badge'
      );


    if (badge) {

      badge.style.display =
        'none';

    }

  }


  async function runTest() {

    if (testRunning) {
      return;
    }


    const list =
      getFlightList();


    if (!list) {
      return;
    }


    const rows =
      Array.from(
        list.querySelectorAll(
          '.flight-row'
        )
      ).filter(
        function (row) {

          return (
            row.querySelector(
              '.schedule-time'
            ) &&
            row.querySelector(
              '.main-flight .flight-number'
            )
          );

        }
      );


    if (
      rows.length < 4
    ) {

      alert(
        '便データの読み込み完了後にTESTしてください'
      );

      return;

    }


    testRunning =
      true;


    applyMode(
      'split',
      false
    );


    createTestBadge();


    const button =
      document.getElementById(
        'test-flap-button'
      );


    if (button) {

      button.disabled =
        true;

      button.textContent =
        'TEST中';

    }


    const testRows =
      rows.slice(
        0,
        4
      );


    const original = [];


    testRows.forEach(
      function (row) {

        original.push({

          estimated:
            row.querySelector(
              '.estimated-time'
            )?.textContent || '',

          aircraft:
            row.querySelector(
              '.aircraft-code'
            )?.textContent || '',

          terminal:
            row.querySelector(
              '.terminal-text'
            )?.textContent || '',

          gate:
            row.querySelector(
              '.gate-text'
            )?.textContent || ''

        });

      }
    );


    const schedule =
      testRows[0]
        .querySelector(
          '.schedule-time'
        )
        ?.textContent
        ?.trim() || '23:10';


    await animateCharacters(

      testRows[0]
        .querySelector(
          '.estimated-time'
        ),

      addMinutes(
        schedule,
        15
      ),

      1200
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          350
        )
    );


    await animateCharacters(

      testRows[1]
        .querySelector(
          '.gate-text'
        ),

      changedGate(
        original[1].gate
      ),

      1000
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          350
        )
    );


    await animateCharacters(

      testRows[2]
        .querySelector(
          '.aircraft-code'
        ),

      changedAircraft(
        original[2].aircraft
      ),

      1200
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          350
        )
    );


    await animateCharacters(

      testRows[3]
        .querySelector(
          '.terminal-text'
        ),

      changedTerminal(
        original[3].terminal
      ),

      1000
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          3500
        )
    );


    for (
      let i = 0;
      i < testRows.length;
      i++
    ) {

      const row =
        testRows[i];


      const values =
        original[i];


      const estimated =
        row.querySelector(
          '.estimated-time'
        );


      const aircraft =
        row.querySelector(
          '.aircraft-code'
        );


      const terminal =
        row.querySelector(
          '.terminal-text'
        );


      const gate =
        row.querySelector(
          '.gate-text'
        );


      if (
        estimated &&
        estimated.textContent !==
          values.estimated
      ) {

        await animateCharacters(
          estimated,
          values.estimated,
          650
        );

      }


      if (
        aircraft &&
        aircraft.textContent !==
          values.aircraft
      ) {

        await animateCharacters(
          aircraft,
          values.aircraft,
          650
        );

      }


      if (
        terminal &&
        terminal.textContent !==
          values.terminal
      ) {

        await animateCharacters(
          terminal,
          values.terminal,
          650
        );

      }


      if (
        gate &&
        gate.textContent !==
          values.gate
      ) {

        await animateCharacters(
          gate,
          values.gate,
          650
        );

      }

    }


    hideTestBadge();


    if (button) {

      button.disabled =
        false;

      button.textContent =
        'TEST';

    }


    testRunning =
      false;


    setTimeout(
      compareRealChanges,
      300
    );

  }


  function createTestButton() {

    if (
      document.getElementById(
        'test-flap-button'
      )
    ) {

      return;

    }


    const displaySelect =
      getDisplaySelect();


    if (!displaySelect) {

      setTimeout(
        createTestButton,
        300
      );

      return;

    }


    const button =
      document.createElement(
        'button'
      );


    button.id =
      'test-flap-button';


    button.textContent =
      'TEST';


    Object.assign(
      button.style,
      {

        background:
          '#d8ac24',

        color:
          '#080808',

        border:
          'none',

        borderRadius:
          '4px',

        padding:
          '6px 10px',

        fontSize:
          '12px',

        fontWeight:
          '700',

        cursor:
          'pointer',

        fontFamily:
          'Courier New, monospace'

      }
    );


    button.addEventListener(
      'click',
      runTest
    );


    displaySelect.insertAdjacentElement(
      'afterend',
      button
    );

  }


  function setupDisplaySelector() {

    const select =
      getDisplaySelect();


    if (!select) {

      setTimeout(
        setupDisplaySelector,
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


    compareRealChanges();


    observer =
      new MutationObserver(
        function () {

          scheduleComparison();

        }
      );


    observer.observe(
      list,
      {

        childList:
          true,

        subtree:
          true,

        characterData:
          true

      }
    );

  }


  function init() {

    applyMode(
      getMode(),
      false
    );


    setupDisplaySelector();

    createTestButton();

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
