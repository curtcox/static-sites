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

// Function type to color mapping
const functionColors: Record<string, string> = {
  input: '#3b82f6',        // blue
  processing: '#6366f1',   // indigo
  moderation: '#f59e42',   // orange
  tool: '#10b981',         // green
  stream: '#06b6d4',       // cyan
  output: '#a21caf',       // purple
  edge: '#64748b',         // slate/gray (fallback)
};

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

const nodeTypes = { colored: ColoredNode };

export default function MCPInteractiveDiagram() {
  /* ----------------- Nodes ----------------- */
  const initialNodes = [
    {
      id: "client",
      type: 'colored',
      position: { x: -500, y: 0 },
      data: {
        label: "🖥️ Client App",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
        markdown: `**Client App**\n\nThis node represents the application that sends requests to Anthropic's API.`,
        function: 'input',
        color: functionColors.input,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "attachments",
      type: 'colored',
      position: { x: -500, y: 150 },
      data: {
        label: "📎 Attachments & Images",
        url: "https://docs.anthropic.com/claude/docs/images",
        markdown: `**Attachments & Images**\n\nThis node handles file and image attachments sent with requests.`,
        function: 'input',
        color: functionColors.input,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "sdk_packager",
      type: 'colored',
      position: { x: -200, y: 0 },
      data: {
        label: "📦 SDK MCP Packager",
        url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
        markdown: `**SDK MCP Packager**\n\nPackages client data and attachments into MCP-compliant requests.`,
        function: 'processing',
        color: functionColors.processing,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "api_gateway",
      type: 'colored',
      position: { x: 100, y: 0 },
      data: {
        label: "🌐 Anthropic API Gateway",
        url: "https://docs.anthropic.com/claude/reference/messages_post",
        markdown: `**Anthropic API Gateway**\n\nReceives requests, manages authentication, and routes to moderation/model.`,
        function: 'processing',
        color: functionColors.processing,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "moderation",
      type: 'colored',
      position: { x: 350, y: -100 },
      data: {
        label: "🛡️ Moderation & Safety",
        url: "https://docs.anthropic.com/claude/docs/safety-overview",
        markdown: `**Moderation & Safety**\n\nChecks requests for safety and content policy compliance.`,
        function: 'moderation',
        color: functionColors.moderation,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "model",
      type: 'colored',
      position: { x: 350, y: 100 },
      data: {
        label: "🧠 Claude Model Inference",
        url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
        markdown: `**Claude Model Inference**\n\nProcesses requests and generates responses using Anthropic's Claude model.`,
        function: 'processing',
        color: functionColors.processing,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "tools",
      type: 'colored',
      position: { x: 600, y: 100 },
      data: {
        label: "🔧 Tool Handler",
        url: "https://docs.anthropic.com/claude/docs/tool-use",
        markdown: `**Tool Handler**\n\nExecutes tool calls and returns results to the model.`,
        function: 'tool',
        color: functionColors.tool,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "streaming",
      type: 'colored',
      position: { x: 850, y: 0 },
      data: {
        label: "📡 Streaming Response",
        url: "https://docs.anthropic.com/claude/docs/streaming",
        markdown: `**Streaming Response**\n\nStreams partial responses for real-time UI updates.`,
        function: 'stream',
        color: functionColors.stream,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
    {
      id: "client_ui",
      type: 'colored',
      position: { x: 1100, y: 0 },
      data: {
        label: "🖥️ Client UI Updated",
        url: "https://docs.anthropic.com/claude/docs/ui",
        markdown: `**Client UI Updated**\n\nDisplays the streamed results to the end user.`,
        function: 'output',
        color: functionColors.output,
      },
      style: { padding: 12, borderRadius: 16, color: '#fff' },
    },
  ];

  /* ----------------- Edges ----------------- */
  const initialEdges = [
    { id: "c_pkg", source: "client", target: "sdk_packager", label: "request", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, markdown: `**Request**\n\nThe client sends a request to the SDK MCP Packager.` },
    { id: "att_pkg", source: "attachments", target: "sdk_packager", label: "embed", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, markdown: `**Embed**\n\nAttachments are embedded into the MCP package.` },
    { id: "pkg_api", source: "sdk_packager", target: "api_gateway", label: "MCP JSON", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, markdown: `**MCP JSON**\n\nPackaged request is sent to the API Gateway as MCP JSON.` },
    { id: "api_mod", source: "api_gateway", target: "moderation", label: "safety check", function: 'moderation', style: { stroke: functionColors.moderation, strokeWidth: 4 }, markdown: `**Safety Check**\n\nAPI Gateway forwards the request to Moderation for safety checks.` },
    { id: "mod_model", source: "moderation", target: "model", label: "allowed", function: 'moderation', style: { stroke: functionColors.moderation, strokeWidth: 4 }, markdown: `**Allowed**\n\nIf safe, the request is sent to the Claude Model.` },
    { id: "model_tools", source: "model", target: "tools", label: "tool call", function: 'tool', style: { stroke: functionColors.tool, strokeWidth: 4 }, markdown: `**Tool Call**\n\nThe model calls tools as needed to fulfill the request.` },
    { id: "tools_model", source: "tools", target: "model", label: "tool result", function: 'tool', style: { stroke: functionColors.tool, strokeWidth: 4 }, markdown: `**Tool Result**\n\nResults from tools are returned to the model.` },
    { id: "model_api", source: "model", target: "api_gateway", label: "completion", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, markdown: `**Completion**\n\nThe model sends the completed response to the API Gateway.` },
    { id: "api_stream", source: "api_gateway", target: "streaming", label: "chunks", function: 'stream', style: { stroke: functionColors.stream, strokeWidth: 4 }, markdown: `**Chunks**\n\nAPI Gateway streams response chunks to the Streaming node.` },
    { id: "stream_client", source: "streaming", target: "client_ui", label: "render", function: 'output', style: { stroke: functionColors.output, strokeWidth: 4 }, markdown: `**Render**\n\nStreaming node sends rendered output to the client UI.` },

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


  // Make edge lines thicker
  // Remove defaultEdgeOptions (now handled per-edge)
  // const defaultEdgeOptions = { style: { strokeWidth: 4 } };

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
                <pre style={{ background: '#f3f4f6', padding: 8, borderRadius: 8, fontSize: 15 }}>
                  {JSON.stringify(hoveredItem.data, null, 2)}
                </pre>
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
