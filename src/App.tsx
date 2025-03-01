import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactListPage from './pages/ContactListPage/ContactListPage';
import ContactViewPage from './pages/ContactViewPage/ContactViewPage';
import ContactFormPage from './pages/ContactFormPage/ContactFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactListPage />} />
        <Route path="/contact/:contactId" element={<ContactViewPage />} />
        <Route path="/contact/new" element={<ContactFormPage />} />
        <Route path="/contact/:contactId/edit" element={<ContactFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
