
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import './App.css';

// Helper to render marks (bold, italic, underline)
function renderMarks(node, children) {
  let el = children;
  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  return el;
}

// Mention component
function Mention({ mention }) {
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
      {mention.children.map((child, i) => renderMarks(child, child.text))}
    </span>
  );
}

// Recursive renderer
function renderNode(node, key, clauseCounter) {
  if (!node) return null;
  if (node.text) return <React.Fragment key={key}>{renderMarks(node, node.text)}</React.Fragment>;
  if (node.type === 'mention') return <Mention key={key} mention={node} />;
  if (node.type === 'h1') return <h1 key={key} style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</h1>;
  if (node.type === 'h4') return <h4 key={key} style={{ fontWeight: 700, marginBottom: 8 }}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</h4>;
  if (node.type === 'p') return <p key={key} style={{ margin: 0, marginBottom: 8 }}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</p>;
  if (node.type === 'ul') return <ul key={key} style={{ marginLeft: 24 }}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</ul>;
  if (node.type === 'li') return <li key={key}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</li>;
  if (node.type === 'lic') return <>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</>;
  if (node.type === 'clause') {
    const num = clauseCounter.current++;
    return (
      <div key={key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>{num}.</span>
        <div style={{ flex: 1 }}>
          {node.children.map((c, i) => renderNode(c, i, clauseCounter))}
        </div>
      </div>
    );
  }
  if (node.type === 'block') return <div key={key} style={{ marginBottom: 16 }}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</div>;
  if (node.children) return <span key={key}>{node.children.map((c, i) => renderNode(c, i, clauseCounter))}</span>;
  return null;
}

function App() {
  const [data, setData] = useState(null);

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
            ? data.map((block, i) => renderNode(block, i, clauseCounter))
            : renderNode(data, 0, clauseCounter)
          )
        : 'Loading...'}
    </div>
  );
}

export default App;
