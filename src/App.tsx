import React, { useState, useCallback, useEffect } from 'react';
import { dump } from 'js-yaml';
import { RefreshCcw } from 'lucide-react';
import { Switch } from '@headlessui/react';

interface YamlOptions {
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

const defaultOptions: YamlOptions = {
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
  const [options, setOptions] = useState<YamlOptions>(defaultOptions);

  const convertToYaml = useCallback(() => {
    try {
      const jsonObj = JSON.parse(jsonInput);
      const yamlStr = dump(jsonObj, options);
      setYamlOutput(yamlStr);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setYamlOutput('');
    }
  }, [jsonInput, options]);

  useEffect(() => {
    convertToYaml();
  }, [convertToYaml]);

  const resetToDefault = () => {
    setJsonInput(JSON.stringify(defaultJson, null, 2));
    setOptions(defaultOptions);
    setError(null);
  };

  const handleOptionChange = (key: keyof YamlOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">js-yaml Playground</h1>
          <div className="flex gap-4">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <RefreshCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Indent</label>
              <input
                type="number"
                value={options.indent}
                onChange={(e) => handleOptionChange('indent', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Flow Level</label>
              <input
                type="number"
                value={options.flowLevel}
                onChange={(e) => handleOptionChange('flowLevel', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Line Width</label>
              <input
                type="number"
                value={options.lineWidth}
                onChange={(e) => handleOptionChange('lineWidth', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quoting Type</label>
              <select
                value={options.quotingType}
                onChange={(e) => handleOptionChange('quotingType', e.target.value as "'" | '"')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="'">Single Quote (')</option>
                <option value='"'>Double Quote (")</option>
              </select>
            </div>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.noArrayIndent}
                  onChange={(checked) => handleOptionChange('noArrayIndent', checked)}
                  className={`${
                    options.noArrayIndent ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.noArrayIndent ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">No Array Indent</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.skipInvalid}
                  onChange={(checked) => handleOptionChange('skipInvalid', checked)}
                  className={`${
                    options.skipInvalid ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.skipInvalid ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">Skip Invalid</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.sortKeys}
                  onChange={(checked) => handleOptionChange('sortKeys', checked)}
                  className={`${
                    options.sortKeys ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.sortKeys ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">Sort Keys</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.noRefs}
                  onChange={(checked) => handleOptionChange('noRefs', checked)}
                  className={`${
                    options.noRefs ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.noRefs ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">No Refs</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.noCompatMode}
                  onChange={(checked) => handleOptionChange('noCompatMode', checked)}
                  className={`${
                    options.noCompatMode ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.noCompatMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">No Compat Mode</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.condenseFlow}
                  onChange={(checked) => handleOptionChange('condenseFlow', checked)}
                  className={`${
                    options.condenseFlow ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.condenseFlow ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">Condense Flow</Switch.Label>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={options.forceQuotes}
                  onChange={(checked) => handleOptionChange('forceQuotes', checked)}
                  className={`${
                    options.forceQuotes ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      options.forceQuotes ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-2 text-sm text-gray-900">Force Quotes</Switch.Label>
              </div>
            </Switch.Group>
          </div>
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