import { Image, type ImageSource } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const defaults = {
  storeName: '粥小串永州冷水滩店',
  amount: '-500.00',
  status: '支付成功',
  payTime: '2025年7月10日 21:53:38',
  productName: '粥小串永州冷水滩店-cz-10000317871164694',
  merchantFullName: '永州市冷水滩区粥小串串餐饮店(个体工商户)',
  acquiringInstitution: '拉卡拉支付股份有限公司',
  clearingDescription: '由中国银联股份有限公司提供收款清算服务',
  paymentMethod: '零钱',
  paymentNote: '优先支付方式零钱通余额不足，已自动更换支付方式完成支付',
  transactionId: '4200002732202507107819354892',
  merchantOrderNote: '可在支持的商户扫码退款',
  barcode: '2025071010113130166241449811882',
  avatarKey: 'xiong',
}

const avatarMap: Record<string, ImageSource> = {
  'e-pay': require('@/assets/icons/e-pay.png') as ImageSource,
  'e-pay2': require('@/assets/icons/e-pay2.png') as ImageSource,
  jianhang: require('@/assets/icons/jianhang.png') as ImageSource,
  jianhang2: require('@/assets/icons/jianhang2.png') as ImageSource,
  lan: require('@/assets/icons/lan.png') as ImageSource,
  meituan: require('@/assets/icons/meituan.png') as ImageSource,
  meituan2: require('@/assets/icons/meituan2.png') as ImageSource,
  nonghang: require('@/assets/icons/nonghang.png') as ImageSource,
  shihua: require('@/assets/icons/shihua.png') as ImageSource,
  shouqianba: require('@/assets/icons/shouqianba.png') as ImageSource,
  xiong: require('@/assets/icons/xiong.png') as ImageSource,
  yunshanfu: require('@/assets/icons/yunshanfu.png') as ImageSource,
  zhifutong: require('@/assets/icons/zhifutong.png') as ImageSource,
}

function coerceParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback
  }
  return value ?? fallback
}

export default function DetailsScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()

  const data = useMemo(() => {
    return {
      storeName: coerceParam(params.storeName, defaults.storeName),
      amount: coerceParam(params.amount, defaults.amount),
      status: coerceParam(params.status, defaults.status),
      payTime: coerceParam(params.payTime, defaults.payTime),
      productName: coerceParam(params.productName, defaults.productName),
      merchantFullName: coerceParam(params.merchantFullName, defaults.merchantFullName),
      acquiringInstitution: coerceParam(params.acquiringInstitution, defaults.acquiringInstitution),
      clearingDescription: coerceParam(params.clearingDescription, defaults.clearingDescription),
      paymentMethod: coerceParam(params.paymentMethod, defaults.paymentMethod),
      paymentNote: coerceParam(params.paymentNote, defaults.paymentNote),
      transactionId: coerceParam(params.transactionId, defaults.transactionId),
      merchantOrderNote: coerceParam(params.merchantOrderNote, defaults.merchantOrderNote),
      barcode: coerceParam(params.barcode, defaults.barcode),
      avatarKey: coerceParam(params.avatarKey, defaults.avatarKey),
    }
  }, [params])

  const avatarSource = useMemo(() => {
    return avatarMap[data.avatarKey] ?? avatarMap[defaults.avatarKey]
  }, [data.avatarKey])

  const barcodeImageUri = useMemo(() => {
    if (!data.barcode) return null
    const encoded = encodeURIComponent(data.barcode)

    console.log('encoded', `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encoded}&scale=2&includetext=false`)

    return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encoded}&scale=2&includetext=false`
  }, [data.barcode])

  const infoRows = [
    { label: '当前状态', value: data.status },
    { label: '支付时间', value: data.payTime },
    { label: '商品', value: data.productName },
    { label: '商户全称', value: data.merchantFullName },
    { label: '收单机构', value: data.acquiringInstitution, clearingDescription: data.clearingDescription },
    { label: '支付方式', value: data.paymentMethod },
    { label: '支付说明', value: data.paymentNote },
    { label: '交易单号', value: data.transactionId },
    { label: '商户单号', value: data.merchantOrderNote },
  ]

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
        >
          <Image source={require('@/assets/close.png')} style={{ width: 32, height: 32 }} />
        </TouchableOpacity>

        <View className="bg-white pt-8 pb-6 px-7">
          <Image
            source={avatarSource}
            resizeMode="contain"
            style={{
              width: 48,
              aspectRatio: 1,
              marginBottom: 12,
              alignSelf: 'center',
            }}
            className="mb-3"
          />
          <Text className="text-lg text-center text-gray-900 mb-5">{data.storeName}</Text>
          <Text
            className="text-4xl font-bold text-center text-gray-900 mb-8"
            style={{ fontFamily: 'WeChatSans-Medium' }}
          >
            {data.amount}
          </Text>
          <View className="h-px bg-gray-200 my-3" />
          {infoRows.map((row) => (
            <View className="flex flex-row justify-start items-start gap-3 my-2" key={row.label}>
              <Text className="text-md text-gray-500 w-23" style={{ width: 70 }}>
                {row.label}
              </Text>
              <View className="flex-1">
                <Text className={`text-base text-gray-900 text-left leading-5.5`}>{row.value}</Text>
                {row.clearingDescription && (
                  <Text className="text-base text-gray-500 text-left leading-5.5 mt-1">
                    {row.clearingDescription}
                  </Text>
                )}
              </View>
            </View>
          ))}
          <View className="mt-6 items-center">
            {barcodeImageUri ? (
              <Image
                source={{ uri: barcodeImageUri }}
                style={{ width: '88%', height: 55 }}
                // resizeMode="contain"
                className="mb-3"
              />
            ) : (
              <Text className="text-sm text-gray-400 mb-3">暂无条形码信息</Text>
            )}
            <Text className="text-base text-gray-900" style={{ letterSpacing: 1.2 }}>
              {data.barcode}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
