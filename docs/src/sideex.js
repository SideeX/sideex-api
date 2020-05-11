//make sure the type is correct
//@ts-check

/**
 * @file sideex-api
 * @author SideeX Team
 * @see <a href="https://sideex.io/">sideex.io</a>
 */



 /**
  * sideex.variables
  */
class variables{
    
    /**
     * 
     */
    constructor(){

    }


    /**
     * varIdString 
     * - The id of variable
     * @typedef {string} variables.varIdString
     */
    varIdString;


    /**
     * vars
     * - All of the variables
     * @typedef {object} variables.vars
     * @property {object} vars.variableData - Variable's data
     * @property {index} vars.variableData.index - Variable's index
     * @property {string} vars.variableData.name - Variable's name
     * @property {*} vars.variableData.value - Variable's value
     */
    vars;

    /**
     * count
     * - The count of variables
     * @typedef {number} variables.count
     */
    count;

    /**
     * varNames 
     * - The name of all variables
     * @typedef {object} variables.varNames
     * @property {Array<boolean>} varNames.name - If the name is been created
     */
    varNames;

     /**
      * startNum
      * - The next variable's starting number
      * @typedef {number} variables.startNum
      */
     startNum;



    /**
     * @description Add a variable
     * @param {string} name - The name of variable
     * @param {*} value - The value of variable
     * @returns {string} varIdString - The id of variable {@link variables.varIdString}
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * console.log(sideex.variables.add("var-0", "hello"));
     * console.log(sideex.variables.get("vars"));
     */
    add(name, value){
        return varIdString
    }


    /**
     * @description Get the details of variables
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.variables.add();
     * sideex.variables.add();
     * sideex.variables.add();
     * console.log(sideex.variables.get("vars"));
     * console.log(sideex.variables.get("count"));
     * console.log(sideex.variables.get("startNum"));
     * console.log(sideex.variables.get("varNames"));
     * @param {"count" | "startNum" | "varNames" | "vars"} [target = "vars"] - The target to get the result
     * @returns {number | object} count | vars | varNames | startNum 
     */
    get(target){
        switch(target){
            case "count":
                return count
            case "startNum":
                return startNum
            case "varNames":
                return varNames
            case "vars":
                return vars
        }    
    }

    /**
     * @description Delete a variable by id
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.variables.add();
     * console.log(sideex.variables.get("vars"));
     * console.log(sideex.variables.delete("var-0"));
     * console.log(sideex.variables.get("vars"));
     * @param {string} varIdString - The id of variable
     * @returns {string} varIdString - The id of variable
     */
    delete(varIdString){
        return varIdString
    }

    /**
     * @description Delete all variables
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.variables.add();
     * sideex.variables.add();
     * sideex.variables.add();
     * console.log(sideex.variables.get("vars"));
     * sideex.variables.clearAll();
     * console.log(sideex.variables.get("vars"));
     */
    clearAll(){
        
    }

    /**
     * @description Change the name of a variable 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.variables.add("var-0", "hello");
     * console.log(sideex.variables.changeName("var-0", "var-1"));
     * console.log(sideex.variables.get("vars"));
     * @param {string} varIdString -The id of variable
     * @param {string} name - The new name of variable
     * @returns {object} {varIdString, name}
     */
    changeName(varIdString, name){
        return {varIdString, name}
    }

    /**
     * @description Change the value of a variable 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.variables.add("var-0", "hello");
     * console.log(sideex.variables.changeValue("var-0", "hi"));
     * console.log(sideex.variables.get("vars"));
     * @param {string} varIdString - The id of variable
     * @param {string} value - The new value of variable
     * @returns {object} {varIdString, value}
     */
    changeValue(varIdString, value){
        return {varIdString, value}
    }
}


/**
 * sideex.log
 */
class log{
    /**
     * 
     */
    constructor(){

    }
   

    /**
     * logs 
     * - All Logs
     * @typedef {object} log.logs
     * @property {string} logs.type - Log's type
     * @property {string} logs.message - Log's message
     */
    logs;


