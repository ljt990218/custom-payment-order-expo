import { useFonts } from 'expo-font';

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    'WeChatSans-Light': require('@/assets/fonts/WeChatSansStd-Light.otf'),
    'WeChatSans-Medium': require('@/assets/fonts/WeChatSansStd-Medium.otf'),
  });

  return fontsLoaded;
}