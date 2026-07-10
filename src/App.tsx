import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './components/Dashboard/Index';
import Todo from './components/Todo/Todo';
import NotFound from './components/NotFound/NotFound';

import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './ProtectedRoute';

// AUTH
import Registration from './components/Auth/Registration';
import Login from './components/Auth/Login';

// Task
import NewTask from './components/Task/NewTask';
import ViewTask from './components/Task/ViewTask';
import EditTask from './components/Task/EditTask';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false}/>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<NotFound/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<Dashboard/>}>
              <Route path="/" element={<Todo/>}/>
              <Route path="new-task" element={<NewTask/>}/>
              <Route path="view-task/:id" element={<ViewTask/>}/>
              <Route path="edit-task/:id" element={<EditTask/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
