const XMLParser = require("mpts-core/dist/parser/XMLParser").XMLParser;
const TDocumentFragment = require("mpts-core/dist/nodes/TDocumentFragment.js").TDocumentFragment;

module.exports = function loader(input) {
    let parsed = XMLParser.Parse(input)
    const script = parsed.children.find(x => x?.tagName?.toLocaleLowerCase() == 'script');
    let scriptContent = 'export default {}';
    if (script) {
        let parsed2 = new TDocumentFragment()
        parsed2.children = parsed.children.filter(x => x !== script);
        parsed = parsed2;
        scriptContent = script.children.map(x => x.text).join('\n');
    }
    parsed.children = parsed.children.filter(x => x.text && x.text.trim() == '');
    if (parsed.children.length == 1) {
        parsed = parsed.children[0];
    }

    return `
    import { ref, h } from 'vue'
    import scriptCode from 'data:application/javascript;base64,${btoa(scriptContent)}'
    export default {render:function(variables){return ${parsed.compileJSVue()}}, ...scriptCode}
`;
}
