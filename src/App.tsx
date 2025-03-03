import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef, useEffect } from 'react';
import ContactListPage from './pages/ContactListPage/ContactListPage';
import ContactViewPage from './pages/ContactViewPage/ContactViewPage';
import ContactFormPage from './pages/ContactFormPage/ContactFormPage';
import { setToastRef } from './utils/toast';

function App() {
  const toast = useRef<Toast>(null);

  // Set toast ref on mount
  useEffect(() => {
    if (toast.current) {
      setToastRef(toast.current);
    }
  }, []);

  return (
    <BrowserRouter>
      <Toast ref={toast} position="top-right" />
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
