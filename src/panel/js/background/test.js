import SideeX from './api';

const test = {
    addVars: () => {
        console.log('add');
        SideeX.variables.add("varName-1", 0);
        SideeX.variables.add("varName-2", 1);
        console.log("it should add vars", SideeX.variables.get("vars"));
    },
    getVars: () => {
        console.log('get');
        console.log("it should get vars' count", SideeX.variables.get("count"));
        console.log("it should get vars' startNum", SideeX.variables.get("startNum"));
        console.log("it should get vars' varNames", SideeX.variables.get("varNames"));
        console.log("it should get vars", SideeX.variables.get("vars"));
    },
    deleteVars: () => {
        console.log('delete');
        SideeX.variables.delete('var-1');
        console.log('it suould delete vars by varIdText', SideeX.variables.get("vars"));

    },
    
    execute: () => {
        console.log("variables-api");
        test.addVars();
        test.getVars();
        test.deleteVars();
    }
};

export default test;

