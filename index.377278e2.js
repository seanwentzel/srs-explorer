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
    readParams();
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
function readParams() {
    const params = new URL(window.location.href).searchParams;
    let noop = true;
    inputs.forEach((input)=>{
        const inputElement = document.getElementById(input);
        const value = params.get(input);
        if (value) {
            inputElement.value = value;
            noop = false;
        }
    });
    handleInput();
}
function setUrl() {
    const url = new URL(window.location.href);
    inputs.forEach((input)=>{
        const inputElement = document.getElementById(input);
        url.searchParams.set(input, inputElement.value);
    });
    history.pushState({}, "", url);
}
function read(id) {
    return document.getElementById(id).value;
}
function renderResultStringHtml(result) {
    if (result.loop_of === null) return result.s;
    else {
        const idx = result.s.indexOf(result.loop_of);
        return `${result.s.substring(0, idx)}<b>${result.loop_of}</b>${result.s.substring(idx + result.loop_of.length)}`;
    }
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
        const lis = results.map((result)=>`<li>${result.depth}: ${renderResultStringHtml(result)} </li>`);
        const ul = `<ul>${lis.join("")}</ul>`;
        const output = document.getElementById("output");
        output.innerHTML = ul;
        setUrl();
    }
}
function findLoop(universe, res, haystack) {
    const bfs = [
        res
    ];
    let at = 0;
    const visited = new Set();
    while(at < bfs.length){
        res = bfs[at];
        if (haystack.indexOf(res.s) !== -1) return res.s;
        for (const parent of res.parents)if (!visited.has(parent)) {
            bfs.push(universe.get(parent));
            visited.add(parent);
        }
        at++;
    }
    return null;
}
function* children(universe, result, in_string, out_string) {
    let at = result.s.indexOf(in_string);
    while(at !== -1){
        const replaced = result.s.substring(0, at) + out_string + result.s.substring(at + in_string.length);
        const loop_of = findLoop(universe, result, replaced);
        const parents = new Set();
        parents.add(result.s);
        yield {
            s: replaced,
            parents,
            depth: result.depth + 1,
            loop_of
        };
        at = result.s.indexOf(in_string, at + 1);
    }
}
function generateResults(start, in_string, out_string) {
    const firstResult = {
        s: start,
        parents: new Set(),
        depth: 0,
        loop_of: null
    };
    const universe = new Map();
    const queue = [
        firstResult
    ];
    universe.set(start, firstResult);
    let at = 0;
    while(at < queue.length && at < 500){
        if (queue[at].loop_of === null) {
            for (let res of children(universe, queue[at], in_string, out_string))if (!universe.has(res.s)) {
                queue.push(res);
                universe.set(res.s, res);
            } else {
                const element = universe.get(res.s);
                element.parents.add(queue[at].s);
                if (element.loop_of === null) element.loop_of = res.loop_of;
            }
        }
        at += 1;
    }
    return queue;
}

//# sourceMappingURL=index.377278e2.js.map
