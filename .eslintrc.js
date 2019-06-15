module.exports = {
    "plugins": [
        "promise",
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:promise/recommended",
        "plugin:react/recommended",
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "jsx": true,
        "experimentalObjectRestSpread": true
    },
    "env": {
        "browser": true,
        "node": true,
        "jquery": true,
        "webextensions": true,
        "es6": true,
        "jest": true
    },
    "rules": {
        "indent": [
            "error",
            4, {
                "SwitchCase": 1
            }
        ],
        "semi": [
            "error",
            "always"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "brace-style": [
            "error",
            "1tbs",
            { "allowSingleLine": true }
        ],
        "space-before-blocks": [
            "error"
        ],
        "keyword-spacing": [
            "error"
        ],
        "comma-spacing": [
            "error"
        ],
        "eol-last": [
            "error"
        ],
        "space-infix-ops": [
            "error"
        ],
        // Below overwrite "eslint:recommended".
        "no-console": [
            "warn"
        ],
        "no-constant-condition": [
            "error",
            { "checkLoops": false }
        ],
        "no-undef": [
            // Temporarily turns off.
            "off"
        ],
        "no-unused-vars": [
            "warn"
        ],
        // Below overwrite "plugin:promise/recommended".
        "promise/avoid-new": [
            "off"
        ],
    }
}
