import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Contact } from '../../types/Contact';
import { contactService } from '../../services/contactService';
import ContactCard from '../../components/ContactCard/ContactCard';
import { useDebounce } from '../../hooks/useDebounce';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';

const ContactListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { q: debouncedSearch } : {});
    setPage(1);
  }, [debouncedSearch, setSearchParams]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const { contacts: newContacts, pagination } = await contactService.fetchContacts(
          page,
          debouncedSearch
        );
        setContacts(prev => page === 1 ? newContacts : [...prev, ...newContacts]);
        setHasMore(pagination.hasMore);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [page, debouncedSearch]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleAddUser = () => {
    navigate('/contact/new');
  };

  return (
    <div className="contact-list__page">
      <Breadcrumb
        items={[
          { label: 'List' }
        ]}
      />

      <div className="contact-list__header">
        <h1>Users</h1>
        <div className="contact-list__search-container">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
            />
          </span>
        </div>
        <Button
          icon="pi pi-plus"
          label="Add User"
          onClick={handleAddUser}
          className="contact-list__add-button"
        />
      </div>

      {contacts.length > 0 ? (
        <div className="contact-list__grid">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-xl text-600">No contacts found</p>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="contact-list__load-more">
          <Button
            label="Load more"
            onClick={handleLoadMore}
            loading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ContactListPage;
