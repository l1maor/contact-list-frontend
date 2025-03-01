import { Contact, ContactInput, ContactsResponse } from '../types/Contact';

class ContactService {
  defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Contact> {
    const response = await fetch(`/contacts/${id}`, {
      headers: this.defaultHeaders
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async create(contact: ContactInput): Promise<Contact> {
    const response = await fetch('/contacts', {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(contact),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  async update(id: string, contact: ContactInput): Promise<Contact> {
    const response = await fetch(`/contacts/${id}`, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: JSON.stringify(contact),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export const contactService = new ContactService();
