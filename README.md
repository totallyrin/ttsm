# TTSM - Totally Terrible Server Manager

To access the source code for the TTSM server, please
visit the [TTSM-server](https://github.com/totallyrin/ttsm-server) repository.

TTSM (Totally Terrible Server Manager) is a web-based server management tool that allows you to easily manage and
monitor your game servers. It provides a user-friendly interface to start, stop, and monitor game servers, as well as
view server logs and perform configuration changes.

## Features

- Start and stop game servers with a click of a button
- Monitor server status and receive real-time updates
- View server logs to troubleshoot issues
- Perform configuration changes for game servers
- Customizable and extendable for different game server types

## Installation

To install and run the TTSM locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/totallyrin/ttsm.git
   ```

2. Install dependencies:
   ```bash
   cd ttsm
   npm install
   ```

3. Configure the server settings:
   Open the `config.js` file and update the necessary server configuration options.

4. Start the server:
   ```bash
   npm run dev
   ```
   This will start the TTSM site and make it accessible at [http://localhost:3000](http://localhost:3000).

## Usage

1. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

2. Login using your username and password.

3. From the dashboard, you can view the list of available game servers and their current status.

4. Click on a server to access more detailed information, such as logs, configuration options, and control buttons to
   start or stop the server.

## Contributing

Contributions to TTSM are welcome! If you find a bug or have a feature request, please open an issue on the GitHub
repository. If you'd like to contribute code, feel free to fork the repository and submit a pull request with your
changes.

Before submitting a pull request, please ensure that you have run the tests and that your code follows the project's
coding style guidelines.

## Acknowledgements

TTSM is built using [Node.js](https://nodejs.org) and [Next.js](https://nextjs.org) frameworks. It makes use of various
libraries and tools, which are listed in the project's `package.json` file.

---

If you have any questions or need further assistance, feel free to reach out.
