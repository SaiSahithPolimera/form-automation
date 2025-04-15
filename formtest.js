import { describe, it } from 'node:test';
import { Builder, By, until } from 'selenium-webdriver';

describe("Test for fomr elements", () => {
    it("Should find and test any 3 input elements regardless of position or properties", async () => {
        const driver = await new Builder().forBrowser('chrome').build();

        try {
            await driver.get('https://app.cloudqa.io/home/AutomationPracticeForm');
            
            await driver.sleep(2000);
            
            const allInputs = await driver.findElements(By.css('input'));
            
            const visibleInputs = [];

            for (const input of allInputs) {
                try {
                    const isDisplayed = await input.isDisplayed();
                    const isEnabled = await input.isEnabled();
                    
                    if (isDisplayed && isEnabled) {
                        const type = await input.getAttribute("type") || "unknown";
                        const name = await input.getAttribute("name") || "";
                        const id = await input.getAttribute("id") || "";
                        const placeholder = await input.getAttribute("placeholder") || "";
                        
                        const inputInfo = {
                            element: input,
                            type,
                            name,
                            id,
                            placeholder,
                            identifier: name || id || placeholder || `type-${type}-${visibleInputs.length}`
                        };
                        
                        visibleInputs.push(inputInfo);
                    }
                } catch (error) {
                    console.log(`Error checking input visibility: ${error.message}`);
                }
            }
            
            
            const inputsToTest = visibleInputs.slice(0, 3);
            
            console.log(`Testing ${inputsToTest.length} inputs`);
            
            const getTestValue = (type) => {
                const testData = {
                    'text': 'Test User',
                    'email': 'test@example.com',
                    'password': '123456789',
                    'tel': '1234567890',
                    'number': '42',
                    'date': '2023-01-15',
                    'checkbox': true,
                    'radio': true,
                    'default': 'Default test value'
                };
                
                return testData[type] || testData['default'];
            };
            
            for (let i = 0; i < inputsToTest.length; i++) {
                const inputInfo = inputsToTest[i];
                const input = inputInfo.element;
                console.log(`Testing Input #${i+1}: ${inputInfo.identifier} (${inputInfo.type})`);
                try {
                    const testValue = getTestValue(inputInfo.type);
                    if (inputInfo.type === 'checkbox' || inputInfo.type === 'radio') {
                        const isSelected = await input.isSelected();
                        console.log(`Current selection state: ${isSelected}`);
                        await input.click();
                        const newState = await input.isSelected();
                        console.log(`• Successfully changed selection from ${isSelected} to ${newState}`);
                    } 
                    else {
                        await input.clear();
                        await input.sendKeys(testValue);
                        const enteredValue = await input.getAttribute("value");
                        const isValid = await driver.executeScript("return arguments[0].checkValidity();", input);
                        
                        if (enteredValue === testValue.toString()) {
                            console.log(`° Successfully entered: "${enteredValue}"`);
                        } else {
                            console.log(`! Value mismatch. Expected: "${testValue}", Got: "${enteredValue}"`);
                        }
                        
                        console.log(`Validation status: ${isValid ? 'Valid' : 'Invalid'}`);
                    }
                    
                    console.log(`Test complete for input #${i+1}`);
                    
                } catch (error) {
                    console.log(`Error testing input #${i+1}: ${error.message}`);
                }
            }
        } finally {
            await driver.quit();
        }
    });
});