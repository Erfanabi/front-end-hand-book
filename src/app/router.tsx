import { createBrowserRouter } from 'react-router'
import { LocaleLayout, RootRedirect } from '@/features/i18n'
import { NotFoundPage } from '@/features/navigation/NotFoundPage'
import { AppShell } from './layouts'

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    path: '/:lang',
    element: <LocaleLayout />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/features/home/HomePage')).HomePage }),
          },
          {
            path: ':part/:chapter',
            lazy: async () => ({ Component: (await import('@/features/content/ChapterPage')).ChapterPage }),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