    /**
     * logTypeMap 
     * - Log of XXX type
     * @typedef {Array<string>} log.logTypeMap
     * @property {Array} logTypeMap.debug - Debug type
     * @property {Array} logTypeMap.info - Info type
     * @property {Array} logTypeMap.error - Error type
     * @property {Array} logTypeMap.warn - Warning type
     */
    logTypeMap;


     /**
      * Get logs
      * @example
      * import {SideeX} from "sideex-api"
      * var sideex = new SideeX();
      * console.log(sideex.log.get("logs"));
      * console.log(sideex.log.get("typeMap"));
      * @param {"logs" | "typeMap"} target - Two kind of logs to get, "logs":logs,"typeMap":logTypeMap
      * @returns {object} logs | logTypeMap
      */
    get(target){
        switch(target){
            case "logs":
                return logs
            case "typeMap":
                return logtypeMap
        }
    }

    /**
     * @description Delete all logs
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * console.log(sideex.log.clear());
     * @returns {object} logs 
     */
    clear(){
        return logs
    }
}

/**
 * sideex.recorder
 */
class recorder{
    /**
     * 
     */
    constructor(){

    }
  

    /**
     * selectedCaseId 
     * - The test case id that currently selected
     * @typedef {string} recorder.selectedCaseId
     */
    selectedCaseId;


    /**
     * @description Start recording a test case
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.recorder.start();
     * sideex.recorder.stop();
     * @param {string} [caseIdString = selectedCaseId] - The id of the test case
     */
    start(caseIdString = selectedCaseId){

    }

    /**
     * @description Stop recording
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.recorder.start();
     * sideex.recorder.stop();
     */
    stop(){

    }
}

/**
 * sideex.setting
 */
class setting{
    /**
     * 
     */
    constructor(){

    }


    /**
     * speed 
     * - The play speed (1 ~ 5)
     * @typedef {number} setting.speed
     */
    speed;


    /**
     * @description Set the play speed (1 ~ 5)
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.setting.setSpeed(3);
     * console.log(sideex.setting.getSpeed());
     * @param {number} value - The setting value(1 ~ 5)
     * @returns {number} value - The setting value(1 ~ 5)
     */
    setSpeed(value){
        return value
    }

    /**
     * @description Get the playing speed
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
      * sideex.setting.setSpeed(3);
     * console.log(sideex.setting.getSpeed());
     * @returns {number} speed - The play speed (1 ~ 5)
     */
    getSpeed(){
        return speed
    }
}


/**
 * sideex.playback
 */
class playback{
    /**
     * 
     */
    constructor(){

    }
    

   

    /**
     * selectedCaseId 
     * - The test case id that currently selected
     * @typedef {string} playback.selectedCaseId
     */
    selectedCaseId;
    

     /**
      * selectedSuiteId 
      * - The test suite id that currently selected
      * @typedef {string} playback.selectedSuiteId
      */
     selectedSuiteId;


    /**
     * @description Start playing 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * //you should have some test cases or commands first.
     * //choose a mode to do playback.
     * sideex.playback.start("all");//play all test suites.
     * sideex.playback.start("suite");//play the test suite you selected.
     * sideex.playback.start("case");//play the test case you selected.
     * sideex.playback.stop();
     * @param {"all" | "suite" | "case"} [mode = "all"] - The mode to play -- (mode == "all"): Play all the test suites, (mode == "suite"): Play the test suite you selected, (mode == "case"): Play the test case you selected, 
     * @param {string} [idString = selectedCaseId | selectedSuiteId] - (mode == "all"): test case's id, (mode == "suite"): test suite's id (mode == "case"): test case's id
     * @param {number} [speed] - The play speed (1 ~ 5)
     */
    start(mode = "all", idString = undefined, speed = 5){

    }

    /**
     * @description Stop playing
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.playback.start();
     * sideex.playback.stop();
     */
    stop(){

    }

