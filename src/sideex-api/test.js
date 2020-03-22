import { SideeX } from './index';
import { classBody } from '@babel/types';
const sideex = new SideeX();
const test = {
    addVars: () => {
        console.log('add');
        sideex.variables.add("varName-1", 0);
        sideex.variables.add("varName-2", 1);
        console.log("it should add vars", sideex.variables.get("vars"));
    },
    getVars: () => {
        console.log('get');
        console.log("it should get vars' count", sideex.variables.get("count"));
        console.log("it should get vars' startNum", sideex.variables.get("startNum"));
        console.log("it should get vars' varNames", sideex.variables.get("varNames"));
        console.log("it should get vars", sideex.variables.get("vars"));
    },
    deleteVars: () => {
        console.log('delete');
        sideex.variables.delete('var-1');
        console.log('it suould delete vars by varIdText', sideex.variables.get("vars"));

    },

    execute: () => {
        console.log("variables-api");
        test.addVars();
        test.getVars();
        test.deleteVars();
    },

    testsuite_check: () => {
        console.log("testsuite_check");
        sideex.file.testSuite.add({title:"tyler"});
        console.log(sideex.file.testSuite.getSuiteIdText("tyler"));
        console.log(sideex.file.testSuite.get("suite-0"));

    }
};
// test.testsuite_check();
// console.log(sideex);
var input = document.getElementById('input');
var all = document.getElementById('all');
var suite = document.getElementById('suite');
var cases = document.getElementById('case');
var yellow = document.getElementById('change_yellow');
var white = document.getElementById('change_white');
var color = document.getElementById('color');
var tests = document.getElementById('test');
input.addEventListener("change", handlefile, false);
all.addEventListener("click", ()=>{
    sideex.playback.start();
}, false);
suite.addEventListener("click", ()=>{     
    
}, false);
cases.addEventListener("click", ()=>{ 
    console.log(sideex.file.testSuite.get("suite-0"));
    console.log(sideex.file.testCase.get("case-0"));
}, false); 
yellow.addEventListener("click", ()=>{
    yellow.style.backgroundColor = "yellow";
}, false);
white.addEventListener("click", ()=>{
    console.log(sideex.recorder.stop());
}, false);
tests.addEventListener("click", ()=>{
    console.log(sideex.file.testSuite.getSelected())
    console.log(sideex.file.testCase.getSelected());;
    console.log(sideex.file.record.get(0));
    console.log(sideex.test.selectForm("showText", 0));
}, false);
color.addEventListener("click", ()=>{
    console.log(sideex.recorder.start());
},false);

function handlefile() {
    var file = this.files[0];
    console.log(file);
    sideex.file.testSuite.load(file);
    
}





