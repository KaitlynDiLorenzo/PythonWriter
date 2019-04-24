/*

*/

// Only set to 1 when not debugging in browser. Requires Node.js. Only one or the other can be set to 1. Cannot both be set to 1 at the same time.
const DEBUG_SEED = 902;

const DEBUG_WRITE = 1;
const DEBUG_READ = 0;
var seed;

const CODE_MAX_LENGTH = 20;
var count = 0;
var code;
var line_count = 0;

var variables_0 = new Map();
variables_0.set('bools', []);
variables_0.set('floats', []);
variables_0.set('ints', []);
variables_0.set('strings', []);
variables_0.set('lists', []);

var variables = [variables_0];
var if_level = 0;

var strings = ['shark', 'energy', 'snow', 'sleeve', 'delivery', 'pony', 'integrity', 'wake', 'radiation', 'lose', 'golf', 'aloof', 'privilege', 'organize', 
    'Sunday', 'lie', 'technique', 'tap', 'topple', 'makeup', 'finished', 'carpet', 'will', 'rule', 'mild'];

write_code();
console.log(code);

/////////////////////////////////////////////////////////////////////////////

function Variable(name, type, value) {
    this.name = name; //string
    this.type = type; //Must be float, int, str, bool
    this.value = value; // Matches the type

    if((type == 'float' && typeof(value) == 'number' && Number.isInteger(value)) || (type == 'int' && !Number.isInteger(value)) || (type == 'str' && typeof(value) != 'string') || type == 'bool' && !(value == 'True' || value == 'False')) {
        alert('Error: type and value mismatch in Variable()');
    }
}

// Checks if array contains an object
function contains(array, object) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].name == object.name) return true;
    }
    return false;
}

// Returns a copy of a variable map
function copyMap(map) {
    var newMap = new Map();
 
    newMap.set('bools', []);
    newMap.set('floats', []);
    newMap.set('ints', []);
    newMap.set('strings', []);
    newMap.set('lists', []);

    for(var i = 0; i < map.get('bools').length; i++) {
        var newVar = newVariable(map.get('bools')[i].name, 'bool', map.get('bools')[i].value);
        newMap.get('bools').push(newVar);
    }
    for(var i = 0; i < map.get('floats').length; i++) {
        var newVar = newVariable(map.get('floats')[i].name, 'float', map.get('floats')[i].value);
        newMap.get('floats').push(newVar);
    }
    for(var i = 0; i < map.get('ints').length; i++) {
        var newVar = newVariable(map.get('ints')[i].name, 'int', map.get('ints')[i].value);
        newMap.get('ints').push(newVar);
    }
    for(var i = 0; i < map.get('strings').length; i++) {
        var newVar = newVariable(map.get('strings')[i].name, 'str', map.get('strings')[i].value);
        newMap.get('strings').push(newVar);
    }

    return newMap;
}

// When a non-bool variable gets assigned a bool value, cleans up the variables[if_level] map
function fixToBool(variable) {
    if(variable.type == 'float') {
        var index = getFloatByName(variable.name);
        variables[if_level].get('floats').splice(index,1);
    }
    else if(variable.type == 'int') {
        var index = getIntByName(variable.name);
        variables[if_level].get('ints').splice(index,1);
    }
    else if(variable.type == 'str') {
        var index = getStrByName(variable.name);
        variables[if_level].get('strings').splice(index, 1);
    }
    else if(variable.type == 'list') {
        var index = getListByName(variable.name);
        variables[if_level].get('lists').splice(index,1);
    }
    variable.type = 'bool';

    var i;
    for(i = 0; i < variables[if_level].get('bools').length; i++) {
        if(parseInt(variables[if_level].get('bools')[i].name.substring(3)) > parseInt(variable.name.substring(3))) {
            variables[if_level].get('bools').splice(i,0,variable);
            break;
        }
    }
    if(i == variables[if_level].get('bools').length) variables[if_level].get('bools').push(variable);
}

// When a non-float variable gets assigned a float value, cleans up the variables map
function fixToFloat(variable) {
    if(variable.type == 'bool') {
        var index = getBoolByName(variable.name);
        variables[if_level].get('bools').splice(index,1);
    }
    else if(variable.type == 'int') {
        var index = getIntByName(variable.name);
        variables[if_level].get('ints').splice(index,1);
    }
    else if(variable.type == 'str') {
        var index = getStrByName(variable.name);
        variables[if_level].get('strings').splice(index, 1);
    }
    else if(variable.type == 'list') {
        var index = getListByName(variable.name);
        variables[if_level].get('lists').splice(index,1);
    }
    variable.type = 'float';

    var i;
    for(i = 0; i < variables[if_level].get('floats').length; i++) {
        if(parseInt(variables[if_level].get('floats')[i].name.substring(3)) > parseInt(variable.name.substring(3))) {
            variables[if_level].get('floats').splice(i,0,variable);
            break;
        }
    }
    if(i == variables[if_level].get('floats').length) variables[if_level].get('floats').push(variable);
}

// When a non-int variable gets assigned an int value, cleans up the variables[if_level] map
function fixToInt(variable) {
    if(variable.type == 'bool') {
        var index = getBoolByName(variable.name);
        variables[if_level].get('bools').splice(index,1);
    }
    else if(variable.type == 'float') {
        var index = getFloatByName(variable.name);
        variables[if_level].get('floats').splice(index,1);
    }
    else if(variable.type == 'str') {
        var index = getStrByName(variable.name);
        variables[if_level].get('strings').splice(index, 1);
    }
    else if(variable.type == 'list') {
        var index = getListByName(variable.name);
        variables[if_level].get('lists').splice(index, 1);
    }
    variable.type = 'int';

    var i;
    for(i = 0; i < variables[if_level].get('ints').length; i++) {
        if(parseInt(variables[if_level].get('ints')[i].name.substring(3)) > parseInt(variable.name.substring(3))) {
            variables[if_level].get('ints').splice(i,0,variable);
            break;
        }
    }
    if(i == variables[if_level].get('ints').length) variables[if_level].get('ints').push(variable);
}