    /**
     * @description Pause playing
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.playback.start();
     * sideex.playback.pause();
     * sideex.playback.resume();
     */
     
    pause(){
        
    }

    /**
     * @description Resume playing
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.playback.start();
     * sideex.playback.pause();
     * sideex.playback.resume();
     */
    resume(){
        
    }

    /**
     * The function of your own command - declare by yourself
     * @typedef {Function} playback.commandFunction
     * @param {string} target - The command's target
     * @param {string} value - The command's value
     */
    commandFunction(target, value){
        
    }


    /**
     * @description Add customize command for playback 
     * @param {string} cmdName - Command name
     * @param {boolean} verifyLocator - Is the target a locator(a yellow box appears before running)
     * @param {function} commandFunction - The {@link commandFunction} that you declared
     */
    addCustomCommand(
        cmdName, 
        verifyLocator = true,  
        commandFunction
    ){

    }

    /**
     * @description Find an element by a supported locator
     * @param {string} locator - The locator of element
     * @returns {Element} Element object
     */
    findElement(locator){
        return element
    }

    /**
     * @description Find the element location 
     * @param {Element} element - Element object
     * @param {string} coordString - coordString
     * @returns {Array<number>} element's X, Y
     */
    getClientXY(element, coordString){
        return array
    }
    

}

/**
 * sideex.file.testSuite
 */
class testSuite {
    /**
     * 
     */
    constructor(){

    }

   
    /**
     * suiteData 
     * - The detail of test suite
     * @typedef {object} testSuite.suiteData
     * @property {string} suiteData.filename - The filename of test suite
     * @property {string} suiteData.title - The title of test suite
     * @property {Array<string>} suiteData.cases - The test cases in the test suite
     * @property {boolean} suiteData.modified - Is this test suite modified
     * @property {string} suiteData.status - The status of test suite
     */
    suiteData;
    

    /**
     * suiteIdString
     * - The id of test suite
     * @typedef {string} testSuite.suiteIdString
     */
    suiteIdString;

    /**
     * suiteIdStrings
     * - The id of test suites
     * @typedef {Array<string>} testSuite.suiteIdStrings
     */
    suiteIdStrings;

    /**
     * selectedSuitesId 
     * - The test suites' id that currently selected
     * @typedef {Array<string>} testSuite.selectedSuitesId
     */
    selectedSuitesId;

    /**
     * jsonString
     * - String of JSON object
     * @typedef {string} testSuite.jsonString
     */
    jsonString;




    /**
     * @description Add a new test test suite 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * console.log(sideex.file.testSuite.add());
     * @param {object} [suiteData] - The detail of test suite
     * @returns {string} suiteIdString - The id of test suite
     */
    add(suiteData){
        return suiteIdString
    }

    /**
     * @description Get the detail of the test suite 
     * @param {string} suiteIdString - The id of test suite
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.get("suite-0");
     * @returns {object} suiteData - The detail of test suite
     */
    get(suiteIdString){
        return suiteData
    }

    /**
     * @description Get id by test suite name  
     * @param {string} suiteName - The name of test suite
     * @returns {string} suiteIdString - The id of test suite
     */
    getSuiteIdString(suiteName){
        return suiteIdString
    }

    /**
     * @description Rename the test suite 
     * @param {string} suiteIdString - The id of test suite
     * @param {string} newSuiteName - The new name for test suite
     * @returns {string} newSuiteName - The new name for test suite
     */
    rename(suiteIdString, newSuiteName){
        return newSuiteName
    }

    /**
     * @description Copy the test suite 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.copy("suite-0");
     * console.log(sideex.file.testSuite.getSuitesOrder());
     * @param {Array<string>} [suiteIdStrings = selectedSuitesId] - The id of test case to copy and paste
     */
    copy(suiteIdStrings){

    }

