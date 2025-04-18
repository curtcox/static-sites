"use client";
import React, { useCallback, useState, useRef } from "react";
import ColoredNode from "./ColoredNode";
import './ResizableSidebar.css';
import ReactMarkdown from 'react-markdown';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { initialNodes, initialEdges } from "./diagramData";
const nodeTypes = { colored: ColoredNode };

export default function MCPInteractiveDiagram() {
  // State & Callbacks
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  // Track hovered node or edge
  const [hoveredItem, setHoveredItem] = useState<
    | { type: 'node'; data: any }
    | { type: 'edge'; data: any }
    | null
  >(null);

  const onNodeClick = useCallback((_event: any, node: any) => {
    if (node?.data?.url) {
      window.open(node.data.url, "_blank", "noopener noreferrer");
    }
  }, []);

  // Hover handlers for nodes
  const onNodeMouseEnter = useCallback((_event: any, node: any) => {
    setHoveredItem({ type: 'node', data: node });
  }, []);
  const onNodeMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Hover handlers for edges
  const onEdgeMouseEnter = useCallback((_event: any, edge: any) => {
    setHoveredItem({ type: 'edge', data: edge });
  }, []);
  const onEdgeMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const [markdown, setMarkdown] = useState<string>("");
  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/diagramMarkdown.md`)
      .then((res) => res.text())
      .then(setMarkdown);
  }, []);

  // Sidebar width state for resizing
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers for resizing
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    // Attach listeners
    const onMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const min = 220, max = 600;
        const rect = sidebarRef.current.getBoundingClientRect();
        // Sidebar's left edge + width = right edge
        // Sidebar's left edge = rect.left
        // Mouse X relative to viewport: e.clientX
        // Sidebar width = mouse X - left edge
        const newWidth = Math.min(max, Math.max(min, e.clientX - rect.left));
        setSidebarWidth(newWidth);
      }
    };
    const onMouseUp = () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };


  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      {/* Resizable Markdown Sidebar */}
      <div className="resizable-sidebar" style={{ width: sidebarWidth }} ref={sidebarRef}>
        <div className="resizable-content">
          {hoveredItem ? (
            hoveredItem.type === 'node' ? (
              <div>
                <h2 style={{ marginTop: 0 }}>{hoveredItem.data.data?.label || hoveredItem.data.id}</h2>
                {hoveredItem.data.data?.url && (
                  <div style={{ marginBottom: 8 }}>
                    <a href={hoveredItem.data.data.url} target="_blank" rel="noopener noreferrer">
                      {hoveredItem.data.data.url}
                    </a>
                  </div>
                )}
                {hoveredItem.data.data?.markdown && (
                  <div style={{ marginBottom: 8 }}>
                    <ReactMarkdown>{hoveredItem.data.data.markdown}</ReactMarkdown>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 style={{ marginTop: 0 }}>Edge: {hoveredItem.data.id}</h2>
                <div>From: <b>{hoveredItem.data.source}</b> → To: <b>{hoveredItem.data.target}</b></div>
                {hoveredItem.data.label && <div style={{ margin: '6px 0' }}>Label: <b>{hoveredItem.data.label}</b></div>}
                {hoveredItem.data.markdown && (
                  <div style={{ marginBottom: 8 }}>
                    <ReactMarkdown>{hoveredItem.data.markdown}</ReactMarkdown>
                  </div>
                )}
              </div>
            )
          ) : (
            <ReactMarkdown>{markdown}</ReactMarkdown>
          )}
        </div>
        <div
          className="resizer"
          onMouseDown={onMouseDown}
        />
      </div>
    {/* Diagram Area */}
    <div style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  </div>
);
}
