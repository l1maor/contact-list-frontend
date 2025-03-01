import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../types/Contact';
import defaultAvatar from '../../assets/default-avatar.svg';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const navigate = useNavigate();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      navigate(`/contact/${contact.id}`);
    }
  };

  return (
    <div
      className="contact-card__container"
      onClick={() => navigate(`/contact/${contact.id}`)}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${contact.name}`}
    >
      <div className="contact-card__content">
        <div className="contact-card__avatar-wrapper">
          <img
            src={contact.avatar ? `${contact.avatar}` : defaultAvatar}
            alt={contact.name}
            className="contact-card__avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />
        </div>
        <div className="contact-card__details">
          <h3 className="contact-card__name">{contact.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
