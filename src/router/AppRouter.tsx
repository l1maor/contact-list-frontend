import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContactListPage from '../pages/ContactListPage/ContactListPage';
import ContactViewPage from '../pages/ContactViewPage/ContactViewPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactListPage />} />
        <Route path="/contact/:contactId" element={<ContactViewPage />} />
      </Routes>
    </BrowserRouter>
  );
};
