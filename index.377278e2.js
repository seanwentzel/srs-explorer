const possibleEvents = new Set([
    "input",
    "onpropertychange"
]);
const inputs = [
    "start_string",
    "in_string",
    "out_string"
];
let start = "";
let in_string = "";
let out_string = "";
window.onload = ()=>{
    inputs.forEach((input)=>{
        possibleEvents.forEach((eventName)=>{
            const inputElement = document.getElementById(input);
            inputElement.addEventListener(eventName, (ev)=>{
                handleInput();
            });
        });
        handleInput();
    });
};
function read(id) {
    return document.getElementById(id).value;
}
function handleInput() {
    const new_start = read("start_string");
    const new_in_string = read("in_string");
    const new_out_string = read("out_string");
    if (new_in_string !== "" && (new_start !== start || new_in_string !== in_string || new_out_string !== out_string)) {
        start = new_start;
        in_string = new_in_string;
        out_string = new_out_string;
        const results = generateResults(start, in_string, out_string);
        const lis = results.map((result)=>`<li>${result.depth}: ${result.s} </li>`);
        const ul = `<ul>${lis.join("")}</ul>`;
        const output = document.getElementById("output");
        output.innerHTML = ul;
    }
}
function* children(result, in_string, out_string) {
    console.log("start children");
    let at = result.s.indexOf(in_string);
    while(at !== -1){
        const replaced = result.s.substring(0, at) + out_string + result.s.substring(at + in_string.length);
        yield {
            s: replaced,
            parent: result,
            depth: result.depth + 1
        };
        console.log(at);
        at = result.s.indexOf(in_string, at + 1);
    }
}
function generateResults(start, in_string, out_string) {
    const firstResult = {
        s: start,
        parent: null,
        depth: 0
    };
    let results = [
        firstResult
    ];
    let at = 0;
    while(at < results.length && at < 100){
        for (let res of children(results[at], in_string, out_string)){
            console.log(res);
            results.push(res);
        }
        at += 1;
    }
    return results;
}

//# sourceMappingURL=index.377278e2.js.map
