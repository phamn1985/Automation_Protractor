import { assert } from 'chai';
import { Given, When, Then } from 'cucumber';
import { UploadFilePage } from '../pages/uploadfilepage.po';

const uploadFilePage = new UploadFilePage();

Given(/^I am in Upload File Page$/, async () => {
    await uploadFilePage.navigate();
    await uploadFilePage.waitForLoading();
});

When(/^I select file "(.*)" to upload$/, async function(fileName: string) {
    await uploadFilePage.uploadFile(fileName);
});

When(/^I click Submit Button on Upload File Page$/, async () => {
    await uploadFilePage.nativeClick(uploadFilePage.btnSubmit);
});

When(/^I check 'I accept terms of service' on Upload File Page$/, async () =>{
    await uploadFilePage.nativeClick(uploadFilePage.chkTermAccept);
});

Then(/^I should see Upload Successfully Message is dislayed$/ , async () =>{
   await uploadFilePage.verifyUploadSuccessfullMessageDisplayed();
});

Then(/^I should not see Upload Successfully Message is dislayed$/ , async () =>{
    await uploadFilePage.verifyUploadSuccessfullMessageNotDisplayed();
 });