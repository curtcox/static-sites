"use client";
import React, { useCallback, useState, useRef } from "react";
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

/**
 * Interactive diagram of Anthropic's Model Context Protocol (MCP).
 * ---------------------------------------------------------------
 * ▸ Click any node to open relevant external documentation in a new tab.
 * ▸ Drag nodes to rearrange and explore relationships.
 * ▸ Use the Controls (top‑right) to zoom / fit view, and toggle minimap.
 *
 * External references used for clickable links:
 *  - Anthropic Messages API 👉 https://docs.anthropic.com/claude/reference/messages_post
 *  - Model Context Protocol spec 👉 https://docs.anthropic.com/claude/docs/model-context-protocol
 *  - Tool Use & Function Calling 👉 https://docs.anthropic.com/claude/docs/tool-use
 *  - Attachments & Images 👉 https://docs.anthropic.com/claude/docs/images
 *  - Safety & Moderation 👉 https://docs.anthropic.com/claude/docs/safety-overview
 */

export default function MCPInteractiveDiagram() {
  /* ----------------- Nodes ----------------- */
  const initialNodes = [
    {
      id: "client",
      position: { x: -500, y: 0 },
      data: {
        label: "🖥️ Client App",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "attachments",
      position: { x: -500, y: 150 },
      data: {
        label: "📎 Attachments & Images",
        url: "https://docs.anthropic.com/claude/docs/images",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "sdk_packager",
      position: { x: -200, y: 0 },
      data: {
        label: "📦 SDK MCP Packager",
        url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "api_gateway",
      position: { x: 100, y: 0 },
      data: {
        label: "🌐 Anthropic API Gateway",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "moderation",
      position: { x: 350, y: -100 },
      data: {
        label: "🛡️ Moderation & Safety",
        url: "https://docs.anthropic.com/claude/docs/safety-overview",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "model",
      position: { x: 350, y: 100 },
      data: {
        label: "🧠 Claude Model Inference",
        url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "tools",
      position: { x: 600, y: 100 },
      data: {
        label: "🔧 Tool Handler",
        url: "https://docs.anthropic.com/claude/docs/tool-use",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "streaming",
      position: { x: 850, y: 0 },
      data: {
        label: "📡 Streaming Response",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
      },
      style: { padding: 12, borderRadius: 16 },
    },
    {
      id: "client_ui",
      position: { x: 1100, y: 0 },
      data: {
        label: "🖥️ Client UI Updated",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
      },
      style: { padding: 12, borderRadius: 16 },
    },
  ];

  /* ----------------- Edges ----------------- */
  const initialEdges = [
    { id: "c_pkg", source: "client", target: "sdk_packager", label: "request" },
    { id: "att_pkg", source: "attachments", target: "sdk_packager", label: "embed" },
    { id: "pkg_api", source: "sdk_packager", target: "api_gateway", label: "MCP JSON" },
    { id: "api_mod", source: "api_gateway", target: "moderation", label: "safety check" },
    { id: "mod_model", source: "moderation", target: "model", label: "allowed" },
    { id: "model_tools", source: "model", target: "tools", label: "tool call" },
    { id: "tools_model", source: "tools", target: "model", label: "tool result" },
    { id: "model_api", source: "model", target: "api_gateway", label: "completion" },
    { id: "api_stream", source: "api_gateway", target: "streaming", label: "chunks" },
    { id: "stream_client", source: "streaming", target: "client_ui", label: "render" },
  ];

  /* ----------------- State & Callbacks ----------------- */
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

  const markdown = `
# Model Context Protocol (MCP) Diagram

This interactive diagram visualizes Anthropic's Model Context Protocol (MCP):

- **Click** any node to open relevant documentation.
- **Drag** nodes to rearrange and explore relationships.
- **Use controls** (top-right) to zoom, fit, and toggle minimap.

**External References:**
- [Anthropic Messages API](https://docs.anthropic.com/claude/reference/messages_post)
- [Model Context Protocol Spec](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Tool Use & Function Calling](https://docs.anthropic.com/claude/docs/tool-use)
- [Attachments & Images](https://docs.anthropic.com/claude/docs/images)
- [Safety & Moderation](https://docs.anthropic.com/claude/docs/safety-overview)
`;

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
                <pre style={{ background: '#f3f4f6', padding: 8, borderRadius: 8, fontSize: 15 }}>
                  {JSON.stringify(hoveredItem.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <h2 style={{ marginTop: 0 }}>Edge: {hoveredItem.data.id}</h2>
                <div>From: <b>{hoveredItem.data.source}</b> → To: <b>{hoveredItem.data.target}</b></div>
                {hoveredItem.data.label && <div style={{ margin: '6px 0' }}>Label: <b>{hoveredItem.data.label}</b></div>}
                <pre style={{ background: '#f3f4f6', padding: 8, borderRadius: 8, fontSize: 15 }}>
                  {JSON.stringify(hoveredItem.data, null, 2)}
                </pre>
              </div>
            )
          ) : (
            <ReactMarkdown>{markdown}</ReactMarkdown>
          )}
        </div>
        <div
          className="resizer"
          onMouseDown={onMouseDown}
          style={{ height: '100%' }}
        />
      </div>
      {/* Diagram Area */}
      <div style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
