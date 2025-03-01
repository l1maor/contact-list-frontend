import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contactService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { customTheme } from '../../theme';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { Contact } from '../../types/Contact';
import defaultAvatar from '../../assets/default-avatar.svg';

const ContactViewPage: React.FC = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (contactId) {
      loadContact(contactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const loadContact = async (id: string) => {
    try {
      const data = await contactService.getById(id);
      setContact(data);
    } catch (error) {
      console.error('Error fetching contact:', error);
      navigate('/');
    }
  };

  const handleEdit = () => {
    if (contact) {
      navigate(`/contact/${contact.id}/edit`);
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this contact?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: handleDelete
    });
  };

  const handleDelete = async () => {
    if (!contact) return;
    try {
      await contactService.delete(contact.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (!contact) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    );
  }

  return (
    <div className="contact-view__page" style={{ backgroundColor: customTheme.colors.background }}>
      <Breadcrumb
        items={[
          { label: 'List', path: '/' },
          { label: 'Basic information' }
        ]}
      />

      <ConfirmDialog />

      <Card
        className="contact-view__card mb-4"
        pt={{
          root: { className: 'p-4' }
        }}
      >
        <div className="flex flex-column md:flex-row align-items-start gap-4">
          <img
            src={contact.avatar ? `${contact.avatar}` : defaultAvatar}
            alt={contact.name}
            className="contact-view__avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />

          <div className="flex-1">
            <h2 className="text-900 font-bold text-4xl mt-0 mb-2">{contact.name}</h2>
            <div className="flex align-items-center text-600 mt-0 mb-4">
              <i className="pi pi-phone mr-2 contact-view__phone-icon"></i>
              <p className="m-0">{contact.phone}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              icon="pi pi-pencil"
              label="Edit"
              onClick={handleEdit}
              className="contact-view__button"
            />
            <Button
              icon="pi pi-trash"
              label="Delete"
              className="contact-view__button"
              onClick={confirmDelete}
            />
          </div>
        </div>
      </Card>

      <Card
        className="contact-view__card contact-view__card--bio"
        pt={{
          root: { className: 'p-4' }
        }}
      >
        <h3 className="text-900 font-semibold mb-3">Bio</h3>
        <p className="text-700 line-height-3 m-0">{contact.bio}</p>
      </Card>
    </div>
  );
};

export default ContactViewPage;
