import { Handle, Position, NodeProps } from "reactflow";

export default function ColoredNode(props: NodeProps) {
  const { data, selected } = props;
  const style = (props as any).style || data?.style || {};
  const background = data?.color || style.background || '#3b82f6';
  const shape = data?.function;

  // SVG shape selector
  function renderShape() {
    switch (shape) {
      case 'input':
      case 'output':
        // Much larger ellipse
        return (
          <ellipse cx="160" cy="80" rx="130" ry="60" fill={background} stroke={selected ? '#6366f1' : '#d1d5db'} strokeWidth={selected ? 4 : 2} />
        );
      case 'processing':
      case 'tool':
        // Much larger rectangle
        return (
          <rect x="40" y="32" width="240" height="96" rx="28" fill={background} stroke={selected ? '#6366f1' : '#d1d5db'} strokeWidth={selected ? 4 : 2} />
        );
      case 'moderation':
        // Much larger diamond
        return (
          <polygon points="160,20 300,80 160,140 20,80" fill={background} stroke={selected ? '#6366f1' : '#d1d5db'} strokeWidth={selected ? 4 : 2} />
        );
      case 'stream':
        // Much larger hexagon
        return (
          <polygon points="160,16 288,56 288,104 160,144 32,104 32,56" fill={background} stroke={selected ? '#6366f1' : '#d1d5db'} strokeWidth={selected ? 4 : 2} />
        );
      default:
        // Default much larger rectangle
        return (
          <rect x="40" y="32" width="240" height="96" rx="28" fill={background} stroke={selected ? '#6366f1' : '#d1d5db'} strokeWidth={selected ? 4 : 2} />
        );
    }
  }

  return (
    <div style={{ position: 'relative', width: 320, height: 160 }}>
      <svg width={320} height={160} style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}>
        {renderShape()}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '320px',
          height: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          fontWeight: 500,
          fontSize: 15,
          color: style.color || '#fff',
          textAlign: 'center',
          wordBreak: 'break-word',
          lineHeight: 1.3,
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
          margin: 0,
          padding: 0
        }}
      >
        <span style={{ width: '90%', margin: 0, padding: 0, display: 'block' }}>{data.label}</span>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8' }} />
    </div>
  );
}

