import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactForm from '../../components/ContactForm/ContactForm';
import { Contact, ContactInput } from '../../types/Contact';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { contactService } from '../../services/contactService';
import { customTheme } from '../../theme';

const ContactFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { contactId } = useParams<{ contactId: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(!!contactId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      if (!contactId) return;
      try {
        const data = await contactService.getById(contactId);
        setContact(data);
      } catch (error) {
        console.error('Error fetching contact:', error);
        setError('Failed to load contact data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (contactId) {
      fetchContact();
    }
  }, [contactId, navigate]);

  const handleSubmit = async (values: ContactInput) => {
    setIsLoading(true);
    setError(null);

    try {
      if (contactId) {
        await contactService.update(contactId, values);
        navigate('/');
      } else {
        await contactService.create(values);
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save contact data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: customTheme.colors.background }} className="px-4 py-4 md:px-6 lg:px-8 min-h-screen">
      <Breadcrumb
        items={[
          { label: 'List', path: '/' },
          { label: contactId ? 'Edit User' : 'Add User' }
        ]}
      />

      <div className="flex flex-column">
        <div className="flex align-items-center gap-3 mb-4">
          <h1 className="text-900 font-bold text-4xl m-0">
            {contactId ? 'Edit User' : 'Add User'}
          </h1>
        </div>

        {error && (
          <div className="p-message p-message-error mb-4">
            {error}
          </div>
        )}

        <ContactForm
          onSubmit={handleSubmit}
          // isLoading={isLoading}
          mode={contactId ? 'edit' : 'create'}
          initialValues={contact || undefined}
        />
      </div>
    </div>
  );
};

export default ContactFormPage;