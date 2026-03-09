import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initVibe } from '@vibe-viewer/sdk'

// Initialize Vibe SDK — auto-activates when ?agentic=true is in URL
initVibe({
  supabaseUrl: 'https://friuprxqojmjvgbhukic.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyaXVwcnhxb2ptanZnYmh1a2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzY1MTYsImV4cCI6MjA4ODIxMjUxNn0.HHJJIiBi4i9fVe2DB3kIV0sRrV65g8QKtR5Xry8w8Hw',
  projectId: '5d5f4675-1322-4e27-81ca-e8705b86ebcc',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)