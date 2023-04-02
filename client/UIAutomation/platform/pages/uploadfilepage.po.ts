import { $, by, element } from 'protractor';
import { waitForAllPresent } from '../../shared/helpers/pagehelper';
import { BasePage } from '../../shared/pages/base-page.po';
import * as path from 'path';

export class UploadFilePage extends BasePage {

    pageUrl = 'upload';
    pageVerifyingElement = $('button#submitbutton');
    
    chkTermAccept = $('input#terms')
    btnUpload = $('div#file_wraper0 input[type="file"]');
    btnSubmit = $('button#submitbutton');
    lblUploadSuccessfullMessage = element(by.xpath("//*[@id='res'][descendant-or-self::*[contains(.,'has been successfully uploaded.')]]"));

    async waitForLoading() {
        await waitForAllPresent(this.btnUpload, this.btnSubmit, this.chkTermAccept);
    }

    async isUploadFilePageDisplayed() {
        await this.waitForLoading();
        return await this.btnUpload.isPresent() && await this.btnSubmit.isPresent() && await this.chkTermAccept.isPresent();
    }

    async isUploadSuccessfullMessageDisplayed() {
        await this.waitForLoading();
        return await this.lblUploadSuccessfullMessage.isPresent();
    }

    async verifyUploadSuccessfullMessageDisplayed() {
        await this.shortWait();
        await this.waitForElementPresent(this.lblUploadSuccessfullMessage);
        await this.assertElementsPresent(this.lblUploadSuccessfullMessage);
    }


    async verifyUploadSuccessfullMessageNotDisplayed() {
        await this.shortWait();
        await this.waitForElementPresent(this.lblUploadSuccessfullMessage);
        await this.assertElementNotDisplayed(this.lblUploadSuccessfullMessage);
    }

    async verifyPageDisplayed() {
        await this.assertElementsPresent(this.btnUpload);
    }

    async uploadFile(fileName:string) {
        const absolutePath = path.resolve(__dirname, '../../support/test_data/' + fileName);
        await this.btnUpload.sendKeys(absolutePath);
      };
}
