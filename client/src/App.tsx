
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './features/auth/layouts/SignInLayout'
import { NotAuthenticatedRoute, ProtectedRoute } from './features/auth/services/ProtectedRoute'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { ContentPagesLayout } from './layouts/ContentPagesLayout'
import { MainHomePage } from './features/blogs/layouts/MainHomePage'
import { PostBlogPageLayout } from './features/posts/layouts/PostBlogPageLayout'
import { AboutPage } from './components/AboutPage'
import { ContactsPage } from './components/ContactsPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />
      },
      {
        path: "error",
        element: <ErrorPageLayout />,
      },
      {
        element: <NotAuthenticatedRoute />,
        children: [
          {
            path: "sign-in",
            element: <SignInLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="login" replace />,
              },
              {
                path: "login",
                handle: {
                  title: "Login",
                }
              },
              {
                path: "register",
                handle: {
                  title: "Register",
                }
              }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ContentPagesLayout />,
            children: [
              {
                path: "home",
                element: <MainHomePage />
              },
              {
                path: "about",
                element: <AboutPage />
              },
              {
                path: "contacts",
                element: <ContactsPage />
              },
              {
                path: "post",
                element: <PostBlogPageLayout />
              }
            ]
          },
        ]
      }
    ]
  }
]);






function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
