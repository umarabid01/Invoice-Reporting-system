import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AddData from "./pages/AddData";
import Invoice from "./pages/Invoice";
import Report from "./pages/Report";

function App() {
return ( <BrowserRouter> <Routes>

    {/* Default Page */}
    <Route
      path="/"
      element={<Navigate to="/add-data" replace />}
    />

    {/* Add Data Page */}
    <Route
      path="/add-data"
      element={<AddData />}
    />

    {/* Generate Invoice Page */}
    <Route
      path="/invoice"
      element={<Invoice />}
    />

    {/* Generate Report Page */}
    <Route
      path="/report"
      element={<Report />}
    />

  </Routes>
</BrowserRouter>

);
}

export default App;