// When a non-str variable gets assigned a string value, cleans up the variables[if_level] map
function fixToStr(variable) {
    if(variable.type == 'bool') {
        var index = getBoolByName(variable.name);
        variables[if_level].get('bools').splice(index,1);
    }
    else if(variable.type == 'float') {
        var index = getFloatByName(variable.name);
        variables[if_level].get('floats').splice(index,1);
    }
    else if(variable.type == 'int') {
        var index = getIntByName(variable.name);
        variables[if_level].get('ints').splice(index, 1);
    }
    else if(variable.type == 'list') {
        var index = getListByName(variable.name);
        variables[if_level].get('lists').splice(index, 1);
    }
    variable.type = 'str';

    var i;
    for(i = 0; i < variables[if_level].get('strings').length; i++) {
        if(parseInt(variables[if_level].get('strings')[i].name.substring(3)) > parseInt(variable.name.substring(3))) {
            variables[if_level].get('strings').splice(i,0,variable);
            break;
        }
    }
    if(i == variables[if_level].get('strings').length) variables[if_level].get('strings').push(variable);
}

// Addition, subtraction, multiplication, division, modulus, exponent, and floor division. Returns [String expr, String value]
function getArithmeticOperationFloat() {
    var op, a, b, returnValue;
    var a_is_float = false;
    var returnStr = '';

    option = getRandomInt(0,4)
    if(option == 0) op = ' + ';         // a | b must be float
    else if(option == 1) op = ' - ';    // a | b must be float
    else if(option == 2) op = ' * ';    // a | b must be float
    else if(option == 3) op = ' / ';    // always returns float
    else if(option == 4) op = ' ** ';   // a must be float, b must be int

    if(op != ' ** ') {
        var option = getRandomInt(0,5)
        //Use bool variable
        if(option == 0 && variables[if_level].get('bools').length > 0) {
            a = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
            returnStr += a.name;
            a = a.value;
        }
        //Use float variable
        if(option == 1 && variables[if_level].get('floats').length > 0) {
            a = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
            a_is_float = true;
            returnStr += a.name;
            a = a.value;
        }
        //Use int variable
        else if(option == 2 && variables[if_level].get('ints').length > 0) {
            a = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
            returnStr += a.name;
            a = a.value;
        }
        //Use random bool value
        else if(option == 3) {
            a = getRandomBool();
            returnStr += a;
        }
        //Use random int value
        else if(option == 4) {
            a = getRandomInt(-50,50);
            returnStr += a.toString();
        }
        //Use random float value
        else {
            a = getRandomFloat(-50,50).toFixed(2);
            a_is_float = true;
            returnStr += a.toString();
        } 
    }
    else {
        var option = getRandomInt(0,1)
        //Use float variable
        if(option == 0 && variables[if_level].get('floats').length > 0) {
            a = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
            a_is_float = true;
            returnStr += a.name;
        }
        //Use random float value
        else {
            a = getRandomFloat(-50,50).toFixed(2);
            a_is_float = true;
            returnStr += a.toString();
        }
    }

    returnStr += op;

    if(!(op == ' / ' || op == ' ** ') && !a_is_float) { // b must be float
        option = getRandomInt(0,1);
        if(option == 0 && variables[if_level].get('floats').length > 0) {
            b = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
            returnStr += b.name;
            b = b.value;
        }
        else {
            b = Number(getRandomFloat(-50,50).toFixed(1));
            if(b < 0) returnStr += '(' + b.toString() + ')';
            else returnStr += b.toString();
        }
    }
    else if(op == ' / '  || a_is_float && op != ' ** ') { // b can be float, int, or bool
        option = getRandomInt(0,5);
        if(option == 0 && variables[if_level].get('bools').length > 0 && op != ' / ') {
            b = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
            returnStr += b.name;
            if(b.value = 'True') b = 1;
            else b = 0;
        }
        else if(option == 1 && variables[if_level].get('floats').length > 0 && !(op == ' / ' && variables[if_level].get('floats').length == 1 && variables[if_level].get('floats')[0].value == 0.0)) {
            do {
                b = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
            } while(op == ' / ' && b.value == 0);
            returnStr += b.name;
            b = b.value;
        }
        else if(option == 2 && variables[if_level].get('ints').length > 0 && !(op == ' / ' && variables[if_level].get('ints').length == 1 && variables[if_level].get('ints')[0].value == 0)) {
            do {
                b = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
            } while(op == ' / ' && b.value == 0);
            returnStr += b.name;
            b = b.value;
        }
        else if(option == 3) {
            if(op != ' / ') b = getRandomBool();
            else b = 'True';
            returnStr += b;
            if(b == 'True') b = 1;
            else b = 0;
        }
        else if(option == 4) {
            do {
                b = getRandomInt(-100,100);
            } while(op == ' / ' && b == 0);
            if(b < 0) returnStr += '(' + b.toString() + ')';
            else returnStr += b.toString();
        }
        else {
            do {
                b = getRandomFloat(-100,100).toFixed(1);
            } while(op != ' / ' && b == 0);
            if(b < 0) returnStr += '(' + b.toString() + ')';
            else returnStr += b.toString();
        }
    }
    else { //if(op == ' ** ') b must be int or bool
        option = getRandomInt(0,3);
        if(option == 0 && variables[if_level].get('bools').length > 0 && op != ' / ') {
            b = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
            returnStr += b.name;
            if(b.value = 'True') b = 1;
            else b = 0;
        }
        else if(option == 1 && variables[if_level].get('ints').length > 0 && !(op == ' / ' && variables[if_level].get('ints').length == 1 && variables[if_level].get('ints')[0].value == 0)) {
            do {
                b = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
            } while(op == ' / ' && b.value == 0);
            returnStr += b.name;
            b = b.value;
        }
        else if(option == 2) {
            if(op != ' / ') b = getRandomBool();
            else b = 'True';
            returnStr += b;
            if(b == 'True') b = 1;
            else b = 0;
        }
        else if(option == 3) {
            do {
                b = getRandomInt(-50,50);
            } while(op == ' / ' && b == 0);
            if(b < 0) returnStr += '(' + b.toString() + ')';
            else returnStr += b.toString();
        }
    }

    if(op == ' + ') returnValue = a+b;
    else if(op == ' - ') returnValue = a-b;
    else if(op == ' * ') returnValue = a*b;
    else if(op == ' / ') returnValue = a/b;
    else if(op == ' ** ') returnValue = Math.pow(a,b);

    return [returnStr,returnValue];
}

