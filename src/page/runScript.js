window.addEventListener("message", async function (event) {
    if (event.source == window && event.data && event.data.direction == "from-content-runscript") {
        let doc = window.document;
        let scriptTag = doc.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.text = event.data.script;
        var AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        try {
            await new AsyncFunction(scriptTag.text)();
        } catch (e) {
            console.log(e);
            window.postMessage({
                direction: "from-page-runscript",
                result: e.toString()
            }, "*");
            return;
        }
        window.postMessage({
            direction: "from-page-runscript",
            result: "No error!!!!"
        }, "*");
    }
});
