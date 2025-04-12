import { useState, useCallback, useEffect } from 'react';
import { dump as jsYamlDump } from 'js-yaml';
import { stringify as yamlStringify } from 'yaml';
import { Switch } from '@headlessui/react';

// Type for js-yaml options
interface JsYamlOptions {
  indent: number;
  noArrayIndent: boolean;
  skipInvalid: boolean;
  flowLevel: number;
  sortKeys: boolean;
  lineWidth: number;
  noRefs: boolean;
  noCompatMode: boolean;
  condenseFlow: boolean;
  quotingType: "'" | '"';
  forceQuotes: boolean;
}

// Type for yaml (eemeli/yaml) options
interface YamlOptions {
  indent: number;
  indentSeq: boolean;
  simpleKeys: boolean;
  lineWidth: number;
  minContentWidth: number;
  sortMapEntries: boolean;
  doubleQuotedAsJSON: boolean;
  doubleQuotedMinMultiLineLength: number;
  singleQuote: boolean | null;
  blockQuote: boolean | 'folded' | 'literal';
  collectionStyle: 'any' | 'block' | 'flow';
  defaultStringType: 'BLOCK_FOLDED' | 'BLOCK_LITERAL' | 'QUOTE_DOUBLE' | 'QUOTE_SINGLE' | 'PLAIN';
  defaultKeyType: 'BLOCK_FOLDED' | 'BLOCK_LITERAL' | 'QUOTE_DOUBLE' | 'QUOTE_SINGLE' | 'PLAIN' | null;
  directives: boolean | null;
  falseStr: string;
  flowCollectionPadding: boolean;
  nullStr: string;
  trueStr: string;
}

// Union type for all options
type LibraryOptions = JsYamlOptions | YamlOptions;

// Type for library selection
type YamlLibrary = 'js-yaml' | 'yaml';

// Default options for js-yaml
const defaultJsYamlOptions: JsYamlOptions = {
  indent: 2,
  noArrayIndent: false,
  skipInvalid: false,
  flowLevel: -1,
  sortKeys: false,
  lineWidth: 80,
  noRefs: false,
  noCompatMode: false,
  condenseFlow: false,
  quotingType: "'",
  forceQuotes: false,
};

// Default options for yaml
const defaultYamlOptions: YamlOptions = {
  indent: 2,
  indentSeq: true,
  simpleKeys: false,
  lineWidth: 80,
  minContentWidth: 20,
  sortMapEntries: false,
  doubleQuotedAsJSON: false,
  doubleQuotedMinMultiLineLength: 40,
  singleQuote: null,
  blockQuote: true,
  collectionStyle: 'any',
  defaultStringType: 'PLAIN',
  defaultKeyType: null,
  directives: null,
  falseStr: 'false',
  flowCollectionPadding: true,
  nullStr: 'null',
  trueStr: 'true'
};

const defaultJson = {
  example: {
    string: "Hello World",
    number: 42,
    array: [1, 2, 3],
    nested: {
      a: true,
      b: null
    }
  }
};