// Write arithmetic operations that evaluate to int values. Addition, subtraction, multiplication, division, modulus, exponent, and floor division. Returns [String expr, String value]
function getArithmeticOperationInt() {
    var a, b, op;
    var op_is_division = false;
    var returnStr = '';
    var returnValue;

    var option = getRandomInt(0,5)
    if(option == 0) op = ' + ';
    else if(option == 1) op = ' - ';
    else if(option == 2) op = ' * ';
    else if(option == 3) {
        op = ' % ';
        op_is_division = true;
    }
    else if(option == 4) op = ' ** ';
    else {
        op = ' // ';
        op_is_division = true;
    }

    option = getRandomInt(0,5)
    //Use bool variable
    if(option == 0 && variables[if_level].get('bools').length > 0) {
        a = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        returnStr += a.name;
        if(a.value == 'True') a = 1;
        else a = 0;
    }
    //Use float variable
    else if(option == 1 && variables[if_level].get('floats').length > 0 && op_is_division) {
        a = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        returnStr += a.name;
    }
    //Use int variable
    else if(option == 2 && variables[if_level].get('ints').length > 0) {
        a = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        returnStr += a.name;
    }
    //Use random bool value
    else if(option == 3) {
        a = getRandomBool();
        returnStr += a;
        if(a == 'True') a = 1;
        else a = 0;
    }
    //Use random float value
    else if(option == 4 && op_is_division) {
        a = getRandomFloat(-100,100).toFixed(2);
        returnStr += a.toString();
    }
    //Use random int value
    else {
        a = getRandomInt(-100,100);
        returnStr += a.toString();
    }

    returnStr += op;

    option = getRandomInt(0,5)
    //Use bool variable
    if(option == 0 && variables[if_level].get('bools').length > 0 && !op_is_division) {
        b = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        returnStr += b.name;
        if(b.value == 'True') b = 1;
        else b = 0;
    }
    //Use float variable
    else if(option == 1 && variables[if_level].get('floats').length > 0 && op_is_division) {
        b = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        returnStr += b.name;
    }
    //Use int variable
    else if(option == 2 && variables[if_level].get('ints').length > 0) {
        b = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        returnStr += b.name;
    }
    //Use random bool value
    else if(option == 3 && !op_is_division) {
        b = getRandomBool();
        returnStr += b;
        if(b == 'True') b = 1;
        else b = 0;
    }
    //Use random float value
    else if(option == 4 && op_is_division) {
        b = getRandomFloat(-100,100).toFixed(2);
        returnStr += b.toString();
    }
    //Use random int value
    else {
        b = getRandomInt(-100,100);
        returnStr += b.toString();
    }

    if(returnStr.includes(' + ')) returnValue = a+b;
    else if(returnStr.includes(' - ')) returnValue = a-b;
    else if(returnStr.includes(' ** ')) returnValue = Math.pow(a,b);
    else if(returnStr.includes(' * ')) returnValue = a*b;
    else if(returnStr.includes(' % ')) returnValue = a%b;
    else if(returnStr.includes(' // ')) returnValue = Math.floor(a/b);

    return [returnStr,returnValue];
}

// Write comparisons that evaluate to boolean values. Returns [String comparison, String value]
function getComparison() {
    var a, b;
    var returnBool;
    var returnStr;
    var option;

    //get a value
    if(getRandomInt(0,1) && variables[if_level].get('bools').length + variables[if_level].get('floats').length + variables[if_level].get('ints').length > 0) { // a is a variable
        option = getRandomInt(0,2);
        if(option == 0 && variables[if_level].get('bools').length > 0) a = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        else if(option == 1 && variables[if_level].get('floats').length > 0) a = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        else if(option == 2 && variables[if_level].get('ints').length > 0) a = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        else if(variables[if_level].get('ints').length > 0) a = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        else if(variables[if_level].get('floats').length > 0) a = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        else a = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        returnStr = a.name;
        a = a.value;
    }
    else { // a is a random value
        option = getRandomInt(0,2);
        if(option == 0) {
            a = getRandomBool();
            returnStr = a;
        }
        else if(option == 1) {
            a = getRandomFloat(-100,100);
            returnStr = a.toString();
        }
        else {
            a = getRandomInt(-100,100);
            returnStr = a.toString();
        }
    }

    if(a === 'True') a = 1;
    else if(a === 'False') a = 0;

    //get operator
    option = getRandomInt(0,5);
    if(option == 0) returnStr += ' == ';
    else if(option == 1) returnStr += ' != ';
    else if(option == 2) returnStr += ' > ';
    else if(option == 3) returnStr += ' < ';
    else if(option == 4) returnStr += ' >= ';
    else if(option == 5) returnStr += ' <= ';

    //get b value
    if(getRandomInt(0,1) && variables[if_level].get('bools').length + variables[if_level].get('floats').length + variables[if_level].get('ints').length > 0) { // b is a variable
        option = getRandomInt(0,2);
        if(option == 0 && variables[if_level].get('bools').length > 0) b = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        else if(option == 1 && variables[if_level].get('floats').length > 0) b = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        else if(option == 2 && variables[if_level].get('ints').length > 0) b = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        else if(variables[if_level].get('ints').length > 0) b = variables[if_level].get('ints')[getRandomInt(0,variables[if_level].get('ints').length-1)];
        else if(variables[if_level].get('floats').length > 0) b = variables[if_level].get('floats')[getRandomInt(0,variables[if_level].get('floats').length-1)];
        else b = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        returnStr += b.name;
        b = b.value;
    }
    else { // b is a random value
        option = getRandomInt(0,2);
        if(option == 0) {
            b = getRandomBool();
            returnStr += b;
        }
        else if(option == 1) {
            b = getRandomFloat(-100,100);
            returnStr += b.toString();
        }
        else {
            b = getRandomInt(-100,100);
            returnStr += b.toString();
        }
    }

    if(b === 'True') b = 1;
    else if(b === 'False') b = 0;

    //get value
    if(returnStr.includes('==')) returnBool = a==b;
    else if(returnStr.includes('!=')) returnBool = a!=b;
    else if(returnStr.includes('>=')) returnBool = a>=b;
    else if(returnStr.includes('<=')) returnBool = a<=b;
    else if(returnStr.includes('>')) returnBool = a>b;
    else if(returnStr.includes('<')) returnBool = a<b;

    return [returnStr,returnBool.toString()];
}

