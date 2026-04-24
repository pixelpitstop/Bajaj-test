function TreeBranch({ label, branch }) {
  const childNames = Object.keys(branch || {});

  return (
    <li>
      <span className="tree-label">{label}</span>
      {childNames.length > 0 ? (
        <ul className="tree-list">
          {childNames.map((childName) => (
            <TreeBranch key={childName} label={childName} branch={branch[childName]} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function HierarchyCard({ item }) {
  const treeRoot = item.tree?.[item.root] || {};
  const hasCycle = Boolean(item.has_cycle);

  return (
    <article className="result-card">
      <div className="result-card__head">
        <h3>Root {item.root}</h3>
        {hasCycle ? <span className="badge badge--warn">Cycle detected</span> : <span className="badge">Depth {item.depth}</span>}
      </div>

      {hasCycle ? (
        <p className="muted-text">This group contains a cycle, so the tree is empty.</p>
      ) : (
        <ul className="tree-list tree-list--top">
          <TreeBranch label={item.root} branch={treeRoot} />
        </ul>
      )}
    </article>
  );
}
