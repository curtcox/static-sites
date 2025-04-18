// diagramData.ts
// Node and edge definitions for MCPInteractiveDiagram

import { functionColors } from "./functionColors";

export const defaultNodeType = 'colored';
export const defaultNodeStyle = { padding: 12, borderRadius: 16, color: '#fff' };

export const initialNodesData = [
  {
    id: "client",
    position: { x: -500, y: 0 },
    data: {
      label: "🖥️\nClient App",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Client App**\n\nThis node represents the application that sends requests to Anthropic's API.`,
      function: 'input',
      color: functionColors.input,
    },
  },
  {
    id: "attachments",
    position: { x: -500, y: 150 },
    data: {
      label: "📎\nAttachments & Images",
      url: "https://docs.anthropic.com/claude/docs/images",
      markdown: `**Attachments & Images**\n\nThis node handles file and image attachments sent with requests.`,
      function: 'input',
      color: functionColors.input,
    },
  },
  {
    id: "sdk_packager",
    position: { x: -200, y: 0 },
    data: {
      label: "📦\nSDK MCP Packager",
      url: "https://docs.anthropic.com/claude/docs/model-context-protocol",
      markdown: `**SDK MCP Packager**\n\nPackages client data and attachments into MCP-compliant requests.`,
      function: 'processing',
      color: functionColors.processing,
    },
  },
  {
    id: "api_gateway",
    position: { x: 100, y: 0 },
    data: {
      label: "🌐\nAnthropic API Gateway",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Anthropic API Gateway**\n\nHandles incoming MCP requests and routes them for moderation and model inference.`,
      function: 'processing',
      color: functionColors.processing,
    },
  },
  {
    id: "moderation",
    position: { x: 350, y: -100 },
    data: {
      label: "🛡️\nModeration",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Moderation**\n\nChecks requests for safety and compliance.`,
      function: 'moderation',
      color: functionColors.moderation,
    },
  },
  {
    id: "model",
    position: { x: 600, y: 0 },
    data: {
      label: "🤖\nClaude Model",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Claude Model**\n\nPerforms inference and can call tools as needed.`,
      function: 'processing',
      color: functionColors.processing,
    },
  },
  {
    id: "tools",
    position: { x: 850, y: 0 },
    data: {
      label: "🛠️\nTools",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Tools**\n\nExternal tools that the Claude model can call.`,
      function: 'tool',
      color: functionColors.tool,
    },
  },
  {
    id: "streaming",
    position: { x: 350, y: 150 },
    data: {
      label: "🔄\nStreaming",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Streaming**\n\nHandles streaming of response chunks to the client UI.`,
      function: 'stream',
      color: functionColors.stream,
    },
  },
  {
    id: "client_ui",
    position: { x: -200, y: 250 },
    data: {
      label: "🖥️\nClient UI",
      url: "https://docs.anthropic.com/claude/reference/messages_post",
      markdown: `**Client UI**\n\nDisplays the final output to the user.`,
      function: 'output',
      color: functionColors.output,
    },
  },
];

export const initialEdges = [
  { id: "c_pkg", source: "client", target: "sdk_packager", label: "request", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Request**\n\nThe client sends a request to the SDK MCP Packager.` },
  { id: "att_pkg", source: "attachments", target: "sdk_packager", label: "embed", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Embed**\n\nAttachments are embedded into the MCP package.` },
  { id: "pkg_api", source: "sdk_packager", target: "api_gateway", label: "MCP JSON", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**MCP JSON**\n\nPackaged request is sent to the API Gateway as MCP JSON.` },
  { id: "api_mod", source: "api_gateway", target: "moderation", label: "safety check", function: 'moderation', style: { stroke: functionColors.moderation, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Safety Check**\n\nAPI Gateway forwards the request to Moderation for safety checks.` },
  { id: "mod_model", source: "moderation", target: "model", label: "allowed", function: 'moderation', style: { stroke: functionColors.moderation, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Allowed**\n\nIf safe, the request is sent to the Claude Model.` },
  { id: "model_tools", source: "model", target: "tools", label: "tool call", function: 'tool', style: { stroke: functionColors.tool, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Tool Call**\n\nThe model calls tools as needed to fulfill the request.` },
  { id: "tools_model", source: "tools", target: "model", label: "tool result", function: 'tool', style: { stroke: functionColors.tool, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Tool Result**\n\nResults from tools are returned to the model.` },
  { id: "model_api", source: "model", target: "api_gateway", label: "completion", function: 'processing', style: { stroke: functionColors.processing, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Completion**\n\nThe model sends the completed response to the API Gateway.` },
  { id: "api_stream", source: "api_gateway", target: "streaming", label: "chunks", function: 'stream', style: { stroke: functionColors.stream, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Chunks**\n\nAPI Gateway streams response chunks to the Streaming node.` },
  { id: "stream_client", source: "streaming", target: "client_ui", label: "render", function: 'output', style: { stroke: functionColors.output, strokeWidth: 4 }, labelStyle: { fontSize: 24 }, markdown: `**Render**\n\nStreaming node sends rendered output to the client UI.` },
];