// Returns the index of variable in bool_variables[if_level] with name == name. Name is a string.
function getBoolByName(name) {
    for(var i = 0; i < variables[if_level].get('bools').length; i++) {
        if(variables[if_level].get('bools')[i].name == name) return i;
    }
    alert('Error: Bool variable not found in getBoolByName()');
    return -1;
}

// Returns the index of variable in float_variables[if_level] with name == name. Name is a string.
function getFloatByName(name) {
    for(var i = 0; i < variables[if_level].get('floats').length; i++) {
        if(variables[if_level].get('floats')[i].name == name) {
            return i;
        }
    }
    alert('Error: Float variable not found in getFloatByName()');
    return -1;
}

// Returns the index of variable in int_variables[if_level] with name == name. Name is a string.
function getIntByName(name) {
    for(var i = 0; i < variables[if_level].get('ints').length; i++) {
        if(variables[if_level].get('ints')[i].name == name) {
            return i;
        }
    }
    alert('Error: Int variable not found in getIntByName()');
    return -1;
}

// Returns the index of variable in str_variables[if_level] with name == name. Name is a string
function getStrByName(name) {
    for(var i = 0; i < variables[if_level].get('strings').length; i++) {
        if(variables[if_level].get('strings')[i].name == name) {
            return i;
        }
    }
    alert('Error: String variable not found in getStrByName()');
    return -1;
}

// Returns a random bool value (as a string)
function getRandomBool() {
    if(getRandomInt(0,1)) return 'True';
    else return 'False';
}

// Returns a random float between min and max (both inclusive). Min and max are both numbers
function getRandomFloat(min, max) {
    return seededRandom(min,max);
}

// Returns a random int between min and max (both inclusive). Min and max are both numbers
function getRandomInt(min, max) {
    return Math.floor(seededRandom(0,1) * (max - min + 1)) + min;
}

// Returns a random string. Wrapped in quotes.
function getRandomStr() {
    var returnStr = strings[getRandomInt(0, (strings.length)-1)];
    var returnValue = returnStr;

    var choice = getRandomInt(0,5);
    if(choice == 0) { //str
        returnStr = '\'' + returnStr + '\'';
        returnValue = returnStr;
    }
    if(choice == 1) { //str[0]
        var num = getRandomInt(0,returnStr.length-1);
        returnValue = '\'' + returnStr.substring(num,num+1) + '\'';
        returnStr = '\'' + returnStr + '\'' + '[' + num + ']';
    }
    else if(choice == 2) { //str[2:5]
        var int1 = getRandomInt(0,returnStr.length-1);
        var int2 = getRandomInt(int1,returnStr.length);
        returnValue = '\'' + returnStr.substring(int1,int2) + '\'';
        returnStr = '\'' + returnStr + '\'' + '[' + int1 + ':' + int2 + ']';
    }
    else if(choice == 3) { //str[2:]
        var num = getRandomInt(0,returnStr.length-1);
        returnValue = '\'' + returnStr.substring(num) + '\'';
        returnStr = '\'' + returnStr + '\'[' + getRandomInt(0,returnStr.length-1) + ':]';
    }
    else if(choice == 4) { //str * 2
        var num = getRandomInt(0,5);
        returnValue = '\'';
        for(var i = 0; i < num; i++) returnValue += returnStr;
        returnValue += '\'';
        returnStr = '\'' + returnStr + '\' * ' + num;
    }
    else if(choice == 5) { //print(str + str);
            var attachName;

            choice = getRandomInt(0,1);
            if(choice == 0 && variables[if_level].get('strings').length > 0) {
                var otherStr = variables[if_level].get('strings')[getRandomInt(0,variables[if_level].get('strings').length-1)];
                attachName = otherStr.name;
                otherStr = otherStr.value;
            }
            //Use string literal
            else {
                var otherStr = strings[getRandomInt(0,strings.length-1)];
                attachName = '\'' + otherStr + '\'';
            }
    
            choice = getRandomInt(0,5);
            if(choice == 0) { //str
                returnValue = returnValue + otherStr;
                returnStr = '\'' + returnStr + '\' + ' + attachName;
            }
            else if(choice == 1) { //str[0]
                var num = getRandomInt(0,otherStr.length-1);
                returnValue = returnValue + otherStr.substring(num,num+1);
                returnStr = '\'' + returnStr + '\' + ' + attachName + '[' + num + ']';
            }
            else if(choice == 2) { //str[2:5]
                var int1 = getRandomInt(0,otherStr.length-1);
                var int2 = getRandomInt(int1,otherStr.length);
                returnValue = returnValue + otherStr.substring(int1,int2);
                returnStr = '\'' + returnStr + '\' + ' + attachName + '[' + int1 + ':' + int2 + ']';
            }
            else if(choice == 3) { //str[2:]
                var num = getRandomInt(0,otherStr.length-1);
                returnValue = returnValue + otherStr.substring(num);
                returnStr = '\'' + returnStr + '\' + ' + attachName + '[' + num + ':]';
            }
            else if(choice == 4) { //str * 2
                var num = getRandomInt(0,5);
                returnValue = returnValue + otherStr.repeat(num);
                returnStr = '\'' + returnStr + '\' + ' + attachName + ' * ' + num;
            }
        returnValue = '\'' + returnValue + '\'';
    }
    return [returnStr, returnValue];
}

// Returns a random float, int, string, or bool and the type returned in an array [returnValue, 'returnType']
function getRandomValue(wantList) {
    //if(wantList) var option = getRandomInt(0,4);
    /*else*/ var option = getRandomInt(0,4);
    if(option == 0) return [getRandomBool(), 'bool'];
    if(option == 1) return [getRandomFloat(-100,100).toFixed(2), 'float'];
    else if(option == 2) return [getRandomInt(-100,100), 'int'];
    else return [getRandomStr(), 'str'];
    //else return [getRandomList(), 'list'];
}

