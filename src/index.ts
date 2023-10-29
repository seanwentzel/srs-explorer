const possibleEvents = new Set(["input", "onpropertychange"]);
const inputs = ["start_string", "in_string", "out_string"];
let start = "";
let in_string = "";
let out_string = "";

window.onload = () => {
    readParams();
    inputs.forEach((input: string) => {
        possibleEvents.forEach((eventName: string) => {
            const inputElement = document.getElementById(input) as HTMLInputElement;
            inputElement.addEventListener(eventName, (ev: Event) => {
                handleInput();
            })
        });
        handleInput();
    });
};

function readParams(): void {
    const params = new URL(window.location.href).searchParams;
    let noop = true;
    inputs.forEach((input: string) => {
        const inputElement = document.getElementById(input) as HTMLInputElement;
        const value = params.get(input);
        if (value) {
            inputElement.value = value;
            noop = false;
        }
    });
    handleInput();
}

function setUrl(): void {
    const url = new URL(window.location.href);
    inputs.forEach((input: string) => {
        const inputElement = document.getElementById(input) as HTMLInputElement;
        url.searchParams.set(input, inputElement.value);
    });
    history.pushState({}, "", url);
}

function read(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

function renderResultStringHtml(result: Result) {
    if (result.loop_of === null) {
        return result.s;
    } else {
        const idx = result.s.indexOf(result.loop_of);
        return `${result.s.substring(0,idx)}<b>${result.loop_of}</b>${result.s.substring(idx+result.loop_of.length)}`;
    }
}

function handleInput() {
    const new_start = read("start_string");
    const new_in_string = read("in_string");
    const new_out_string = read("out_string");
    if(new_in_string !== "" && (new_start !== start || new_in_string !== in_string || new_out_string !== out_string)) {
        start = new_start;
        in_string = new_in_string;
        out_string = new_out_string;
        const results = generateResults(start, in_string, out_string);
        const lis = results.map((result: Result) => `<li>${result.depth}: ${renderResultStringHtml(result)} </li>`);
        const ul = `<ul>${lis.join("")}</ul>`
        const output = document.getElementById("output") as HTMLElement;
        output.innerHTML = ul;
        setUrl();
    }
}

type Result = {
    s: string;
    parents: Set<string>;
    depth: number;
    loop_of: string | null;
}

function findLoop(universe: Map<string, Result>, res: Result, haystack: string): string | null {
    const bfs = [res];
    let at = 0;
    const visited = new Set();
    while(at < bfs.length) {
        res = bfs[at];
        if (haystack.indexOf(res.s) !== -1) {
            return res.s;
        }
        for(const parent of res.parents) {
            if(!visited.has(parent)) {
                bfs.push(universe.get(parent) as Result);
                visited.add(parent);
            }
        }
        at ++;
    }
    return null;
}

function* children(universe: Map<string, Result>, result: Result, in_string: string, out_string: string) {
    let at = result.s.indexOf(in_string);
    while (at !== -1) {
        const replaced = result.s.substring(0, at) + out_string + result.s.substring(at+in_string.length);
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

function generateResults(start: string, in_string: string, out_string: string): Result[] {
    const firstResult: Result = {
        s: start,
        parents: new Set(),
        depth: 0,
        loop_of: null
    }
    const universe = new Map();
    const queue = [firstResult];
    universe.set(start, firstResult);
    let at = 0;
    while(at < queue.length && at < 500) {
        if(queue[at].loop_of === null) {
            for(let res of children(universe, queue[at], in_string, out_string)) {
                if(!universe.has(res.s)) {
                    queue.push(res);
                    universe.set(res.s, res);
                } else {
                    const element = universe.get(res.s);
                    element.parents.add(queue[at].s);
                    if(element.loop_of === null) {
                        element.loop_of = res.loop_of;
                    }
                }
            }
        }
        at += 1;
    }
    return queue;
}