import { Contact, ContactInput, ContactsResponse } from '../types/Contact';
import { showError, showSuccess } from '../utils/toast';

class ContactService {
  defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  private getErrorMessage(error: unknown, operation: string): string {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (error instanceof Error) {
      return `An error occurred while ${operation}. Please try again.`;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  async fetchContacts(page = 1, query = ''): Promise<ContactsResponse> {
    try {
      let url = `/contacts?page=${page}`;
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url, {
        headers: this.defaultHeaders
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch contacts. Please try again.');
      }
      return response.json();
    } catch (error) {
      const message = this.getErrorMessage(error, 'loading contacts');
      showError(message);
      throw error;
    }
  }

  async getById(id: string): Promise<Contact> {
    try {
      const response = await fetch(`/contacts/${id}`, {
        headers: this.defaultHeaders
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Contact not found');
      }
      return response.json();
    } catch (error) {
      const message = this.getErrorMessage(error, 'loading contact details');
      showError(message);
      throw error;
    }
  }

  async create(contact: ContactInput): Promise<Contact> {
    try {
      const response = await fetch('/contacts', {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(contact),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Unable to create contact. Please check the information and try again.');
      }
      
      showSuccess('Contact created successfully');
      return data;
    } catch (error) {
      const message = this.getErrorMessage(error, 'creating contact');
      showError(message);
      throw error;
    }
  }

  async update(id: string, contact: ContactInput): Promise<Contact> {
    try {
      const response = await fetch(`/contacts/${id}`, {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: JSON.stringify(contact),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update contact. Please check the information and try again.');
      }
      
      showSuccess('Contact updated successfully');
      return data;
    } catch (error) {
      const message = this.getErrorMessage(error, 'updating contact');
      showError(message);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/contacts/${id}`, {
        method: 'DELETE',
        headers: this.defaultHeaders
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to delete contact. Please try again.');
      }
      showSuccess('Contact deleted successfully');
    } catch (error) {
      const message = this.getErrorMessage(error, 'deleting contact');
      showError(message);
      throw error;
    }
  }
}

export const contactService = new ContactService();