// Returns random variable of any type
function getRandomVariable() {
    if(getVariablesLength() == 0) {
        alert('Error: Cannot get random variable from empty map in getRandomVariable()');
        return;
    }

    while(true) {
        var option = getRandomInt(0,4);
        if(option == 0 && variables[if_level].get('bools').length != 0) {
            var index = getRandomInt(0,variables[if_level].get('bools').length-1);
            return variables[if_level].get('bools')[index];
        }
        else if(option == 1 && variables[if_level].get('floats').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('floats').length-1);
            return variables[if_level].get('floats')[index];
        }
        else if(option == 2 && variables[if_level].get('ints').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('ints').length-1);
            return variables[if_level].get('ints')[index];
        }
        else if(option == 3 && variables[if_level].get('strings').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('strings').length-1);
            return variables[if_level].get('strings')[index];
        }
        else if(option == 4 && variables[if_level].get('lists').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('lists').length-1);
            return variables[if_level].get('lists')[index];
        }
        else if(variables[if_level].get('floats').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('floats').length-1);
            return variables[if_level].get('floats')[index];
        }
        else if(variables[if_level].get('ints').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('ints').length-1);
            return variables[if_level].get('ints')[index];
        }
        else if(variables[if_level].get('strings').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('strings').length-1);
            return variables[if_level].get('strings')[index];
        }
        else if(variables[if_level].get('bools').length != 0) {
            var index = getRandomInt(0,variables[if_level].get('bools').length-1);
            return variables[if_level].get('bools')[index];
        }
        else if(variables[if_level].get('lists').length != 0) {
            var index = getRandomInt(0, variables[if_level].get('lists').length-1);
            return variables[if_level].get('lists')[index];
        }
    }
}

// Returns the 'length' of variables[if_level] map (the total number of items in all of the arrays)
function getVariablesLength() {
    return variables[if_level].get('bools').length + variables[if_level].get('floats').length + variables[if_level].get('ints').length + variables[if_level].get('strings').length + variables[if_level].get('lists').length;
}

// Creates and returns a new variable object. Type must be either 'bool', float', 'int', or 'str'. Value is either a bool, float, int, or string
function addVariable(type, value) {
    var newVar = {
        name: 'var' + count.toString(),
        type: type,
        value: value
    };
    count++;

    if(type == 'bool') variables[if_level].get('bools').push(newVar);
    else if(type == 'float') variables[if_level].get('floats').push(newVar);
    else if(type == 'int') variables[if_level].get('ints').push(newVar);
    else if(type == 'str') variables[if_level].get('strings').push(newVar);
    else if(type == 'list') variables[if_level].get('lists').push(newVar);
    else alert('Error: Invalid type name in addVariable()');
    
    return newVar;
}

// Creates and returns a new variable without adding it to the Variables map.
function newVariable(name, type, value) {
    var newVar = {
        name: name,
        type: type,
        value: value
    };

    return newVar;
}

// Adds print statement for each variable to code
function print_all_variables() {
    code += '\n';

    var bools_i = 0;
    var floats_i = 0;
    var ints_i = 0;
    var strings_i = 0;
    var lists_i = 0;
    for(var i = 0; i <= count; i++) {
        var foundInBools = 0;
        var foundInFloats = 0;
        var foundInInts = 0;
        var foundInStrings = 0;
        for(var j = bools_i; j < variables[if_level].get('bools').length; j++) {
            if(variables[if_level].get('bools')[j].name == 'var' + i.toString()) {
                code += 'print(\'' + variables[if_level].get('bools')[j].name + ' = \' + str(' + variables[if_level].get('bools')[j].name + '))';
                code += '\n';
                bools_i = j;
                foundInBools = 1;
                break;
            }
        }
        if(foundInBools) continue;
        for(var j = floats_i; j < variables[if_level].get('floats').length; j++) { // print('var0 = ' + str(var0))
            if(variables[if_level].get('floats')[j].name == 'var' + i.toString()) {
                code += 'print(\'' + variables[if_level].get('floats')[j].name + ' = \' + str(' + variables[if_level].get('floats')[j].name + '))';
                code += '\n';
                floats_i = j;
                foundInFloats = 1;
                break;
            }
        }
        if(foundInFloats) continue;
        for(var j = ints_i; j < variables[if_level].get('ints').length; j++) {
            if(variables[if_level].get('ints')[j].name == 'var' + i.toString()) {
                code += 'print(\'' + variables[if_level].get('ints')[j].name + ' = \' + str(' + variables[if_level].get('ints')[j].name + '))';
                code += '\n';
                ints_i = j;
                foundInInts = 1;
                break;
            }
        }
        if(foundInInts) continue;
        for(var j = strings_i; j < variables[if_level].get('strings').length; j++) {
            if(variables[if_level].get('strings')[j].name == 'var' + i.toString()) {
                code += 'print(\'' + variables[if_level].get('strings')[j].name + ' = \' + str(' + variables[if_level].get('strings')[j].name + '))';
                code += '\n';
                strings_i = j;
                foundInStrings = 1;
                break;
            }
        }
        if(foundInStrings) continue;
        for(var j = lists_i; j < variables[if_level].get('lists').length; j++) {
            if(variables[if_level].get('lists')[j].name == 'var' + i.toString()) {
                code += 'print(\'' + variables[if_level].get('lists')[j].name + ' = \' + str(' + variables[if_level].get('lists')[j].name + '))';
                code += '\n';
                lists_i = j;
                break;
            }
        }
    }
}

function seededRandom(min, max) {
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280.0;

    return min + rnd * (max - min);
}

// The star of the show. Writes Python 3 code.
function write_code() {
    if(DEBUG_WRITE) {
        seed = Math.floor(Math.random() * 1001);
        console.log('#seed = ' + seed + '\n');
    }
    else if(DEBUG_READ) seed = DEBUG_SEED;
    else seed = Math.floor(Math.random() * 1001);

    code = '';
    line_count = 0;
    do {    //When adding functionality, also add to function write_body()
        code += write_line();
        line_count++;
    } while(line_count < 8 || (getRandomInt(0,1) && line_count < CODE_MAX_LENGTH));
    print_all_variables();

    return code;
}

