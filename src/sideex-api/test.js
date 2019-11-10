import { SideeX } from './index';

export const sideex = new SideeX();
export const test = {
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
    }
};
