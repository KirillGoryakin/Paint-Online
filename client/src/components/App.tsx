import {
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';

const genRoomId = () => Math.floor(Math.random() * 100000);

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout genRoomId={genRoomId} />}>
    <Route path=":roomId" element={<></>} />
    <Route index element={<Navigate to={'/' + genRoomId()} />} />
    <Route path="*" element={<Navigate to={'/' + genRoomId()} />} />
  </Route>
));

const App = () => <RouterProvider router={router} />;

export { App };