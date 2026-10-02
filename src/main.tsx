import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import '@/styles/global.css'

// Chapters load lazily, so the browser's own restoration would fire before the content exists
// and fight our hash/top scrolling in ChapterPage.
history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
