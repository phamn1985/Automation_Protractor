const config = require('dotenv');
const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
const sauceConf = require('./UIAutomation/sauce-config.json');
const mkdirp  = require('mkdirp');
const obj = config.load({path: 'UIAutomation/.env'});
const argv = require('yargs').argv;
var htmlOutputFile = './AutomationReports/html/cucumber_reporter.html';
var htmlOutputDir = '/AutomationReports/html';
var jsonOutputDir = './AutomationReports/json';



const options = {
  theme: 'bootstrap',
  jsonDir: jsonOutputDir,
  output: htmlOutputFile,
  ignoreBadJsonFile: true,
  reportSuiteAsScenarios: true,
  metadata: process.env.SAUCE ? sauceConf : null
};

function makeValidJsons(dir_path) {
  fs.readdirSync(dir_path).forEach(entry => {
    const entryPath = path.join(dir_path, entry);
    const fileContent = fs.readFileSync(entryPath, 'utf8');
    if (fileContent === '') {
      console.log('empty report-file');
      fs.writeFileSync(entryPath, '[]', 'utf8');
    }
  });
}

function generateHtmlDirs() {
  const htmlReports = path.join(process.cwd(), htmlOutputDir);
  if (!fs.existsSync(htmlReports)) {
    mkdirp.sync(htmlReports);
  }

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

generateHtmlDirs();
makeValidJsons(path.resolve(process.cwd(), jsonOutputDir));
reporter.generate(options);
rimraf(path.resolve(process.cwd(), jsonOutputDir));