    /**
     * @description Get the test suites' order
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.add();
     * console.log(sideex.file.testSuite.getSuitesOrder());
     * @returns {Array<string>} suiteIdStrings - The ids of test suites
     */
    getSuitesOrder(){
        return suiteIdStrings
    }

    /**
     * @description Close test suites 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * console.log(sideex.file.testSuite.getSuitesOrder());
     * sideex.file.testSuite.close("suite-0");
     * console.log(sideex.file.testSuite.getSuitesOrder());
     * @param {Array<string>} suiteIdStrings - The ids of test suites
     */
    close(suiteIdStrings){

    }

    /**
     * @description Close all of the test suites
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.add();
     * console.log(sideex.file.testSuite.getSuitesOrder());
     * sideex.file.testSuite.closeAll();
     * console.log(sideex.file.testSuite.getSuitesOrder());
     */
    closeAll(){

    }

    /**
     * @description Change selected test suites 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.setSelected("suite-0");
     * console.log(sideex.file.testSuite.getSelected());
     * @param {Array<string>} suiteIdStrings - The ids of test suites
     */
    setSelected(suiteIdStrings){

    }

    /**
     * @description Get selected test suites 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testSuite.setSelected("suite-0");
     * console.log(sideex.file.testSuite.getSelected());
     * @returns {Array<string>} suiteIdStrings - The ids of test suites
     */
    getSelected(){
        return suiteIdStrings
    }

    /**
     * @description Load the file for playback 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.recorder.start();
     * //record commands.
     * sideex.recorder.stop();
     * //you have to have a test suite first, or just record one.
     * let jsonString = sideex.file.testSuite.save();
     * sideex.file.testSuite.load(jsonString);
     * sideex.playback.start();
     * @param {string} jsonString - String of JSON object
     */
    load(jsonString){

    }  
    /**
     * @description Save the file
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * //you have to have a test suite first, or just record one.
     * let jsonString = sideex.file.testSuite.save();
     * sideex.file.testSuite.load(jsonString);
     * sideex.playback.start();
     * @returns {string} - String of JSON object
     */
    save(){
        return jsonString
    }  
}


/**
 * sideex.file.testCase
 */
class testCase {
    
    /**
     * 
     */
    constructor(){

    }

   /** 
     * caseData 
     * - The detail of test case
     * @typedef {object} testCase.caseData
     * @property {string} caseData.title - The title of test case
     * @property {Array<string>} caseData.commands - The commands of test case
     * @property {string} caseData.suiteIdString - The suite id where it belongs to
     * @property {boolean} caseData.modified - Is this case modified
     * @property {string} caseData.status - The status of test case
     */
    caseData;

    /**
     * caseIdString 
     * - The id of test case
     * @typedef {string} testCase.caseIdString
     */
    caseIdString;

    /**
     * suiteIdString 
     * - The id of test suite
     * @typedef {string} testCase.suiteIdString
     */
    suiteIdString;

    /**
     * selectedSuiteId
     * - The test suite id that currently selected
     * @typedef {string} testCase.selectedSuiteId
     */
    selectedSuiteId;

    /**
     * selectedCasesId
     * - The test cases' id that currently selected
     * @typedef {Array<string>} testCase.selectedCasesId
     */
    selectedCasesId;
    

    /**
     * @description Add a new test test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * @param {object} [caseData] - The detail of test case
     * @returns {string} caseIdString - The id of test case
     */
    add(caseData){
        return this.caseIdString 
    }

    /**
     * @description Get the details of the test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * console.log(sideex.file.testCase.get("case-0"));
     * @param {string} caseIdString - The id of test case
     * @returns {object} caseData - The detail of test case
     */
    get(caseIdString){
        return caseData
    }

    /**
     * @description Get id by test case name 
     * @param {string} caseName - The name of test case
     * @param {string} [suiteIdString = selectedSuiteId] - The id of test suite
     * @returns {string} caseIdString - The id of test case
     */
    getCaseIdString(caseName, suiteIdString){
        return caseIdString
    }

