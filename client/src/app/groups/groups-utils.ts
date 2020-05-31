import { LoadingController, ToastController } from '@ionic/angular';

export const setUpLoader = async (loadingController: LoadingController) => {
  return await loadingController.create({
    spinner: 'bubbles',
    translucent: true,
    cssClass: 'loading-spinner',
    backdropDismiss: false,
  });
};


export const setUpToast = async (toastController: ToastController, message: string) => {
  const toastCtrl = await toastController.create({
    message: message,
    color: 'primary',
    duration: 2000
  });
  return toastCtrl.present();
};
