import React, { createContext, useContext, useState, useCallback } from 'react';
import { Contact, ContactInput, ContactsResponse } from '../types/Contact';
import { contactService } from '../services/contactService';

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  getContact: (id: string) => Promise<Contact>;
  createContact: (contact: ContactInput) => Promise<Contact>;
  updateContact: (id: string, contact: ContactInput) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ContactsResponse = await contactService.fetchContacts();
      setContacts(response.contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getContact = useCallback(async (id: string) => {
    try {
      return await contactService.getById(id);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch contact');
    }
  }, []);

  const createContact = useCallback(async (contact: ContactInput) => {
    try {
      const newContact = await contactService.create(contact);
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create contact');
    }
  }, []);

  const updateContact = useCallback(async (id: string, contact: ContactInput) => {
    try {
      const updatedContact = await contactService.update(id, contact);
      setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update contact');
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete contact');
    }
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        error,
        fetchContacts,
        getContact,
        createContact,
        updateContact,
        deleteContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};