    /**
     * @description Rename the test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * console.log(sideex.file.testCase.rename("case-0", "sideex"));
     * console.log(sideex.file.testCase.get("case-0"));
     * @param {string} caseIdString - The id of test case
     * @param {string} newCaseName - The new name for test case
     * @returns {string} newCaseName
     */
    rename(caseIdString, newCaseName){
        return newCaseName
    }

    /**
     * @description Copy the test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.copy("case-0", "suite-0");
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {Array<string>} [srcCaseIdStrings = selectedCasesId] - The id of test cases for source
     * @param {string} [dstSuiteIdString = selectedSuiteId] - The id of test suite for destination
     */
    copy(srcCaseIdStrings, dstSuiteIdString){

    }

    /**
     * @description Cut the test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.cut("case-0", "suite-0");
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {Array<string>} [srcCaseIdStrings = selectedCasesId] - The id of test cases for source
     * @param {string} [dstSuiteIdString = selectedSuiteId] - The id of destination test suite to paste
     */
    cut(srcCaseIdStrings, dstSuiteIdString){

    }

    /**
     * @description Remove the test case 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.remove("case-0");
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {string} caseIdString - The id of test case
     */
    remove(caseIdString){

    }

    /**
     * @description Get the test cases' order
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.add();
     * console.log(sideex.file.testCase.getCasesOrder());
     * @property {Array<string>} caseIdStrings - The ids of test cases
     * @returns {Array<string>} caseIdStrings - The ids of test cases
     */
    getCasesOrder(){
        return caseIdTests
    }

    /**
     * @description Change selected test cases 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.setSelected("case-0");
     * console.log(sideex.file.testCase.getSelected());
     * @param {Array<string>} caseIdStrings - The id of test cases
     */
    setSelected(caseIdStrings){

    }

    /**
     * @description Get selected test cases
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.testCase.setSelected("case-0");
     * console.log(sideex.file.testCase.getSelected());
     * @returns {Array<string>} caseIdStrings - The id of test cases
     */
    getSelected(){
        return caseIdStrings
    }   
}


/**
 * sideex.file.command
 */
class command {
    
    /**
     * 
     */
    constructor(){

    }


    /**
     * commandData
     * - The detail of command
     * @typedef {object} command.commandData
     * @property {string} commandData.id - The id of command
     * @property {string} commandData.name - The name of command
     * @property {object} commandData.target - The target of command
     * @property {number} commandData.target.usedIndex - The index of locator that currently using
     * @property {} commandData.target.options - Locators of target
     * @property {object} commandData.value - The value of command
     * @property {number} commandData.value.usedIndex - The index of locator that currently using
     * @property {} commandData.value.options - Locators of vlaue
     * @property {string} commandData.screenshot - The screenshot of command
     * @property {boolean} commandData.breakpoint - does it have breakpoint in the command
     * @property {string} commandData.status - The status of command
     */
    commandData;

    /**
     * selectedCaseId 
     * - The test case id that currently selected
     * @typedef {string} command.selectedCaseId
     */
    selectedCaseId;

    /**
     * selectedCommandIndex
     * - The command index that currently selected
     * @typedef {string} command.selectedCommandIndex
     */
    selectedCommandIndex;

    /**
     * lastCommandIndex 
     * - The last command index in the test case
     * @typedef {number} command.lastCommandIndex
     */
    lastCommandIndex;

    /**
     * commandIdString
     * - The id of a command
     * @typedef {string} command.commandIdString
     */
    commandIdString;

    /**
     * commandIdStrings
     * - The id of commands
     * @typedef {Array<string>} command.commandIdStrings
     */
    commandIdStrings;

    



    /**
     * @description Add a new command to a testcase
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * //You need to have a test suite and  a test case to add commands.
     * sideex.file.command.add();
     * @param {string} [caseIdString = selectedCaseId] - The id of test case to add command
     * @param {object} [commandData] - The detail of command
     */
    add(commandData, caseIdString){

    }

