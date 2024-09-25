import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage.jsx";
// import verifyOTP from './verifyOTP.jsx';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<LoginPage />} />
          {/* <Route exact path="/verify-otp" element={<VerifyOTP />} /> */}
        </Routes>
    </Router>
  );
}

export default App;
