module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      retry: 3,
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      path: "hermione-html-reporter",
      enabled: true,
    },
  },
};
