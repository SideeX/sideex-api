// Modified in tools.js from selenium-IDE
export default class TargetSelecter {
    window: Window
    div: HTMLDivElement
    element: Element = null
    rect: ClientRect | DOMRect = null
    callback: (element: Element, window: Window) => void
    cleanupCallback: () => void
    constructor(callback?: (element: Element, window: Window) => void, cleanupCallback?: () => void) {
        this.callback = callback
        this.cleanupCallback = cleanupCallback
        // This is for XPCOM/XUL addon and can't be used
        //var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
        //this.win = wm.getMostRecentWindow('navigator:browser').getBrowser().contentWindow;
        // Instead, we simply assign global content window to this.win
        this.window = window
        const doc = this.window.document
        this.div = doc.createElement("div")
        this.div.style.display = "none"
        doc.body.insertBefore(this.div, doc.body.firstChild)
        doc.addEventListener("mousemove", this, true)
        doc.addEventListener("click", this, true)
    }
    public cleanup() {
        try {
            if (this.div) {
                if (this.div.parentNode) {
                    this.div.parentNode.removeChild(this.div)
                }
                this.div = null
            }
            if (this.window) {
                const doc = this.window.document
                doc.removeEventListener("mousemove", this, true)
                doc.removeEventListener("click", this, true)
            }
        } catch (e) {
            if (!(e instanceof TypeError)) {
                throw e
            }
        }
        this.window = null
        if (this.cleanupCallback) {
            this.cleanupCallback()
        }
    }
    handleEvent(event: MouseEvent) {
        switch (event.type) {
            case "mousemove":
                this.highlight((event.target as Element).ownerDocument, event.clientX, event.clientY)
                break
            case "click":
                if (event.button == 0 && this.element && this.callback) {
                    this.callback(this.element, this.window)
                } //Right click would cancel the select
                event.preventDefault()
                event.stopPropagation()
                this.cleanup()
                break
        }
    }
    highlight(doc: Document, x: number, y: number) {
        if (doc) {
            const elenemt = doc.elementFromPoint(x, y)
            if (elenemt && elenemt != this.element) {
                this.highlightElement(elenemt)
            }
        }
    }
    highlightElement(element: Element) {
        if (element && element != this.element) {
            this.element = element
        } else {
            return
        }
        const rect = element.getBoundingClientRect()
        const oldrect = this.rect
        if (rect.left >= 0 && rect.top >= 0 && rect.width > 0 && rect.height > 0) {
            if (oldrect && rect.top == oldrect.top && rect.left == oldrect.left && rect.width == oldrect.width && rect.height == oldrect.height) {
                return
            }
            this.rect = rect
            this.div.style.display = "block"
            this.div.style.position = "fixed"
            this.div.style.pointerEvents = "none"
            this.div.style.boxShadow = "0 0 0 1px black"
            this.div.style.outline = "1px dashed white"
            this.div.style.outlineOffset = "-1px"
            this.div.style.backgroundColor = "rgba(250,250,128,0.4)"
            this.div.style.zIndex = "100"

            this.div.style.left = String(rect.left + this.window.scrollX) + "px"
            this.div.style.top = String(rect.top + this.window.scrollY) + "px"
            this.div.style.width = String(rect.width) + "px"
            this.div.style.height = String(rect.height) + "px"
            console.log(this.div.style);
        } else if (oldrect) {
            this.div.style.display = "none"
        }
    }
}
