import { useMemo, useState } from 'react';
import NodeInput from './components/NodeInput';
import ResponseTree from './components/ResponseTree';
import { getDefaultApiRoot, sendNodeList } from './api/bfhlApi';

function splitNodeList(text) {
  return text
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function App() {
  const [apiRoot, setApiRoot] = useState(getDefaultApiRoot());
  const [nodeText, setNodeText] = useState('A->B\nA->C\nB->D');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState('');

  const nodeCount = useMemo(() => splitNodeList(nodeText).length, [nodeText]);

  async function handleSubmit(event) {
    event.preventDefault();
    const nodeList = splitNodeList(nodeText);

    if (!nodeList.length) {
      setErrorText('Enter at least one node string.');
      return;
    }

    setBusy(true);
    setErrorText('');

    try {
      const payload = await sendNodeList(apiRoot, nodeList);
      setResult(payload);
    } catch (error) {
      setResult(null);
      setErrorText(error.message || 'The request failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="app-shell">
        <header className="hero">
          <h1>Bajaj Test frontend</h1>
          <p>Jayasuryaa- RA2311032020026-CSE IOT-  SRM Ramapuram Campus
          </p>
        </header>

        <NodeInput
          apiRoot={apiRoot}
          nodeText={nodeText}
          onApiRootChange={setApiRoot}
          onNodeTextChange={setNodeText}
          onSubmit={handleSubmit}
          busy={busy}
        />

        {errorText ? <p className="error-banner">{errorText}</p> : null}

        <ResponseTree result={result} />
      </section>
    </main>
  );
}
