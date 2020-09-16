import { LoadingController, ToastController } from '@ionic/angular';

export const setUpLoader = async (loadingController: LoadingController) => {
  return await loadingController.create({
    spinner: 'bubbles',
    translucent: true,
    cssClass: 'loading-spinner',
    // backdropDismiss: false,
    backdropDismiss: true,
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

// find elements of arr2 that are not in arr1
export const getArraysDifference = (arr1: any[], arr2: any[]) => {
  console.log('arr1', arr1);
  console.log('arr2', arr2);
  const result = [];
  const map = {};
  for (let i of arr1) { map[i] = true; }
  for (let i of arr2) {
    if (!map[i]) result.push(i);
    console.log('result for i', i, ':', result);
  }
  console.log('result final => ', result);
  return result;
};