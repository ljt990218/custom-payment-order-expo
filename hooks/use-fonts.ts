import { useFonts } from 'expo-font';

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    'WeChatSansStd-Light': require('@/assets/fonts/WeChatSansStd-Light.otf'),
    'WeChatSansStd-Medium': require('@/assets/fonts/WeChatSansStd-Medium.otf'),
  });

  return fontsLoaded;
}