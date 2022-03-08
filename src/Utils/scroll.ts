import { WAYKE_ECOM_MODAL_ID } from '../App';

export const scrollTop = () => {
  const elementScrollDesktop = document.getElementById(WAYKE_ECOM_MODAL_ID);
  const elementScrollMobile = document.getElementById(`${WAYKE_ECOM_MODAL_ID}-dialog`);
  if (elementScrollDesktop) {
    elementScrollDesktop.scrollTop = 0;
  }
  if (elementScrollMobile) {
    elementScrollMobile.scrollTop = 0;
  }
};
