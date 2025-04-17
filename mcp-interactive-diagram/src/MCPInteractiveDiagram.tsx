"use client";
import { useCallback } from "react";
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

  const onNodeClick = useCallback((_event: any, node: any) => {
    if (node?.data?.url) {
      window.open(node.data.url, "_blank", "noopener noreferrer");
    }
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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      {/* Markdown Sidebar */}
      <div
        style={{
          width: 380,
          minWidth: 320,
          maxWidth: 440,
          height: '100%',
          background: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          padding: '32px 24px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          fontSize: 18,
          fontFamily: 'system-ui, sans-serif',
          zIndex: 10,
        }}
      >
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      {/* Diagram Area */}
      <div style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
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