// Writes assignment statements
function write_assign_stmt() {
    var option = getRandomInt(0,5);
    if(option == 0) return write_bool_assign();
    else if(option == 1) return write_float_assign();
    else if(option == 2) return write_int_assign();
    else if(option == 3) return write_str_assign();
    else if(option == 4) return write_mult_assign_1();
    else if(option == 5) return write_mult_assign_2();
    //else if(option == 5) write_list_assign();
}

// del var1
function write_del_stmt() {
    var returnStr = '';
    if(getVariablesLength() > 1) {
        var used_vars = [];
        returnStr += 'del ';
        do {
            do {
                var randomVar = getRandomVariable();
            } while(contains(used_vars,randomVar))
            used_vars.push(randomVar);
        } while(getRandomInt(0,1) && used_vars.length < getVariablesLength()-1);

        for(var i = 0; i < used_vars.length; i++) {
            returnStr += used_vars[i].name;
            if(i < used_vars.length-1) returnStr += ', ';

            if(used_vars[i].type == 'bool') {
                var index = getBoolByName(used_vars[i].name);
                variables[if_level].get('bools').splice(index,1);
            }
            else if(used_vars[i].type == 'float') {
                var index = getFloatByName(used_vars[i].name);
                variables[if_level].get('floats').splice(index, 1);
            }
            else if(used_vars[i].type == 'int') {
                var index = getIntByName(used_vars[i].name);
                variables[if_level].get('ints').splice(index, 1);
            }
            else if(used_vars[i].type == 'str') {
                var index = getStrByName(used_vars[i].name);
                variables[if_level].get('strings').splice(index, 1);
            }
            else if(used_vars[i].type == 'list') {
                var index = getListByName(used_vars[i].name);
                variables[if_level].get('lists').splice(index, 1);
            }
        }
        returnStr += '\n';
    }
    
    return returnStr;
}

// var1 = True
function write_bool_assign() {
    var returnStr = '';
    var newExpr;
    var newValue;
    if(getRandomInt(0,1)) newExpr = newValue = getRandomBool();
    else {
        newExpr = getComparison();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }

    //Reuse variable
    if(getRandomInt(0,1) && getVariablesLength() != 0) {
        var randomVar = getRandomVariable();
        returnStr += randomVar.name;
        randomVar.value = newValue;

        if(randomVar.type != 'bool') fixToBool(randomVar);
    }
    //New variable
    else {
        var newBool = addVariable('bool', newValue);
        returnStr += newBool.name;
    }

    returnStr += ' = ' + newExpr;

    return returnStr;
}

// var1 = var2 = var3 = True
function write_bool_mult_assign() {
    var returnStr = '';
    var newExpr, newValue;
    if(getRandomInt(0,1)) newExpr = newValue = getRandomBool();
    else {
        newExpr = getComparison();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }

    var used_variables = [];
    var option;

    do {
        option = getRandomInt(0,1);
        //Reuse variable
        if(option == 0 && getVariablesLength() != 0 && getVariablesLength() != used_variables.length) {
            do {
                var randomVar = getRandomVariable();
            } while(contains(used_variables,randomVar));
            randomVar.value = newValue;
            if(randomVar.type != 'bool') fixToBool(randomVar);
            used_variables.push(randomVar);

            returnStr += randomVar.name + ' = ';
        }
        //New variable
        else {
            var newVar = addVariable('bool', newValue);
            used_variables.push(newVar);

            returnStr += newVar.name + ' = ';
        }
    } while(getRandomInt(0,1));

    returnStr += newExpr.toString(); 
    
    return returnStr;
}

// var1 = 2.23 || var1 += 2.23
function write_float_assign() {
    var returnStr = '';
    var option;
    var reusedVariable = false;
    var nan = true;
    var newExpr;
    var newValue;
    var var_is_neg = false;

    //Get new value
    var newValue;
    if(getRandomInt(0,1)) {
        newExpr = newValue = getRandomFloat(-100,100).toFixed(2);
    }
    else {
        newExpr = getArithmeticOperationFloat();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }
    
    // Reuse variable
    option = getRandomInt(0,1);
    if(option == 0 && getVariablesLength() != 0) {
        reusedVariable = true;
        var randomVar = getRandomVariable();
        returnStr += randomVar.name;
        if(randomVar.value < 0) var_is_neg = true;

        if(randomVar.type == 'float' || randomVar.type == 'int') nan = false;
        if(randomVar.type != 'float') fixToFloat(randomVar);
    }
    // New variable
    else {
        var newFloat = addVariable('float', newValue);
        returnStr += newFloat.name;
    }

    if(!reusedVariable || nan) {
        returnStr += ' = ' + newExpr;
        return returnStr;
    }
    else {
        option = getRandomInt(0,7);
        if(option == 0) {
            returnStr += ' = ';
            randomVar.value = newExpr;
        }
        else if(option == 1) {
            returnStr += ' += ';
            randomVar.value += newExpr;
        }
        else if(option == 2) {
            returnStr += ' -= ';
            randomVar.value -= newExpr;
        }
        else if(option == 3) {
            returnStr += ' *= ';
            randomVar.value *= newExpr;
        }
        else if(option == 4 && newValue != 0) {
            returnStr += ' /= ';
            randomVar.value /= newExpr;
        }
        else if(option == 5) {
            returnStr += ' %= ';
            randomVar.value %= newExpr;
        }
        else if(option == 6 && !var_is_neg) {
            returnStr += ' **= ';
            randomVar.value **= newExpr;
        }
        else if(option == 7 && newValue != 0) {
            returnStr += ' //= ';
            randomVar.value = Math.floor(randomVar.value / newExpr);
        }
        else {
            returnStr += ' = ';
            randomVar.value = newExpr;
        }
        returnStr += newExpr;
    }

    return returnStr;
}

