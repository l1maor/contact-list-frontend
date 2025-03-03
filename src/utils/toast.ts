import { Toast } from 'primereact/toast';

let toastRef: Toast | null = null;

export const setToastRef = (ref: Toast) => {
  toastRef = ref;
};

export const showError = (error: Error | string) => {
  const message = error instanceof Error ? error.message : error;
  toastRef?.show({
    severity: 'error',
    summary: 'Error',
    detail: message,
    life: 3000
  });
};

export const showSuccess = (message: string) => {
  toastRef?.show({
    severity: 'success',
    summary: 'Success',
    detail: message,
    life: 3000
  });
};