    /**
     * @description Get the details of the command 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * console.log(sideex.file.command.get(1,"case-0"));
     * @param {string} commandIndex - The index of command
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     * @returns {object} commandData - The detail of command
     */
    get(commandIndex, caseIdString){
        return this.commandData
    }

    /**
     * @description Delete a command
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.delete(1,"case-0");
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {string} commandIndex - The index of command
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     */
    delete(commandIndex, caseIdString){

    }

    /**
     * @description Delete all the commands in a testcase 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.deleteAll("case-0");
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     */
    deleteAll(caseIdString){

    }
      
    /**
     * @description Copy a command
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.copy("case-0", 1, "case-0", 3);
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {string} [srcCaseIdString = selectedCaseId] - The id of test case to copy
     * @param {number} [srcCommandIndex = selectedCommandIndex] - The index of command to copy
     * @param {string} [destCaseIdString = selectedCaseId] - The id of test case to paste
     * @param {number} [destCommandIndex = lastCommandIndex] - The index of command to paste
     */
    copy(srcCaseIdString, srcCommandIndex, destCaseIdString, destCommandIndex){

    }

    /**
     * @description Cut a command 
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.add();
     * sideex.file.command.cut("case-0", 1, "case-0", 2);
     * console.log(sideex.file.testCase.getCasesOrder());
     * @param {string} [srcCaseIdString = selectedCaseId] - The id of test case to cut
     * @param {number} [srcCommandIndex = selectedCommandIndex] - The index of command to cut
     * @param {string} [destCaseIdString = selectedCaseId] - The id of test case to paste
     * @param {number} [destCommandIndex = lastCommandIndex] - The index of command to paste
     */
    cut(srcCaseIdString, srcCommandIndex, destCaseIdString, destCommandIndex){

    }


    /**
     * @description Set a breakpoint to a command
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.setBreakpoint(true, 0, "case-0");
     * console.log(sideex.file.command.getBreakpoint(0, "case-0"));
     * @param {boolean} bool - Boolean of breakpoint
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     * @param {number} [commandIndex = selectedCommandIndex] - The index of command
     */
    setBreakPoint(bool, commandIndex, caseIdString){

    }

    /**
     * @description Get the breakpoint status of a command
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.setBreakpoint(true, 0, "case-0");
     * console.log(sideex.file.command.getBreakpoint(0, "case-0"));
     * @param {number} commandIndex - The index of command
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     * @returns {boolean} commandData.breakpoint - does it have breakpoint in the command
     */
    getBreakPoint(commandIndex, caseIdString){
        return commandData.breakpoint
    }
    
    /**
     * @description Change the using locator of the target or value
     * @param {number} usedIndex - The index of locator that currently using
     * @param {"target" | "value"} type -The type to change
     * @param {number} [commandIndex = selectedCommandIndex] - The index of command
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     */
    changeUsedIndex(usedIndex, type, commandIndex, caseIdString){

    }

    /**
     * @description claer all commands status in a testcase
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.clearStatus();
     * @param {string} [caseIdString = selectedCaseId] - The id of test case
     */
    clearStatus(caseIdString){

    }

    /**
     * @description clear all commands status
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.clearAllStatus();
     */
    clearAllStatus(){

    }

    /**
     * @description Set the selected commands
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX(); 
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.setSelected("command-0");
     * console.log(sideex.file.command.getSelected());
     * @param {Array<string>} commandIdStrings - The id of commands
     */
    setSelected(commandIdStrings){

    }

     /**
     * @description Get the selected commands
     * @example
     * import {SideeX} from "sideex-api"
     * var sideex = new SideeX();
     * sideex.file.testSuite.add();
     * sideex.file.testCase.add();
     * sideex.file.command.add();
     * sideex.file.command.setSelected("command");
     * console.log(sideex.file.command.getSelected());
     * @returns {Array<string>} commandIdStrings - The id of commands
     */
    getSelected(){
        return commandIdStrings
    }
}

