const XMLParser = require("mpts-core/dist/parser/XMLParser").XMLParser;


module.exports = function loader(input) {
    let parsed = XMLParser.Parse(input)
    let code = parsed.compileJSVue();
    return `
    import { ref, h } from 'vue'
export default function (variables){return ${code}}
`;
}
