import {
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';

const genRoomCode = () => Math.floor(Math.random() * 100000);

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route path=":id" element={<></>} />
    <Route index element={<Navigate to={'/' + genRoomCode()} />} />
    <Route path="*" element={<Navigate to={'/' + genRoomCode()} />} />
  </Route>
));

const App = () => <RouterProvider router={router} />

export { App };