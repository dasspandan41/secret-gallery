import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";

import Gallery from "./pages/Gallery";

import Admin from "./pages/Admin";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/dasspandan41-secret-upload-x7"
          element={<Admin />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
<Route
  path="/feedbacks"
  element={<Feedbacks />}
/>