// var1 = var2 = var3 = 2.23
function write_float_mult_assign() {
    var returnStr = '';
    //Get new value
    var newExpr;
    var newValue;
    if(getRandomInt(0,1)) newExpr = newValue = getRandomFloat(-100,100).toFixed(2);
    else {
        newExpr = getArithmeticOperationFloat();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }

    var used_variables = [];
    var option;

    do {
        option = getRandomInt(0,1);
        //Reuse variable
        if(option == 0 && getVariablesLength() != 0 && getVariablesLength() != used_variables.length) {
            do {
                var randomVar = getRandomVariable();
            } while(contains(used_variables,randomVar));
            randomVar.value = newValue;
            if(randomVar.type != 'float') fixToFloat(randomVar);
            used_variables.push(randomVar);

            returnStr += randomVar.name + ' = ';
        }
        //New variable
        else {
            var newVar = addVariable('float', newValue);
            used_variables.push(newVar);

            returnStr += newVar.name + ' = ';
        }
    } while(getRandomInt(0,1));

    returnStr += newExpr.toString();

    return returnStr;
}

// if, if else, nested if
function write_if_stmt() {
    var false_condition = false;
    var returnStr = 'if(';

    if(getRandomInt(0,1) && variables[if_level].get('bools').length > 0) { //Condition is bool variable
        var bool = variables[if_level].get('bools')[getRandomInt(0,variables[if_level].get('bools').length-1)];
        returnStr += bool.name;  
        if(bool.value == 'False') {
            false_condition = true;
            var if_vars = copyMap(variables[if_level]);
            variables.push(if_vars);
            if_level++;
        }
    }
    else {  //Condition is comparison
        var comparison = getComparison();
        returnStr += comparison[0];
        if(comparison[1] == 'false') {
            false_condition = true;
            var if_vars = copyMap(variables[if_level]);
            variables.push(if_vars);
            if_level++;
        }
    }
    returnStr += '):'

    if(getRandomInt(0,2) == 0) { //if stmt body has 1
            returnStr += ' ';
            returnStr += write_line('no if');
    }
    else {  //if stmt body has 1 or more lines
        returnStr += '\n';
        do {
            returnStr += '\t' + write_line('no if');
        } while(getRandomInt(0,1));
    }

    if(false_condition) {
        variables.pop();
        if_level--;
    }

    if(getRandomInt(0,1)) { // else stmt
        returnStr += 'else:\n'
        false_condition = !false_condition;
        if(false_condition) {
            var if_vars = copyMap(variables[if_level]);
            variables.push(if_vars);
            if_level++;
        }
        if(getRandomInt(0,2) == 0) { //else stmt body has 1
            returnStr += ' ';
            returnStr += write_line('no if');
        }
        else {  // else stmt body has 1 or more lines
            do {
                returnStr += '\t' + write_line('no if');
            } while(getRandomInt(0,1));
        }

        if(false_condition) {
            variables.pop();
            if_level--;
        }
    }

    return returnStr;
}

// var1 = 2
function write_int_assign() {
    var returnStr = '';
    var option = getRandomInt(0,1);
    var reusedVariable = false;
    var nan = true;

    //Get new value
    var newExpr;
    var newValue;
    if(getRandomInt(0,1)) newExpr = newValue = getRandomInt(-100,100);
    else {
        newExpr = getArithmeticOperationInt();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }
    
    // Reuse variables[if_level]
    if(option == 0 && getVariablesLength() != 0) {
        var randomVar = getRandomVariable();
        reusedVariable = true;

        returnStr += randomVar.name;
        randomVar.value = newValue;

        if(randomVar.type == 'int' || randomVar.type == 'float') nan = false;
        if(randomVar.type != 'int') fixToInt(randomVar);
    }
    // New variable
    else {
        var newInt = addVariable('int', newValue);
        returnStr += newInt.name;
    }

    if(!reusedVariable || nan) returnStr += ' = ' + newExpr.toString();
    else {
        option = getRandomInt(0,7);
        if(option == 0) returnStr += ' = ';
        else if(option == 1) returnStr += ' += ';
        else if(option == 2) returnStr += ' -= ';
        else if(option == 3) returnStr += ' *= ';
        else if(option == 4) returnStr += ' /= ';
        else if(option == 5) returnStr += ' %= ';
        else if(option == 6) returnStr += ' **= ';
        else if(option == 7) returnStr += ' //= ';
        returnStr += newExpr.toString();
    }
    return returnStr;
}

// var1 = var2 = var3 = 2
function write_int_mult_assign() {
    var returnStr = '';
    //Get new value
    var newExpr, newValue;
    if(getRandomInt(0,1)) newExpr = newValue = getRandomInt(-100,100);
    else {
        newExpr = getArithmeticOperationInt();
        newValue = newExpr[1];
        newExpr = newExpr[0];
    }

    var used_variables = [];
    var option;

    do {
        option = getRandomInt(0,1);
        //Reuse variable
        if(option == 0 && getVariablesLength() != 0 && getVariablesLength() != used_variables.length) {
            do {
                var randomVar = getRandomVariable();
            } while(used_variables.includes(randomVar));
            randomVar.value = newValue;
            if(randomVar.type != 'int') fixToInt(randomVar);
            used_variables.push(randomVar);

            returnStr += randomVar.name + ' = ';
        }
        //New variable
        else {
            var newVar = addVariable('int', newValue);
            used_variables.push(newVar);

            returnStr += newVar.name + ' = ';
        }
    } while(getRandomInt(0,1));

    returnStr += newExpr.toString();

    return returnStr;
}

// Writes one line of code
function write_line(instruction='') {
    var option;
    var returnStr = '';

    while(returnStr == ''){
        if(instruction == 'no if') option = getRandomInt(0,4);
        else option = getRandomInt(0,5); 
        if(option == 0 || option == 1 || option == 2) {
            returnStr += write_assign_stmt();
            returnStr += '\n';
        }
        else if (option == 3) {
            returnStr += write_del_stmt();
        }
        else if (option == 4) {
            returnStr += write_print_stmt();
            returnStr += '\n';
        }
        else {
            returnStr += write_if_stmt();
        }
    }

    return returnStr;
}

// Writes assign statements of the form var1 = var2 = ... = varn = VALUE
function write_mult_assign_1() {
    var option = getRandomInt(0,3);
    if(option == 0) {
        return write_bool_mult_assign();
    }
    if(option == 1) {
        return write_float_mult_assign();
    }
    else if(option == 2) {
        return write_int_mult_assign();
    }
    else if(option == 3){
        return write_str_mult_assign();
    }
}

