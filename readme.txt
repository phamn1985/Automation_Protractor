Assumption:
Since the given test website is buggy from the begining, for example:
    1. The upload successful message will displayed regardless the "term agreement" checkbox is checked or not
    2. The upload successful message will displayed regardless if no files or 1 file is uploaded
    3. The page only allow to upload 1 file only
Also, if attach a large size test data will increase the project size. Hence, I will just make a sample file with "fake" 200 mb size.
All the test case with bug will verify that the successful message will not be displayed, aka those test WILL FAIL on purpose


Instruction to run:
    1. Install: download and in project directory, using terminal or powershell to run "npm install"
    2. Run test case: In project directory, using terminal or powershell to run "npm run client:e2e"
    3. After the test run, to view report: In project directory, using terminal or powershell to run "npm run client:e2e-generateHtmlReport". The report will be available at AutomationReports/cucumber_reporter.html. I will leave the last run result as evident of my test has been executed successfully before submiting

This project was built by Nam Anh Pham with a pre-existing self built (by Nam Anh Pham also) framework for a larger system will multiple test environment such as staging, qa, etc.. and have ability to be executed in remoted service such as Saucelabs or browserstack in mind.