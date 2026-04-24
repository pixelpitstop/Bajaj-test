import HierarchyCard from './HierarchyCard';

function ValuePills({ values, emptyText }) {
  if (!values.length) {
    return <p className="muted-text">{emptyText}</p>;
  }

  return (
    <div className="pill-row">
      {values.map((value) => (
        <span key={value} className="pill">
          {value}
        </span>
      ))}
    </div>
  );
}

export default function ResponseTree({ result }) {
  if (!result) {
    return null;
  }

  return (
    <section className="results-shell">
      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">User ID</span>
          <strong>{result.user_id || 'Not set'}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Email</span>
          <strong>{result.email_id || 'Not set'}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Roll number</span>
          <strong>{result.college_roll_number || 'Not set'}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Trees</span>
          <strong>{result.summary?.total_trees ?? 0}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Cycles</span>
          <strong>{result.summary?.total_cycles ?? 0}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Largest root</span>
          <strong>{result.summary?.largest_tree_root || 'None'}</strong>
        </div>
      </div>

      <div className="panel">
        <h2>Hierarchies</h2>
        <div className="result-stack">
          {result.hierarchies?.map((item) => (
            <HierarchyCard key={`${item.root}-${item.has_cycle ? 'cycle' : 'tree'}`} item={item} />
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Invalid entries</h2>
        <ValuePills values={result.invalid_entries || []} emptyText="No invalid entries." />
      </div>

      <div className="panel">
        <h2>Duplicate edges</h2>
        <ValuePills values={result.duplicate_edges || []} emptyText="No duplicate edges." />
      </div>
    </section>
  );
}
