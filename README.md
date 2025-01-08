# Stimulation Clicker Speedrun

This project is created **just for funzies** to automate clicking for the **funiest clicker game of the last few days**, [Stimulation Clicker](https://neal.fun/stimulation-clicker/).

## Description

Stimulation Clicker Speedrun is a simple JS script designed to automate clicking actions in the [Stimulation Clicker](https://neal.fun/stimulation-clicker/) game. It continuously interacts with the game's elements to enhance your gameplay experience by automatically clicking buttons and purchasing upgrades based on predefined priorities.

## Features

- **Automated Clicking:** Continuously clicks the main button and special press elements to accumulate stimulation.
- **Upgrade Management:** Automatically purchases available upgrades based on affordability and priority to maximize stimulation per second.
- **Easy to Stop:** Provides a simple way to stop the bot by calling `stopClickerBot()` in the browser console.

## Usage

1. **Open the Game:**
   Navigate to [Stimulation Clicker](https://neal.fun/stimulation-clicker/) in your web browser.

2. **Open Developer Console:**
   - Right-click on the page and select `Inspect` or `Inspect Element`.
   - Go to the `Console` tab.

3. **Paste the Script:**
   Copy the entire script from the repository and paste it into the console.

4. **Run the Script:**
   Press `Enter` to execute the script. You will see a message:
   ```
   Clicker bot script loaded. Type in console startClickerBot() to start and stopClickerBot() to stop.
   ```

5. **Start the Bot:**
- Type `startClickerBot()` in the console and press `Enter`.
- You should see:
  ```
  Clicker bot started.
  ```

6. **Stop the Bot:**
- Type `stopClickerBot()` in the console and press `Enter`.
- You should see:
  ```
  Clicker bot stopped.
  ```

7. **Restarting the Bot:**
- After stopping, you can restart the bot anytime by calling `startClickerBot()` again.

## Commands

- **Start the Bot:**
```javascript
startClickerBot()
```
Initiates the automated clicking and upgrade purchasing process.

- **Stop the Bot:**
```javascript
stopClickerBot()
```

- **Check Time in Game:**
```javascript
showGameTime()
```
Displays the current time in the game.

## License

This project is licensed under the [Unlicense](LICENSE), which is the most free and permissive license available. You are free to use, modify, and distribute this software for any purpose without any restrictions.

## Disclaimer

This script is intended **for fun** and personal use. Use it responsibly and at your own risk. The author is not responsible for any consequences resulting from the use of this script.

