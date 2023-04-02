@upload

Feature: Upload
    Description: As a user, I want to upload a file.
    Background:
        Given I am in Upload File Page

    Scenario Outline: Upload File without select any files
        When I click Submit Button on Upload File Page
        Then I should not see Upload Successfully Message is dislayed
      Examples:
            | filename                  |
            | sample_upload.txt         |
               
    Scenario Outline: Upload Single File Successfully
        When I select file "<filename>" to upload
        And I check 'I accept terms of service' on Upload File Page
        And I click Submit Button on Upload File Page
        Then I should see Upload Successfully Message is dislayed
        Examples:
            | filename                  |
            | sample_upload.txt         |

    Scenario Outline: Upload Single File without accepting Terms of Service
        When I select file "<filename>" to upload
        And I click Submit Button on Upload File Page
        Then I should not see Upload Successfully Message is dislayed
        Examples:
            | filename                  |
            | sample_upload.txt         |

    Scenario Outline: Upload Exceeding Size File
        When I select file "<filename>" to upload
        And I check 'I accept terms of service' on Upload File Page
        And I click Submit Button on Upload File Page
        Then I should not see Upload Successfully Message is dislayed
        Examples:
            | filename                  |
            | fake_200mb_upload.txt     |

  