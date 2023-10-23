const possibleEvents = new Set(["input", "onpropertychange"]);
const inputs = ["start_string", "in_string", "out_string"];
let start = "";
let in_string = "";
let out_string = "";

window.onload = () => {
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

function read(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

function renderResultStringHtml(result: Result) {
    if (result.loop_of === null) {
        return result.s;
    } else {
        const idx = result.s.indexOf(result.loop_of.s);
        return `${result.s.substring(0,idx)}<b>${result.loop_of.s}</b>${result.s.substring(idx+result.loop_of.s.length)}`;
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
    }
}

type Result = {
    s: string;
    parent: Result | null;
    depth: number;
    loop_of: Result | null;
}

function findLoop(at: Result, haystack: string): Result | null {
    if (haystack.indexOf(at.s) !== -1) {
        return at;
    } else if (at.parent === null) {
        return null;
    } else {
        return findLoop(at.parent, haystack);
    }
}

function* children(result: Result, in_string: string, out_string: string) {
    let at = result.s.indexOf(in_string);
    while (at !== -1) {
        const replaced = result.s.substring(0, at) + out_string + result.s.substring(at+in_string.length);
        const loop_of = findLoop(result, replaced);
        yield {
            s: replaced,
            parent: result,
            depth: result.depth + 1,
            loop_of
        };
        at = result.s.indexOf(in_string, at + 1);
      }
}

function generateResults(start: string, in_string: string, out_string: string): Result[] {
    const firstResult: Result = {
        s: start,
        parent: null,
        depth: 0,
        loop_of: null
    }
    let results = [firstResult];
    let at = 0;
    while(at < results.length && at < 500) {
        if(results[at].loop_of === null) {
            for(let res of children(results[at], in_string, out_string)) {
                results.push(res);
            }
        }
        at += 1;
    }
    return results;
}