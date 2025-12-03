const XMLParser = require("mpts-core/dist/parser/XMLParser").XMLParser;
const TDocumentFragment = require("mpts-core/dist/nodes/TDocumentFragment.js").TDocumentFragment;

module.exports = function loader(input) {
    let parsed = XMLParser.Parse(input)
    const script = parsed.children.find(x => x?.tagName?.toLocaleLowerCase() == 'script');
    if (script) {
        let parsed2 = new TDocumentFragment()
        parsed2.children = parsed.children.filter(x => x !== script);
        let scriptContent = script.children.map(x => x.text).join('\n');
        return `
    import { ref, h } from 'vue'
    import scriptCode from 'data:application/javascript;base64,${btoa(scriptContent)}'
export default {render:function(variables){return ${parsed2.compileJSVue()}}, ...scriptCode}
`;
    } else {
        let code = parsed.compileJSVue();
        return `
    import { ref, h } from 'vue'
export default function (variables){return ${code}}
`;
    }
}
