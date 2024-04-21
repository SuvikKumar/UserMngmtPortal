We'll be using the create-react-app generator for this tutorial. To use the generator as well as run the React application server, you'll need Node.js JavaScript runtime and npm (Node.js package manager) installed. npm is included with Node.js which you can download and install from Node.js downloads.

Tip: To test that you have Node.js and npm correctly installed on your machine, you can type node --version and npm --version in a terminal or command prompt.

You can now create a new React application by typing:

npx create-react-app my-app
where my-app is the name of the folder for your application. This may take a few minutes to create the React application and install its dependencies.

Note: If you've previously installed create-react-app globally via npm install -g create-react-app, we recommend you uninstall the package using npm uninstall -g create-react-app to ensure that npx always uses the latest version.

Let's quickly run our React application by navigating to the new folder and typing npm start to start the web server and open the application in a browser:

cd my-app
npm start
You should see the React logo and a link to "Learn React" on http://localhost:3000 in your browser. We'll leave the web server running while we look at the application with VS Code.

To open your React application in VS Code, open another terminal or command prompt window, navigate to the my-app folder and type code .:

cd my-app
code
