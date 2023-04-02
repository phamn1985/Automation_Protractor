const config = require('dotenv');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const obj = config.load({ path: 'client/.env' });
const sauceConf = require('./UIAutomation/sauce-config.json');
const argv = require('yargs').argv;
var browserName = 'chrome';
var jsonReportformat = 'json:AutomationReports/json/results.json';
var htmlReportDirectory = './AutomationReports/html';
var jsonReportDirectory = '/AutomationReports/json';
var version, platform, screenResolution, instances, configName;

if (argv.browser) {
  browserName = argv.browser;
}

if (browserName === 'chrome') {
  version = sauceConf[0].version;
  platform = sauceConf[0].platform;
  screenResolution = sauceConf[0].screenResolution;
  instances = sauceConf[0].instances;
  configName = `bdd-chrome-tests ${process.env.BUILD_TAG || ''}`;
}

exports.config = {
  sauceUser: process.env.SAUCE_LOGIN,
  sauceKey: process.env.SAUCE_KEY,
  baseUrl: process.env.URL,
  capabilities: {
    'browserName': browserName,
    'chromeOptions': {
      args: ['--no-sandbox', '--disable-infobars'],
      prefs: {
        'profile.password_manager_enabled': false,
        'credentials_enable_service': false,
        'password_manager_enabled': false,
        'download': {
          'directory_upgrade': true,
          'prompt_for_download': false,
          'default_directory': process.env.SAUCE ? 'C:\\Users\\Administrator\\Downloads' : path.resolve(__dirname, './UIAutomation/downloads/'),
        },
      }
    },
    // sauce lab specific capabilities
    shardTestFiles: !!process.env.SAUCE,
    maxInstances: instances,
    version: version,
    platform: platform,
    screenResolution: screenResolution,
    name: configName,
    maxDuration: 3200,
    recordVideo: false, // disabled video recording for Saucelab
    idleTimeout: 180 //temporary increased timeout for SauceLab: https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options#TestConfigurationOptions-IdleTestTimeout
  },

  params: {
    authUrl: require('./UIAutomation/server-env.json')[process.env.SERVER_ENV || 'prod']
  },

  allScriptsTimeout: 300000,
  getPageTimeout: 12000,
  ignoreUncaughtExceptions: true,
  cucumberOpts: {
    format: jsonReportformat,
    require: [
      'UIAutomation/**/*.steps.ts',
      'UIAutomation/support/*.ts',
      'UIAutomation/shared/api/*.ts'
    ],
    tags: "~@Ignore",
  },
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  directConnect: !process.env.SAUCE,
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: getFeatureFiles(),
  onPrepare: () => {
    require('ts-node').register({
      project: 'client/UIAutomation'
    });
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    browser.driver.manage().window().maximize();
    browser.waitForAngularEnabled(false);
  },
  beforeLaunch: () => {
    rimraf(path.resolve(process.cwd(), htmlReportDirectory));
    rimraf(path.resolve(process.cwd(), './client/UIAutomation/downloads'));
    generateDirs();
  }
};

function getFeatureFiles() {
  if (argv.module) {
    return argv.module.split(',').map(folder => `UIAutomation/${folder}/features/*.feature`);
  }

  return [`UIAutomation/**/*.feature`];
}

function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(entry => {
      const entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}

function generateDirs() {
  const jsonReports = path.join(process.cwd(), jsonReportDirectory);
  if (!fs.existsSync(jsonReports)) {
    mkdirp.sync(jsonReports);
  }
}
