(function() {
  /**************************************************
   * Utility: Safely parse a string as a float
   **************************************************/
  function parseNumber(str) {
    if (!str) return 0;
    // Remove commas and non-numeric characters except '.'
    return parseFloat(str.replace(/[^\d.]/g, '')) || 0;
  }

  /**************************************************
   * Determine if an upgrade is "priority" by checking
   * for "+X stimulation per second"
   **************************************************/
  function getPriorityValue(descText) {
    const matchSecond = descText.match(/\+(\d+)\s*stimulation per second/i);
    if (!matchSecond) return 0;
    return parseFloat(matchSecond[1]) || 0;
  }

  /**************************************************
   * Bot control variables for handling press cycle
   **************************************************/
  let isPressing = false;
  let pressTimeout = null;
  const PRESS_TIMEOUT_DURATION = 3000; // 3 seconds

  /**************************************************
   * Game time tracking
   **************************************************/
  const gameStartTime = Date.now();

  /**
   * Formats the elapsed time into 'Xh Xm Xs' format.
   * @param {number} elapsedMillis - Elapsed time in milliseconds.
   * @returns {string} Formatted time string.
   */
  function formatElapsedTime(elapsedMillis) {
    const totalSeconds = Math.floor(elapsedMillis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s in game`;
  }

  /**
   * Displays the elapsed game time in the console.
   */
  function showGameTime() {
    const now = Date.now();
    const elapsed = now - gameStartTime;
    const formattedTime = formatElapsedTime(elapsed);
    console.log(formattedTime);
  }

  /**************************************************
   * Main loop
   **************************************************/
  function gameBot() {
    try {
      /**********************************************
       * Handle Press Cycle: Click .press-btn and then .press-collect
       **********************************************/
      if (isPressing) {
        const pressCollectBtn = document.querySelector('.press-collect');
        if (pressCollectBtn && !pressCollectBtn.classList.contains('press-collect-hide')) {
          pressCollectBtn.click();
          isPressing = false;
          if (pressTimeout) {
            clearTimeout(pressTimeout);
            pressTimeout = null;
          }
        }
        // If the collect button hasn't appeared yet, wait
      } else {
        const pressBtn = document.querySelector('.press-btn');
        if (pressBtn) {
          pressBtn.click();
          isPressing = true;
          // Set a timeout to reset isPressing in case .press-collect doesn't appear
          pressTimeout = setTimeout(() => {
            if (isPressing) {
              console.warn('.press-collect did not appear in time. Resetting press cycle.');
              isPressing = false;
            }
          }, PRESS_TIMEOUT_DURATION);
        }
      }

      /**********************************************
       * 1) Always click the main button (if exists)
       **********************************************/
      const mainBtn = document.querySelector('.main-btn-wrapper button.main-btn');
      if (mainBtn) {
        mainBtn.click();
      }

      /**********************************************
       * 2) Get current stimulation from .main-stat-num
       **********************************************/
      const statNumEl = document.querySelector('.main-stat-num');
      if (!statNumEl) {
        // If no main stat element, skip upgrades for now
        return;
      }
      const currentStimulation = parseNumber(statNumEl.innerText);

      /**********************************************
       * 3) Find all upgrades
       **********************************************/
      const upgradeElements = document.querySelectorAll('.upgrade');
      if (!upgradeElements.length) {
        // No upgrades available yet
        return;
      }

      // Convert to array for easier handling
      const upgradesArray = Array.from(upgradeElements);

      /**********************************************
       * 4) If there's EXACTLY 1 upgrade in total,
       *    buy it if affordable (only if no others).
       **********************************************/
      if (upgradesArray.length === 1) {
        const singleUpgrade = upgradesArray[0];
        const costEl = singleUpgrade.querySelector('.upgrade-cost');
        if (!costEl) return; // Missing cost, skip

        const costMatch = costEl.innerText.match(/Cost:\s*([0-9,\.]+)/i);
        if (!costMatch) return; // Can't parse cost
        const costValue = parseNumber(costMatch[1]);

        // If we can afford it, buy it
        if (costValue <= currentStimulation) {
          singleUpgrade.click();
        }
        return; // Done for this iteration
      }

      /**********************************************
       * 5) If there are multiple upgrades:
       *    a) Gather "priority" upgrades
       *    b) If none affordable, pick random
       **********************************************/
      const affordableUpgrades = [];
      const priorityUpgrades = [];

      upgradesArray.forEach((upg) => {
        const descEl = upg.querySelector('.upgrade-desc');
        const costEl = upg.querySelector('.upgrade-cost');
        if (!descEl || !costEl) return; // Missing info

        const descText = descEl.innerText || '';
        const costMatch = costEl.innerText.match(/Cost:\s*([0-9,\.]+)/i);
        if (!costMatch) return; // Can't parse cost

        const costValue = parseNumber(costMatch[1]);
        if (costValue <= currentStimulation && costValue > 0) {
          // It's affordable
          affordableUpgrades.push(upg);

          // Check if it's a priority (per second)
          const priorityVal = getPriorityValue(descText);
          if (priorityVal > 0) {
            priorityUpgrades.push({ element: upg, perSecondValue: priorityVal });
          }
        }
      });

      // If we have no affordable upgrades, do nothing
      if (!affordableUpgrades.length) {
        return;
      }

      // 5a) If there is a priority upgrade, pick the one with the largest "per second" value
      if (priorityUpgrades.length) {
        let bestPriorityUpgrade = null;
        let maxVal = -Infinity;
        priorityUpgrades.forEach((p) => {
          if (p.perSecondValue > maxVal) {
            maxVal = p.perSecondValue;
            bestPriorityUpgrade = p.element;
          }
        });

        if (bestPriorityUpgrade) {
          bestPriorityUpgrade.click();
          return;
        }
      }

      // 5b) Otherwise, pick a random affordable upgrade
      const randomIndex = Math.floor(Math.random() * affordableUpgrades.length);
      const randomUpgrade = affordableUpgrades[randomIndex];
      randomUpgrade.click();

      /**********************************************
       * 6) Click .loot-box-target if it exists
       **********************************************/
      const lootBoxTarget = document.querySelector('.loot-box-target');
      if (lootBoxTarget) {
        lootBoxTarget.click();
      }

      /**********************************************
       * 7) Click .collect within .reward elements if they exist
       **********************************************/
      const rewardCollectElements = document.querySelectorAll('.reward .collect');
      rewardCollectElements.forEach((collectBtn) => {
        if (collectBtn) {
          collectBtn.click();
        }
      });

    } catch (err) {
      console.warn('Error in gameBot:', err);
    }
  }

  /**************************************************
   * Bot control functions
   **************************************************/
  
  let botInterval = null;

  /**************************************************
   * Function to start the bot
   **************************************************/
  function startClickerBot() {
    if (botInterval) {
      console.log('Clicker bot is already running.');
      return;
    }
    botInterval = setInterval(gameBot, 100); // Run every 100ms
    console.log('Clicker bot started.');
  }

  /**************************************************
   * Function to stop the bot
   **************************************************/
  function stopClickerBot() {
    if (botInterval) {
      clearInterval(botInterval);
      botInterval = null;
      console.log('Clicker bot stopped.');
      // Clear any existing timeouts
      if (pressTimeout) {
        clearTimeout(pressTimeout);
        pressTimeout = null;
      }
      isPressing = false;
    } else {
      console.log('Clicker bot is not running.');
    }
    // Show game time when stopping
    showGameTime();
  }

  /**************************************************
   * Expose the control functions to the global scope
   **************************************************/
  window.startClickerBot = startClickerBot;
  window.stopClickerBot = stopClickerBot;
  window.showGameTime = showGameTime;

  console.log(
    '%c========================================\n🚀 %cClicker Bot Script Loaded 🚀\n========================================\n📌 Available Commands:\n1️⃣ %cstartClickerBot()%c - Starts the Clicker Bot.\n2️⃣ %cstopClickerBot()%c - Stops the Clicker Bot.\n3️⃣ %cshowGameTime()%c - Displays the current time in the game.\n========================================',
    'color: #4CAF50; font-weight: bold;',
    'color: #FF9800; font-weight: bold;',
    'color: #1E90FF; font-weight: bold;',
    'color: #ccc;',
    'color: #1E90FF; font-weight: bold;',
    'color: #ccc;',
    'color: #1E90FF; font-weight: bold;',
    'color: #ccc;'
  );  
})();
