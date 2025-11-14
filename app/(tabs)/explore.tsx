import { Image } from 'expo-image'
import { Text, View } from 'react-native'

export default function TabTwoScreen() {
  const actImg = require('@/assets/ljt990218.png')

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={actImg} style={{ width: 200, height: 200, borderRadius: 100, marginBottom: 24 }}></Image>
      <Text style={{ fontSize: 24 }}>by: ljt990218</Text>
    </View>
  )
}
