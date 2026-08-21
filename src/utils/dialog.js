import { Alert, Platform } from 'react-native';

// react-native-web does not implement Alert.alert — it is a silent no-op there,
// so anything gated behind a confirmation would never run on web. These helpers
// fall back to the browser dialogs and keep the native experience unchanged.

export const confirm = ({ title, message, confirmText = 'OK', cancelText = 'Cancel', destructive }) =>
  new Promise((resolve) => {
    if (Platform.OS === 'web') {
      resolve(window.confirm(message ? `${title}\n\n${message}` : title));
      return;
    }

    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: () => resolve(true),
      },
    ]);
  });

export const notify = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }

  Alert.alert(title, message);
};
