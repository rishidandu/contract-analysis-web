import React, { useEffect, useState } from 'react';
import './App.css';

// Helper to render marks (bold, italic, underline)
function renderMarks(node, children, parentMarks = {}) {
  const marks = { ...parentMarks };
  if (node.bold) marks.bold = true;
  if (node.italic) marks.italic = true;
  if (node.underline) marks.underline = true;

  let el = children;
  if (marks.bold) el = <strong>{el}</strong>;
  if (marks.italic) el = <em>{el}</em>;
  if (marks.underline) el = <u>{el}</u>;
  return el;
}

// Mention component
function Mention({ mention }: { mention: any }) {
  return (
    <span
      style={{
        backgroundColor: mention.color,
        borderRadius: 4,
        padding: '0 4px',
        color: '#222',
        fontWeight: 500,
        margin: '0 2px',
        display: 'inline-block'
      }}
      title={mention.title}
    >
      {mention.children.map((child: any, i: number) => renderMarks(child, child.text))}
    </span>
  );
}

// Recursive renderer
function renderNode(node, key, clauseCounter, parentMarks = {}) {
  if (!node) return null;

  // Merge parent marks with current node's marks
  const marks = { ...parentMarks };
  if (node.bold) marks.bold = true;
  if (node.italic) marks.italic = true;
  if (node.underline) marks.underline = true;

  if (node.text) return <React.Fragment key={key}>{renderMarks(node, node.text, parentMarks)}</React.Fragment>;
  if (node.type === 'mention') {
    // Pass marks to mention children
    return (
      <span
        key={key}
        style={{
          backgroundColor: node.color,
          borderRadius: 4,
          padding: '0 4px',
          color: '#222',
          fontWeight: 500,
          margin: '0 2px',
          display: 'inline-block'
        }}
        title={node.title}
      >
        {node.children.map((child, i) => renderMarks(child, child.text, marks))}
      </span>
    );
  }
  // For all other nodes, pass marks down recursively
  const children = node.children
    ? node.children.map((c, i) => renderNode(c, i, clauseCounter, marks))
    : null;

  if (node.type === 'h1') return <h1 key={key} style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>{children}</h1>;
  if (node.type === 'h4') return <h4 key={key} style={{ fontWeight: 700, marginBottom: 8 }}>{children}</h4>;
  if (node.type === 'p') return <p key={key} style={{ margin: 0, marginBottom: 8 }}>{children}</p>;
  if (node.type === 'ul') return <ul key={key} style={{ marginLeft: 24 }}>{children}</ul>;
  if (node.type === 'li') return <li key={key}>{children}</li>;
  if (node.type === 'lic') return <>{children}</>;
  if (node.type === 'clause') {
    const num = clauseCounter.current++;
    return (
      <div key={key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>{num}.</span>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    );
  }
  if (node.type === 'block') return <div key={key} style={{ marginBottom: 16 }}>{children}</div>;
  if (node.children) return <span key={key}>{children}</span>;
  return null;
}

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/input.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Clause counter for global numbering
  const clauseCounter = { current: 1 };

  return (
    <div style={{
      textAlign: 'left',
      maxWidth: 800,
      margin: '2rem auto',
      background: '#fff',
      padding: '2rem',
      borderRadius: 8,
      fontFamily: 'Inter, Arial, sans-serif',
      color: '#222'
    }}>
      {data
        ? (Array.isArray(data)
            ? data.map((block, i) => renderNode(block, i, clauseCounter, {}))
            : renderNode(data, 0, clauseCounter, {})
          )
        : 'Loading...'}
    </div>
  );
}

export default App;