// Writes assign statements of the form var1, var2, ..., varn = VALUE, VALUE, ..., VALUE
function write_mult_assign_2() {
    var returnStr = '';
    var used_vars = [];

    do {
        var option = getRandomInt(0,1);
        // Reuse variable
        if(option == 0 && getVariablesLength() != 0 && used_vars.length != getVariablesLength) {
            do {
                var randomVar = getRandomVariable();
            } while(used_vars.length < getVariablesLength && used_vars.includes(randomVar));
            used_vars.push(randomVar);
        }
        // New variable
        else {
            var newVar = addVariable('float', null);
            used_vars.push(newVar);
        }
    } while(getRandomInt(0,1));

    var rhs = '';
    for(var i = 0; i < used_vars.length; i++) {
        returnStr += used_vars[i].name;
        if(i < used_vars.length-1) returnStr += ', ';

        var newValue = getRandomValue(1);
        if(newValue[1] != 'str') {
            rhs += newValue[0];
            used_vars[i].value = newValue[0];
        }
        else {
            rhs += newValue[0][0];
            used_vars[i].value = newValue[0][1];
        }
        if(i < used_vars.length-1) rhs += ', ';

        if(used_vars[i].type != newValue[1]) {
            if(newValue[1] == 'bool') fixToBool(used_vars[i]);
            else if(newValue[1] == 'float') fixToFloat(used_vars[i]);
            else if(newValue[1] == 'int') fixToInt(used_vars[i]);
            else if(newValue[1] == 'str') fixToStr(used_vars[i]);
            else if(newValue[1] == 'list') fixToList(used_vars[i]);
        }
    }

    returnStr += ' = ' + rhs;

    return returnStr;
}

function write_print_stmt() {
    var returnStr = '';

    returnStr += 'print(';

    var choice = getRandomInt(0,1);
    //Use string variable
    if(choice == 0 && variables[if_level].get('strings').length > 0) {
        var randomStr = variables[if_level].get('strings')[getRandomInt(0,variables[if_level].get('strings').length-1)];
        returnStr += randomStr.name;
        randomStr = randomStr.value;
    }
    //Use string literal
    else {
        var randomStr = strings[getRandomInt(0,strings.length-1)];
        returnStr += '\'' + randomStr + '\'';
    }

    if(randomStr != "''") choice = getRandomInt(0,5);
    else choice = getRandomInt(0,2);

    //if(choice == 0) print(str);
    if(choice == 1) { //print(str[0])
        returnStr += '[' + getRandomInt(0,randomStr.length-2) + ']';
    }
    else if(choice == 2) { //print(str * 2)
        returnStr += ' * ' + getRandomInt(0,5);
    }
    else if(choice == 3) { //print(str + str);
        do {
            returnStr += ' + ';
            choice = getRandomInt(0,1);
            if(choice == 0 && variables[if_level].get('strings').length > 0) {
                var randomStr = variables[if_level].get('strings')[getRandomInt(0,variables[if_level].get('strings').length-1)];
                returnStr += randomStr.name;
                randomStr = randomStr.value;
            }
            //Use string literal
            else {
                var randomStr = strings[getRandomInt(0,strings.length-2)];
                returnStr += '\'' + randomStr + '\'';
            }

            if(randomStr != "''") choice = getRandomInt(0,4);
            else choice = getRandomInt(0,1);
            //if(choice == 0) str
            if(choice == 1) { //str * 2
                returnStr += ' * ' + getRandomInt(0,5);
            }
            else if(choice == 2) { //str[0]
                returnStr += '[' + getRandomInt(0,randomStr.length-1) + ']';
            }
            else if(choice == 3) { //str[2:5]
                var int1 = getRandomInt(0,randomStr.length-1);
                var int2 = getRandomInt(int1,randomStr.length);
                returnStr += '[' + int1 + ':' + int2 + ']';
            }
            else if(choice == 4) { //str[2:]
                returnStr += '[' + getRandomInt(0,randomStr.toString.length-1) + ':]';
            }
        } while(getRandomInt(0,1));
    }
    else if(choice == 4) { //print(str[2:5])
        var int1 = getRandomInt(0,randomStr.length-2);
        var int2 = getRandomInt(int1,randomStr.length-1);
        returnStr += '[' + int1 + ':' + int2 + ']';
    }
    else if(choice == 5) { //print(str[2:])
        returnStr += '[' + getRandomInt(0,randomStr.length-2) + ':]';
    }

    returnStr += ')';

    return returnStr;
}

function write_str_assign() {
    var returnStr = '';
    var option = getRandomInt(0,1);
    var newStr = getRandomStr();
    var newValue = newStr[1];
    newStr = newStr[0];
    
    // Reuse variable
    if(option == 0 && getVariablesLength() != 0) {
        var randomVar = getRandomVariable();
        returnStr += randomVar.name;
        randomVar.value = newValue;

        if(randomVar.type != 'str') fixToStr(randomVar);
    }
    // New variable
    else {
        var newstr = addVariable('str', newValue);
        returnStr += newstr.name;
    }

    returnStr += ' = ' + newValue;

    return returnStr;
}

// var1 = var2 = var3 = 'string'
function write_str_mult_assign() {
    var returnStr = '';
    var newStr = getRandomStr();
    var newValue = newStr[1];
    newStr = newStr[0];

    var used_variables = [];
    var option;

    do {
        option = getRandomInt(0,1);
        //Reuse variable
        if(option == 0 && getVariablesLength() != 0 && getVariablesLength() != used_variables.length) {
            do {
                var randomVar = getRandomVariable();
            } while(contains(used_variables,randomVar));
            randomVar.value = newValue;
            if(randomVar.type != 'str') fixToStr(randomVar);
            used_variables.push(randomVar);

            returnStr += randomVar.name + ' = ';
        }
        //New variable
        else {
            var newVar = addVariable('str', newValue);
            used_variables.push(newVar);

            returnStr += newVar.name + ' = ';
        }
    } while(getRandomInt(0,1));

    returnStr += newStr;

    return returnStr;
}
