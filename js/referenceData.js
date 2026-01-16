const referenceBookMap = new Map();

referenceBookMap.set("deterministic", { title: "The same results for the same input data", th: "Deterministic", groups: ["determinism"]});
referenceBookMap.set("non_deterministic", { title: "Different results for the same input data", th: "Non-Deterministic", groups: ["determinism"]});

referenceBookMap.set("declarative", { html: [{text:"What to do. Expressions. "},
											 {tag: "code", class: "code", text: "input -> {result}"},
											 {text: " | "},
											 {tag: "span", class: "nowrap", text: "Logic (facts and clauses). Functional. Database processing"}
											 ], th: "Declarative", groups: ["paradigm"]});

referenceBookMap.set("idempotent", {th:"Idempotent", title: "Repeated operation on an object does not change the result achieved at first execution", groups: [], notes:"Opposite is \"non-idempotent\""});
referenceBookMap.set("imperative", {th:"Imperative", html: [{text: "How to do things. Statements. Var++. | "},
															{tag: "span", class: "get-title", text: "OOP"},
															{text: ". Procedural. Parallel processing"}
															], groups: ["paradigm"]});

referenceBookMap.set("lingua_franca", {th:"Lingua franca", html: [{text: "Bridge, common, trade, auxiliary or link language, or "},
																  {tag: "span", class: "get-title", text: "LWC"}], groups: []});

referenceBookMap.set("scalability", {th:"Scalability", title: "Is the property of a system to handle a growing amount of work", groups: []});
