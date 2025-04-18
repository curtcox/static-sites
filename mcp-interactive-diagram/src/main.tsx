import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MCPInteractiveDiagram from './InteractiveDiagram.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MCPInteractiveDiagram />
  </StrictMode>,
)
