# `@bugfender/capacitor` example

## Initial Setup

- Ensure that [NVM](https://github.com/nvm-sh/nvm) is installed
- `nvm install`: Install the required Node.js version
- `nvm use`: Ensure correct Node.js version is in use
- `npm ci`: Install the dependencies
- `cp config.json.example config.json`: Create the config file
- Fill `config.json`

## Running this example

- `nvm use`: Ensure correct Node.js version is in use
- Each time you do some changes to the plugin (root):
  - In the repository root:
    - `npm build`: build `@bugfender/capacitor`
  - In the `example` folder:
    - Stop example server.
    - `npm run serve`: run the example server
