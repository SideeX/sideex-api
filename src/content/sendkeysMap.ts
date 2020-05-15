/*
 * Copyright SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"),
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
export default {
    ControlKeysMap: {
        '${KEY_BACKSPACE}': { keyCode: 8, which: 8, charCode: 0, code: "Backspace", key: "Backspace" },
        '${KEY_TAB}': { keyCode: 9, which: 9, charCode: 0, code: "Tab", key: "Tab" },
        '${KEY_ENTER}': { keyCode: 13, which: 13, charCode: 13, code: "Enter", key: "Enter", press: true },
        '${KEY_ENTER_NOPRESS}': { keyCode: 13, which: 13, charCode: 13, code: "Enter", key: "Enter", press: false },
        '${KEY_SHIFTLEFT}': { keyCode: 16, which: 16, charCode: 0, code: "ShiftLeft", key: "Shift" },
        '${KEY_SHIFTRIGHT}': { keyCode: 16, which: 16, charCode: 0, code: "ShiftRight", key: "Shift" },
        '${KEY_CONTROLLEFT}': { keyCode: 17, which: 17, charCode: 0, code: "ControlLeft", key: "Control" },
        '${KEY_CONTROLRIGHT}': { keyCode: 17, which: 17, charCode: 0, code: "ControlRight", key: "Control" },
        '${KEY_ALTLEFT}': { keyCode: 18, which: 18, charCode: 0, code: "AltLeft", key: "Alt" },
        '${KEY_ALTRIGHT}': { keyCode: 18, which: 18, charCode: 0, code: "AltRight", key: "Alt" },
        '${KEY_CAPSLOCK}': { keyCode: 20, which: 20, charCode: 0, code: "CapsLock", key: "CapsLock" },
        '${KEY_ESC}': { keyCode: 27, which: 27, charCode: 0, code: "Escape", key: "Escape" },
        '${KEY_PAGEUP}': { keyCode: 33, which: 33, charCode: 0, code: "PageUp", key: "PageUp" },
        '${KEY_PAGEDOWN}': { keyCode: 34, which: 34, charCode: 0, code: "PageDown", key: "PageDown" },
        '${KEY_END}': { keyCode: 35, which: 35, charCode: 0, code: "End", key: "End" },
        '${KEY_HOME}': { keyCode: 36, which: 36, charCode: 0, code: "Home", key: "Home" },
        '${KEY_LEFT}': { keyCode: 37, which: 37, charCode: 0, code: "ArrowLeft", key: "ArrowLeft" },
        '${KEY_UP}': { keyCode: 38, which: 38, charCode: 0, code: "ArrowUp", key: "ArrowUp" },
        '${KEY_RIGHT}': { keyCode: 39, which: 39, charCode: 0, code: "ArrowRight", key: "ArrowRight" },
        '${KEY_DOWN}': { keyCode: 40, which: 40, charCode: 0, code: "ArrowDown", key: "ArrowDown" },
        '${KEY_INSERT}': { keyCode: 45, which: 45, charCode: 0, code: "Insert", key: "Insert" },
        '${KEY_DELETE}': { keyCode: 46, which: 46, charCode: 0, code: "Delete", key: "Delete" },
        '${KEY_NUMLOCK}': { keyCode: 144, which: 144, charCode: 0, code: "NumLock", key: "NumLock" },
    } as { [key: string]: ControlKeyMap },
    NormalKeyMap: {
        'A': { keyCode: 65, which: 65, charCode: 65, code: "KeyA", key: "A", data: "A" },
        'B': { keyCode: 66, which: 66, charCode: 66, code: "KeyB", key: "B", data: "B" },
        'C': { keyCode: 67, which: 67, charCode: 67, code: "KeyC", key: "C", data: "C" },
        'D': { keyCode: 68, which: 68, charCode: 68, code: "KeyD", key: "D", data: "D" },
        'E': { keyCode: 69, which: 69, charCode: 69, code: "KeyE", key: "E", data: "E" },
        'F': { keyCode: 70, which: 70, charCode: 70, code: "KeyF", key: "F", data: "F" },
        'G': { keyCode: 71, which: 71, charCode: 71, code: "KeyG", key: "G", data: "G" },
        'H': { keyCode: 72, which: 72, charCode: 72, code: "KeyH", key: "H", data: "H" },
        'I': { keyCode: 73, which: 73, charCode: 73, code: "KeyI", key: "I", data: "I" },
        'J': { keyCode: 74, which: 74, charCode: 74, code: "KeyJ", key: "J", data: "J" },
        'K': { keyCode: 75, which: 75, charCode: 75, code: "KeyK", key: "K", data: "K" },
        'L': { keyCode: 76, which: 76, charCode: 76, code: "KeyL", key: "L", data: "L" },
        'M': { keyCode: 77, which: 77, charCode: 77, code: "KeyM", key: "M", data: "M" },
        'N': { keyCode: 78, which: 78, charCode: 78, code: "KeyN", key: "N", data: "N" },
        'O': { keyCode: 79, which: 79, charCode: 79, code: "KeyO", key: "O", data: "O" },
        'P': { keyCode: 80, which: 80, charCode: 80, code: "KeyP", key: "P", data: "P" },
        'Q': { keyCode: 81, which: 81, charCode: 81, code: "KeyQ", key: "Q", data: "Q" },
        'R': { keyCode: 82, which: 82, charCode: 82, code: "KeyR", key: "R", data: "R" },
        'S': { keyCode: 83, which: 83, charCode: 83, code: "KeyS", key: "S", data: "S" },
        'T': { keyCode: 84, which: 84, charCode: 84, code: "KeyT", key: "T", data: "T" },
        'U': { keyCode: 85, which: 85, charCode: 85, code: "KeyU", key: "U", data: "U" },
        'V': { keyCode: 86, which: 86, charCode: 86, code: "KeyV", key: "V", data: "V" },
        'W': { keyCode: 87, which: 87, charCode: 87, code: "KeyW", key: "W", data: "W" },
        'X': { keyCode: 88, which: 88, charCode: 88, code: "KeyX", key: "X", data: "X" },
        'Y': { keyCode: 89, which: 89, charCode: 89, code: "KeyY", key: "Y", data: "Y" },
        'Z': { keyCode: 90, which: 90, charCode: 90, code: "KeyZ", key: "Z", data: "Z" },
        'a': { keyCode: 65, which: 65, charCode: 97, code: "KeyA", key: "a", data: "a" },
        'b': { keyCode: 66, which: 66, charCode: 98, code: "KeyB", key: "b", data: "b" },
        'c': { keyCode: 67, which: 67, charCode: 99, code: "KeyC", key: "c", data: "c" },
        'd': { keyCode: 68, which: 68, charCode: 100, code: "KeyD", key: "d", data: "d" },
        'e': { keyCode: 69, which: 69, charCode: 101, code: "KeyE", key: "e", data: "e" },
        'f': { keyCode: 70, which: 70, charCode: 102, code: "KeyF", key: "f", data: "f" },
        'g': { keyCode: 71, which: 71, charCode: 103, code: "KeyG", key: "g", data: "g" },
        'h': { keyCode: 72, which: 72, charCode: 104, code: "KeyH", key: "h", data: "h" },
        'i': { keyCode: 73, which: 73, charCode: 105, code: "KeyI", key: "i", data: "i" },
        'j': { keyCode: 74, which: 74, charCode: 106, code: "KeyJ", key: "j", data: "j" },
        'k': { keyCode: 75, which: 75, charCode: 107, code: "KeyK", key: "k", data: "k" },
        'l': { keyCode: 76, which: 76, charCode: 108, code: "KeyL", key: "l", data: "l" },
        'm': { keyCode: 77, which: 77, charCode: 109, code: "KeyM", key: "m", data: "m" },
        'n': { keyCode: 78, which: 78, charCode: 110, code: "KeyN", key: "n", data: "n" },
        'o': { keyCode: 79, which: 79, charCode: 111, code: "KeyO", key: "o", data: "o" },
        'p': { keyCode: 80, which: 80, charCode: 112, code: "KeyP", key: "p", data: "p" },
        'q': { keyCode: 81, which: 81, charCode: 113, code: "KeyQ", key: "q", data: "q" },
        'r': { keyCode: 82, which: 82, charCode: 114, code: "KeyR", key: "r", data: "r" },
        's': { keyCode: 83, which: 83, charCode: 115, code: "KeyS", key: "s", data: "s" },
        't': { keyCode: 84, which: 84, charCode: 116, code: "KeyT", key: "t", data: "t" },
        'u': { keyCode: 85, which: 85, charCode: 117, code: "KeyU", key: "u", data: "u" },
        'v': { keyCode: 86, which: 86, charCode: 118, code: "KeyV", key: "v", data: "v" },
        'w': { keyCode: 87, which: 87, charCode: 119, code: "KeyW", key: "w", data: "w" },
        'x': { keyCode: 88, which: 88, charCode: 120, code: "KeyX", key: "x", data: "x" },
        'y': { keyCode: 89, which: 89, charCode: 121, code: "KeyY", key: "y", data: "y" },
        'z': { keyCode: 90, which: 90, charCode: 122, code: "KeyZ", key: "z", data: "z" },
        '0': { keyCode: 48, which: 48, charCode: 48, code: "Digit0", key: "0", data: "0" },
        ')': { keyCode: 48, which: 48, charCode: 41, code: "Digit0", key: ")", data: ")" },
        '1': { keyCode: 49, which: 49, charCode: 49, code: "Digit1", key: "1", data: "1" },
        '!': { keyCode: 49, which: 49, charCode: 33, code: "Digit1", key: "!", data: "!" },
        '2': { keyCode: 50, which: 50, charCode: 50, code: "Digit2", key: "2", data: "2" },
        '@': { keyCode: 50, which: 50, charCode: 64, code: "Digit2", key: "@", data: "@" },
        '3': { keyCode: 51, which: 51, charCode: 51, code: "Digit3", key: "3", data: "3" },
        '#': { keyCode: 51, which: 51, charCode: 35, code: "Digit3", key: "#", data: "#" },
        '4': { keyCode: 52, which: 52, charCode: 52, code: "Digit4", key: "4", data: "4" },
        '$': { keyCode: 52, which: 52, charCode: 36, code: "Digit4", key: "$", data: "$" },
        '5': { keyCode: 53, which: 53, charCode: 53, code: "Digit5", key: "5", data: "5" },
        '%': { keyCode: 53, which: 53, charCode: 37, code: "Digit5", key: "%", data: "%" },
        '6': { keyCode: 54, which: 54, charCode: 54, code: "Digit6", key: "6", data: "6" },
        '^': { keyCode: 54, which: 54, charCode: 94, code: "Digit6", key: "^", data: "^" },
        '7': { keyCode: 55, which: 55, charCode: 55, code: "Digit7", key: "7", data: "7" },
        '&': { keyCode: 55, which: 55, charCode: 38, code: "Digit7", key: "&", data: "&" },
        '8': { keyCode: 56, which: 56, charCode: 56, code: "Digit8", key: "8", data: "8" },
        '*': { keyCode: 56, which: 56, charCode: 42, code: "Digit8", key: "*", data: "*" },
        '9': { keyCode: 57, which: 57, charCode: 57, code: "Digit9", key: "9", data: "9" },
        '(': { keyCode: 57, which: 57, charCode: 40, code: "Digit9", key: '(', data: '(' },
        ',': { keyCode: 186, which: 186, charCode: 59, code: "Semicolon", key: ",", data: "," },
        ':': { keyCode: 186, which: 186, charCode: 58, code: "Semicolon", key: ":", data: ":" },
        '=': { keyCode: 187, which: 187, charCode: 61, code: "Equal", key: "=", data: "=" },
        '+': { keyCode: 187, which: 187, charCode: 43, code: "Equal", key: "+", data: "+" },
        ';': { keyCode: 188, which: 188, charCode: 44, code: "Comma", key: ";", data: ";" },
        '<': { keyCode: 188, which: 188, charCode: 60, code: "Comma", key: "<", data: "<" },
        '-': { keyCode: 189, which: 189, charCode: 45, code: "Minus", key: "-", data: "-" },
        '_': { keyCode: 189, which: 189, charCode: 95, code: "Minus", key: "_", data: "_" },
        '.': { keyCode: 190, which: 190, charCode: 46, code: "Period", key: ".", data: "." },
        '>': { keyCode: 190, which: 190, charCode: 62, code: "Period", key: ">", data: ">" },
        '/': { keyCode: 191, which: 191, charCode: 47, code: "Slash", key: "/", data: "/" },
        '?': { keyCode: 191, which: 191, charCode: 63, code: "Slash", key: "?", data: "?" },
        '`': { keyCode: 192, which: 192, charCode: 96, code: "Backquote", key: "`", data: "`" },
        '~': { keyCode: 192, which: 192, charCode: 126, code: "Backquote", key: "~", data: "~" },
        '[': { keyCode: 219, which: 219, charCode: 91, code: "BracketLeft", key: "[", data: "[" },
        '{': { keyCode: 219, which: 219, charCode: 123, code: "BracketLeft", key: "{", data: "{" },
        '\\': { keyCode: 220, which: 220, charCode: 92, code: "Backslash", key: "\\", data: "\\" },
        '|': { keyCode: 220, which: 220, charCode: 124, code: "Backslash", key: "|", data: "|" },
        ']': { keyCode: 221, which: 221, charCode: 93, code: "BracketRight", key: "]", data: "]" },
        '}': { keyCode: 221, which: 221, charCode: 125, code: "BracketRight", key: "}", data: "}" },
        "'": { keyCode: 222, which: 222, charCode: 39, code: "Quote", key: "'", data: "'" },
        '"': { keyCode: 222, which: 222, charCode: 34, code: "Quote", key: '"', data: '"' },
        ' ': { keyCode: 32, which: 32, charCode: 32, code: "Space", key: "Process", data: " " }
    } as { [key: string]: DataKeyMap },
    NumpadKeyMap: {
        '0': { keyCode: 96, which: 96, charCode: 48, code: "Numpad0", key: "0", data: "0" },
        '1': { keyCode: 97, which: 97, charCode: 49, code: "Numpad1", key: "1", data: "1" },
        '2': { keyCode: 98, which: 98, charCode: 50, code: "Numpad2", key: "2", data: "2" },
        '3': { keyCode: 99, which: 99, charCode: 51, code: "Numpad3", key: "3", data: "3" },
        '4': { keyCode: 100, which: 100, charCode: 52, code: "Numpad4", key: "4", data: "4" },
        '5': { keyCode: 101, which: 101, charCode: 53, code: "Numpad5", key: "5", data: "5" },
        '6': { keyCode: 102, which: 102, charCode: 54, code: "Numpad6", key: "6", data: "6" },
        '7': { keyCode: 103, which: 103, charCode: 55, code: "Numpad7", key: "7", data: "7" },
        '8': { keyCode: 104, which: 104, charCode: 56, code: "Numpad8", key: "8", data: "8" },
        '9': { keyCode: 105, which: 105, charCode: 57, code: "Numpad9", key: "9", data: "9" },
        '*': { keyCode: 106, which: 106, charCode: 42, code: "NumpadMultiply", key: "*", data: "*" },
        '+': { keyCode: 107, which: 107, charCode: 43, code: "NumpadAdd", key: "+", data: "+" },
        '-': { keyCode: 109, which: 109, charCode: 45, code: "NumpadSubtract", key: "-", data: "-" },
        '.': { keyCode: 110, which: 110, charCode: 46, code: "NumpadDecimal", key: ".", data: "." },
        '/': { keyCode: 111, which: 111, charCode: 47, code: "NumpadDivide", key: "/", data: "/" },
        '${KEY_NUMENTER}': { keyCode: 13, which: 13, charCode: 13, code: "NumpadEnter", key: "Enter" }
    } as { [key: string]: DataKeyMap },
    FunctionalKeyMap: {
        '${KEY_F1}': { keyCode: 112, which: 112, charCode: 0, code: "F1", key: "F1" },
        '${KEY_F2}': { keyCode: 113, which: 113, charCode: 0, code: "F2", key: "F2" },
        '${KEY_F3}': { keyCode: 114, which: 114, charCode: 0, code: "F3", key: "F3" },
        '${KEY_F4}': { keyCode: 115, which: 115, charCode: 0, code: "F4", key: "F4" },
        '${KEY_F5}': { keyCode: 116, which: 116, charCode: 0, code: "F5", key: "F5" },
        '${KEY_F6}': { keyCode: 117, which: 117, charCode: 0, code: "F6", key: "F6" },
        '${KEY_F7}': { keyCode: 118, which: 118, charCode: 0, code: "F7", key: "F7" },
        '${KEY_F8}': { keyCode: 119, which: 119, charCode: 0, code: "F8", key: "F8" },
        '${KEY_F9}': { keyCode: 120, which: 120, charCode: 0, code: "F9", key: "F9" },
        '${KEY_F10}': { keyCode: 121, which: 121, charCode: 0, code: "F10", key: "F10" },
        '${KEY_F11}': { keyCode: 122, which: 122, charCode: 0, code: "F11", key: "F11" },
        '${KEY_F12}': { keyCode: 123, which: 123, charCode: 0, code: "F12", key: "F12" }
    } as { [key: string]: KeyMap }
}
interface KeyMap {
    keyCode: number
    which: number
    charCode: number
    code: string
    key: string
}
interface ControlKeyMap extends KeyMap {
    press?: boolean
}
interface DataKeyMap extends KeyMap {
    data?: string
}
