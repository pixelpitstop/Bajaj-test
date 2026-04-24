export default function NodeInput({ apiRoot, nodeText, onApiRootChange, onNodeTextChange, onSubmit, busy }) {
  return (
    <form className="entry-form" onSubmit={onSubmit}>
      <label className="field">
        API base URL
        <input
          value={apiRoot}
          onChange={(event) => onApiRootChange(event.target.value)}
          placeholder="http://localhost:4000"
          spellCheck="false"
        />
      </label>

      <label className="field">
        Node list
        <textarea
          value={nodeText}
          onChange={(event) => onNodeTextChange(event.target.value)}
          placeholder={"A->B\nA->C\nB->D"}
          rows="8"
          spellCheck="false"
        />
      </label>

      <button type="submit" disabled={busy}>
        {busy ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
