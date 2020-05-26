import { LoadingController } from '@ionic/angular';

export const setUpLoader = async (loadingController: LoadingController) => {
  return await loadingController.create({
    spinner: 'bubbles',
    translucent: true,
    cssClass: 'loading-spinner',
    backdropDismiss: false,
  });
}