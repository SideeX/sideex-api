<!-- <style>
.First {
  background-color:#e7e8e3;
}
</style> -->
#  <span class="First">SideeX JavaScript API</span>
[![npm-version](https://img.shields.io/npm/v/sideex-api)](https://www.npmjs.com/package/sideex-api) [![npm-download](https://img.shields.io/npm/dw/sideex-api)](https://www.npmjs.com/package/sideex-api) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-red)](https://github.com/SideeX/sideex-api)

SideeX JavaScript API is a JS library running on a webpage for recording and playing web browsing behavior. As opposed to acting as a browser web extension, the API can be directly embedded and used within a webpage via JavaScript.

#    Installation
```javascript
npm i sideex-api
```






#    Example
####  Record and playback
```javascript
import {SideeX} from "sideex-api" 
/* or
var {SideeX} = require('sideex-api') 
*/
var sideex = new SideeX();

sideex.recorder.start();//start recording
/* 
  Record a command
  For example: click at anywhere on the window,
  then you get a ClickAt command  
*/
sideex.recorder.stop();//stop recording
console.log(sideex.file.command.get(0));//get the first recorded command
sideex.playback.start();//replay the recorded commands
```


####  Save and load the recorded commands
```javascript
import {SideeX} from "sideex-api"
var sideex = new SideeX();

sideex.recorder.start();//start recording
/* 
  Record a command
  For example: click at anywhere on the window,
  then you get a ClickAt command  
*/
sideex.recorder.stop();//stop recording
console.log(sideex.file.command.get(0));//get the record that you recorded
let jsonString = sideex.file.testSuite.save();//serialize the recorded commands to a JSON string

//save the jsonString on your own

sideex.file.testSuite.load(jsonString);//load the jsonString
sideex.playback.start();//replay the recorded commands
```


####  Change a recorded command to a user-defined action
```javascript
import {SideeX} from "sideex-api"
var sideex = new SideeX();

sideex.recorder.start();//start recording
/* 
  Record a command
  For example: click at anywhere on the window,
  then you get a ClickAt command  
*/
sideex.recorder.stop();//stop recording
console.log(sideex.file.command.get(0));//get the first recorded command
let command = sideex.file.command.get(0);
command.name = "myAction";//rename the command name to "myAction"
console.log(sideex.file.command.get(0));//see the change of the command name
//add a user-defined function for executing "myAction"
sideex.playback.addCustomCommand("myAction", true, (target, value) => {
    console.log(target, value);
    //define the action here
    }
);
sideex.playback.start();//replay the modified recorded commands
```


#    [API Docs](https://sideex.github.io/sideex-api)

