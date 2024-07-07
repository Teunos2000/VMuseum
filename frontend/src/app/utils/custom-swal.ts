import Swal from 'sweetalert2';

export function customSwal(options: any) {
  const defaultOptions = {
    confirmButtonColor: '#8ED9E9',
    background: '#EAE7DE',
    customClass: {
      container: 'custom-swal-container',
      popup: 'custom-swal-popup',
      confirmButton: 'custom-confirm-button',
      icon: 'custom-icon'
    },
    iconColor: '#8ED9E9',
  };

  return Swal.fire({...defaultOptions, ...options});
}
