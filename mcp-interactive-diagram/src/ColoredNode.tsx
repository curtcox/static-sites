import { Handle, Position, NodeProps } from "reactflow";

export default function ColoredNode(props: NodeProps) {
  const { data, selected } = props;
  // React Flow puts style on props.data.style if passed as 'style' in node
  const style = (props as any).style || data?.style || {};
  const background = data?.color || style.background || '#3b82f6';
  return (
    <div
      style={{
        ...style,
        background,
        color: style.color || '#fff',
        border: selected ? '3px solid #6366f1' : '2px solid #d1d5db',
        boxShadow: selected ? '0 0 0 2px #6366f155' : undefined,
        minWidth: 160,
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 18,
        cursor: 'pointer',
        transition: 'border 0.2s, box-shadow 0.2s',
        padding: 12,
        borderRadius: 16,
      }}
    >
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8' }} />
    </div>
  );
}
