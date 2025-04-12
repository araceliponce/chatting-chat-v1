import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/partials/Header';
import { Socket } from 'socket.io-client';
import { Toaster } from 'sonner';

// https://sonner.emilkowal.ski/toaster

//these only accepts export default function pages [rfc] (not [rafc] export const Page = ()...)
const NewHome = lazy(() => import('@/components/pages/Home'));
const Login = lazy(() => import('@/components/pages/Login'));
const SignUp = lazy(() => import('@/components/pages/Signup'));
const Profile = lazy(() => import('@/components/pages/Profile'));
const Chat3 = lazy(() => import('@/components/pages/Chat3'));

export default function CustomRouter({ socket }: { socket: Socket }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Header /> */}
        <Suspense fallback={<BigSpinner />}>
          <Header />
          <Routes>

            <Route path="/" element={<NewHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/lobby/:id" element={<Chat3 socket={socket} />} />
          </Routes>
        </Suspense>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              maxWidth: '20rem',
              right: '1.5rem',
              marginInlineStart: 'auto'
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

function BigSpinner() {
  return (
    <main className='grid-center'>
      {/* <p>Loading...</p> */}
    </main>
  )
}