function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultJson, null, 2));
  const [yamlOutput, setYamlOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLibrary, setSelectedLibrary] = useState<YamlLibrary>('js-yaml');
  const [jsYamlOptions, setJsYamlOptions] = useState<JsYamlOptions>(defaultJsYamlOptions);
  const [yamlOptions, setYamlOptions] = useState<YamlOptions>(defaultYamlOptions);

  const convertToYaml = useCallback(() => {
    try {
      const jsonObj = JSON.parse(jsonInput);
      let yamlStr = '';
      
      if (selectedLibrary === 'js-yaml') {
        yamlStr = jsYamlDump(jsonObj, jsYamlOptions);
      } else {
        yamlStr = yamlStringify(jsonObj, yamlOptions);
      }
      
      setYamlOutput(yamlStr);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setYamlOutput('');
    }
  }, [jsonInput, selectedLibrary, jsYamlOptions, yamlOptions]);

  useEffect(() => {
    convertToYaml();
  }, [convertToYaml]);

  const handleJsYamlOptionChange = (key: keyof JsYamlOptions, value: JsYamlOptions[keyof JsYamlOptions]) => {
    setJsYamlOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleYamlOptionChange = (key: keyof YamlOptions, value: YamlOptions[keyof YamlOptions]) => {
    setYamlOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YAML Playground</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Select YAML Library:</span>
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value as YamlLibrary)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="js-yaml">js-yaml</option>
              <option value="yaml">yaml (eemeli/yaml)</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Options for {selectedLibrary}</h2>
          {selectedLibrary === 'js-yaml' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="indent" className="block text-sm font-medium text-gray-700">Indent</label>
                <input
                  id="indent"
                  type="number"
                  value={jsYamlOptions.indent}
                  onChange={(e) => handleJsYamlOptionChange('indent', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="flowLevel" className="block text-sm font-medium text-gray-700">Flow Level</label>
                <input
                  id="flowLevel"
                  type="number"
                  value={jsYamlOptions.flowLevel}
                  onChange={(e) => handleJsYamlOptionChange('flowLevel', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="lineWidth" className="block text-sm font-medium text-gray-700">Line Width</label>
                <input
                  id="lineWidth"
                  type="number"
                  value={jsYamlOptions.lineWidth}
                  onChange={(e) => handleJsYamlOptionChange('lineWidth', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="quotingType" className="block text-sm font-medium text-gray-700">Quoting Type</label>
                <select
                  id="quotingType"
                  value={jsYamlOptions.quotingType}
                  onChange={(e) => handleJsYamlOptionChange('quotingType', e.target.value as "'" | '"')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="'">Single Quote (')</option>
                  <option value='"'>Double Quote (")</option>
                </select>
              </div>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.noArrayIndent}
                    onChange={(checked) => handleJsYamlOptionChange('noArrayIndent', checked)}
                    className={`${
                      jsYamlOptions.noArrayIndent ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.noArrayIndent ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">No Array Indent</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.skipInvalid}
                    onChange={(checked) => handleJsYamlOptionChange('skipInvalid', checked)}
                    className={`${
                      jsYamlOptions.skipInvalid ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.skipInvalid ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Skip Invalid</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.sortKeys}
                    onChange={(checked) => handleJsYamlOptionChange('sortKeys', checked)}
                    className={`${
                      jsYamlOptions.sortKeys ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.sortKeys ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Sort Keys</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.noRefs}
                    onChange={(checked) => handleJsYamlOptionChange('noRefs', checked)}
                    className={`${
                      jsYamlOptions.noRefs ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.noRefs ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">No Refs</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.noCompatMode}
                    onChange={(checked) => handleJsYamlOptionChange('noCompatMode', checked)}
                    className={`${
                      jsYamlOptions.noCompatMode ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.noCompatMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">No Compat Mode</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.condenseFlow}
                    onChange={(checked) => handleJsYamlOptionChange('condenseFlow', checked)}
                    className={`${
                      jsYamlOptions.condenseFlow ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.condenseFlow ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Condense Flow</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={jsYamlOptions.forceQuotes}
                    onChange={(checked) => handleJsYamlOptionChange('forceQuotes', checked)}
                    className={`${
                      jsYamlOptions.forceQuotes ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        jsYamlOptions.forceQuotes ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Force Quotes</Switch.Label>
                </div>
              </Switch.Group>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="indent" className="block text-sm font-medium text-gray-700">Indent</label>
                <input
                  id="indent"
                  type="number"
                  value={yamlOptions.indent}
                  onChange={(e) => handleYamlOptionChange('indent', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="lineWidth" className="block text-sm font-medium text-gray-700">Line Width</label>
                <input
                  id="lineWidth"
                  type="number"
                  value={yamlOptions.lineWidth}
                  onChange={(e) => handleYamlOptionChange('lineWidth', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="minContentWidth" className="block text-sm font-medium text-gray-700">Min Content Width</label>
                <input
                  id="minContentWidth"
                  type="number"
                  value={yamlOptions.minContentWidth}
                  onChange={(e) => handleYamlOptionChange('minContentWidth', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="doubleQuotedMinMultiLineLength" className="block text-sm font-medium text-gray-700">Double Quoted Min Multi-Line Length</label>
                <input
                  id="doubleQuotedMinMultiLineLength"
                  type="number"
                  value={yamlOptions.doubleQuotedMinMultiLineLength}
                  onChange={(e) => handleYamlOptionChange('doubleQuotedMinMultiLineLength', Number.parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.indentSeq}
                    onChange={(checked) => handleYamlOptionChange('indentSeq', checked)}
                    className={`${
                      yamlOptions.indentSeq ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.indentSeq ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Indent Sequences</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.simpleKeys}
                    onChange={(checked) => handleYamlOptionChange('simpleKeys', checked)}
                    className={`${
                      yamlOptions.simpleKeys ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.simpleKeys ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Simple Keys</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.sortMapEntries}
                    onChange={(checked) => handleYamlOptionChange('sortMapEntries', checked)}
                    className={`${
                      yamlOptions.sortMapEntries ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.sortMapEntries ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Sort Map Entries</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.doubleQuotedAsJSON}
                    onChange={(checked) => handleYamlOptionChange('doubleQuotedAsJSON', checked)}
                    className={`${
                      yamlOptions.doubleQuotedAsJSON ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.doubleQuotedAsJSON ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Double Quoted as JSON</Switch.Label>
                </div>
              </Switch.Group>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.singleQuote === true}
                    onChange={(checked) => handleYamlOptionChange('singleQuote', checked ? true : null)}
                    className={`${
                      yamlOptions.singleQuote ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.singleQuote ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Use Single Quotes</Switch.Label>
                </div>
              </Switch.Group>
              
              <div>
                <label htmlFor="blockQuote" className="block text-sm font-medium text-gray-700">Block Quote</label>
                <select
                  id="blockQuote"
                  value={typeof yamlOptions.blockQuote === 'boolean'
                    ? (yamlOptions.blockQuote ? 'true' : 'false')
                    : yamlOptions.blockQuote}
                  onChange={(e) => {
                    const value = e.target.value;
                    let blockQuoteValue: boolean | 'folded' | 'literal';
                    if (value === 'true') blockQuoteValue = true;
                    else if (value === 'false') blockQuoteValue = false;
                    else blockQuoteValue = value as 'folded' | 'literal';
                    handleYamlOptionChange('blockQuote', blockQuoteValue);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                  <option value="folded">Folded</option>
                  <option value="literal">Literal</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="collectionStyle" className="block text-sm font-medium text-gray-700">Collection Style</label>
                <select
                  id="collectionStyle"
                  value={yamlOptions.collectionStyle}
                  onChange={(e) => handleYamlOptionChange('collectionStyle', e.target.value as 'any' | 'block' | 'flow')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="any">Any</option>
                  <option value="block">Block</option>
                  <option value="flow">Flow</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="defaultStringType" className="block text-sm font-medium text-gray-700">Default String Type</label>
                <select
                  id="defaultStringType"
                  value={yamlOptions.defaultStringType}
                  onChange={(e) => handleYamlOptionChange('defaultStringType', e.target.value as 'BLOCK_FOLDED' | 'BLOCK_LITERAL' | 'QUOTE_DOUBLE' | 'QUOTE_SINGLE' | 'PLAIN')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="PLAIN">Plain</option>
                  <option value="BLOCK_FOLDED">Block Folded</option>
                  <option value="BLOCK_LITERAL">Block Literal</option>
                  <option value="QUOTE_DOUBLE">Double Quote</option>
                  <option value="QUOTE_SINGLE">Single Quote</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="defaultKeyType" className="block text-sm font-medium text-gray-700">Default Key Type</label>
                <select
                  id="defaultKeyType"
                  value={yamlOptions.defaultKeyType || 'null'}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleYamlOptionChange('defaultKeyType', value === 'null' ? null : value as 'BLOCK_FOLDED' | 'BLOCK_LITERAL' | 'QUOTE_DOUBLE' | 'QUOTE_SINGLE' | 'PLAIN');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="null">Null (Use Default String Type)</option>
                  <option value="PLAIN">Plain</option>
                  <option value="BLOCK_FOLDED">Block Folded</option>
                  <option value="BLOCK_LITERAL">Block Literal</option>
                  <option value="QUOTE_DOUBLE">Double Quote</option>
                  <option value="QUOTE_SINGLE">Single Quote</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="directives" className="block text-sm font-medium text-gray-700">Directives</label>
                <select
                  id="directives"
                  value={yamlOptions.directives === null ? 'null' : yamlOptions.directives.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'null') handleYamlOptionChange('directives', null);
                    else handleYamlOptionChange('directives', value === 'true');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="null">Null (Include if Required)</option>
                  <option value="true">True (Always Include)</option>
                  <option value="false">False (Never Include)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="falseStr" className="block text-sm font-medium text-gray-700">False String</label>
                <input
                  id="falseStr"
                  type="text"
                  value={yamlOptions.falseStr}
                  onChange={(e) => handleYamlOptionChange('falseStr', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="nullStr" className="block text-sm font-medium text-gray-700">Null String</label>
                <input
                  id="nullStr"
                  type="text"
                  value={yamlOptions.nullStr}
                  onChange={(e) => handleYamlOptionChange('nullStr', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="trueStr" className="block text-sm font-medium text-gray-700">True String</label>
                <input
                  id="trueStr"
                  type="text"
                  value={yamlOptions.trueStr}
                  onChange={(e) => handleYamlOptionChange('trueStr', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={yamlOptions.flowCollectionPadding}
                    onChange={(checked) => handleYamlOptionChange('flowCollectionPadding', checked)}
                    className={`${
                      yamlOptions.flowCollectionPadding ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        yamlOptions.flowCollectionPadding ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm text-gray-900">Flow Collection Padding</Switch.Label>
                </div>
              </Switch.Group>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">JSON Input</h2>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-[600px] p-4 font-mono text-sm bg-white rounded-lg shadow resize-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter JSON here..."
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">YAML Output</h2>
            {error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <pre className="w-full h-[600px] p-4 font-mono text-sm bg-white rounded-lg shadow overflow-auto">
                {yamlOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;