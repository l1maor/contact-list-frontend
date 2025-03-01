import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Contact, ContactInput, contactSchema } from '../../types/Contact';
import * as z from 'zod';

interface ContactFormProps {
  initialValues?: Partial<Contact>;
  onSubmit: (values: ContactInput) => Promise<void>;
  mode: 'create' | 'edit';
}

interface FormErrors {
  [key: string]: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialValues = {},
  onSubmit,
  mode
}) => {
  const [values, setValues] = React.useState({
    name: initialValues.name || '',
    phone: initialValues.phone || '',
    bio: initialValues.bio || '',
    avatar: initialValues.avatar || ''
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = React.useState<string>('');

  const validateField = (name: string, value: string) => {
    try {
      // @ts-expect-error - necessary to create a schema for a single field.
      const fieldSchema = z.object({ [name]: contactSchema.shape[name] });
      const result = fieldSchema.safeParse({ [name]: value });
      if (!result.success) {
        const fieldError = result.error.errors[0]?.message;
        setErrors(prev => ({ ...prev, [name]: fieldError }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const validateForm = () => {
    try {
      const result = contactSchema.safeParse(values);
      if (!result.success) {
        const formErrors: FormErrors = {};
        result.error.errors.forEach((err) => {
          if (err.path) {
            formErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formErrors);
        return false;
      }
      setErrors({});
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Image size must be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setValues(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.avatar;
          return newErrors;
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const allTouched = Object.keys(contactSchema.shape).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
        if (error.message.toLowerCase().includes('phone')) {
          setErrors(prev => ({
            ...prev,
            phone: error.message
          }));
          setTouched(prev => ({
            ...prev,
            phone: true
          }));
        }
        throw error;
      } else {
        const errorMessage = 'Failed to submit form';
        setSubmitError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // @ts-expect-error - Dynamic field access in values object. This is necessary to access the value of a field dynamically.
    validateField(name, values[name]);
  };

  const isFormValid = () => {
    const requiredFieldsFilled = values.name.trim() !== '' && values.phone.trim() !== '';
    const noErrors = Object.keys(errors).length === 0;
    return requiredFieldsFilled && noErrors;
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <Card className="contact-form__card">
        {submitError && (
          <div className="contact-form__error-message mb-3">
            <Message severity="error" text={submitError} role="alert" />
          </div>
        )}
        <div className="contact-form__fields">
          <div className="contact-form__field">
            <label htmlFor="name" className="contact-form__label">
              Name *
            </label>
            <InputText
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`contact-form__input ${errors.name && touched.name ? 'p-invalid' : ''}`}
              placeholder="Enter contact name"
            />
            {errors.name && touched.name && (
              <Message severity="error" text={errors.name} data-testid="name-error" />
            )}
          </div>

          <div className="contact-form__field">
            <label htmlFor="phone" className="contact-form__label">
              Phone *
            </label>
            <InputText
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`contact-form__input ${errors.phone && touched.phone ? 'p-invalid' : ''}`}
              placeholder="Enter phone number"
            />
            {errors.phone && touched.phone && (
              <Message severity="error" text={errors.phone} data-testid="phone-error" />
            )}
          </div>

          <div className="contact-form__field">
            <label htmlFor="bio" className="contact-form__label">
              Bio
            </label>
            <InputTextarea
              id="bio"
              name="bio"
              value={values.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`contact-form__input ${errors.bio && touched.bio ? 'p-invalid' : ''}`}
              placeholder="Enter contact bio"
              rows={4}
            />
            {touched.bio && errors.bio && (
              <Message severity="error" text={errors.bio} className="p-error-message" aria-label="bio-error" role="alert" />
            )}
          </div>

          <div className="contact-form__field contact-form__field--avatar">
            <label className="contact-form__label">Profile Picture</label>
            <div
              className="contact-form__dropzone"
              data-testid="dropzone"
              role="presentation"
              tabIndex={0}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {values.avatar ? (
                <div className="contact-form__avatar-preview">
                  <img
                    src={values.avatar}
                    alt="Avatar preview"
                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                  />
                  <p>Click or drag to change image</p>
                </div>
              ) : (
                <div className={`contact-form__dropzone-content ${isDragActive ? 'active' : ''}`}>
                  <i className="pi pi-image" style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                  <p>Drag & drop an image here, or click to select</p>
                  <small>Maximum size: 5MB</small>
                </div>
              )}
            </div>
            {errors.avatar && (
              <Message severity="error" text={errors.avatar} data-testid="image-error" />
            )}
          </div>
        </div>

        <div className="contact-form__actions">
          <Button
            type="button"
            label="Cancel"
            className="p-button-outlined p-button-secondary"
            aria-label="Cancel"
          />
          <Button
            type="submit"
            label={mode === 'create' ? 'Create Contact' : 'Update Contact'}
            disabled={!isFormValid()}
            aria-label={mode === 'create' ? 'Create Contact' : 'Update Contact'}
          />
        </div>
      </Card>
    </form>
  );
};

export default ContactForm;
