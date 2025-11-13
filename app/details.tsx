import { useCustomFonts } from '@/hooks/use-fonts';
import { Image, type ImageSource } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

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
};

const avatarMap: Record<string, ImageSource> = {
  xiong: require('@/assets/icons/xiong.png') as ImageSource,
  meituan: require('@/assets/icons/meituan.png') as ImageSource,
  lan: require('@/assets/icons/lan.png') as ImageSource,
};

function coerceParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
}

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  const data = useMemo(() => {
    return {
      storeName: coerceParam(params.storeName, defaults.storeName),
      amount: coerceParam(params.amount, defaults.amount),
      status: coerceParam(params.status, defaults.status),
      payTime: coerceParam(params.payTime, defaults.payTime),
      productName: coerceParam(params.productName, defaults.productName),
      merchantFullName: coerceParam(params.merchantFullName, defaults.merchantFullName),
      acquiringInstitution: coerceParam(
        params.acquiringInstitution,
        defaults.acquiringInstitution,
      ),
      clearingDescription: coerceParam(
        params.clearingDescription,
        defaults.clearingDescription,
      ),
      paymentMethod: coerceParam(params.paymentMethod, defaults.paymentMethod),
      paymentNote: coerceParam(params.paymentNote, defaults.paymentNote),
      transactionId: coerceParam(params.transactionId, defaults.transactionId),
      merchantOrderNote: coerceParam(params.merchantOrderNote, defaults.merchantOrderNote),
      barcode: coerceParam(params.barcode, defaults.barcode),
      avatarKey: coerceParam(params.avatarKey, defaults.avatarKey),
    };
  }, [params]);

  const avatarSource = useMemo(() => {
    return avatarMap[data.avatarKey] ?? avatarMap[defaults.avatarKey];
  }, [data.avatarKey]);

  const barcodeImageUri = useMemo(() => {
    if (!data.barcode) return null;
    const encoded = encodeURIComponent(data.barcode);
    return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encoded}&scale=2&includetext=false`;
  }, [data.barcode]);

  const infoRows = [
    { label: '当前状态', value: data.status },
    { label: '支付时间', value: data.payTime },
    { label: '商品', value: data.productName },
    { label: '商户全称', value: data.merchantFullName },
    { label: '收单机构', value: data.acquiringInstitution },
    { label: '清算说明', value: data.clearingDescription },
    { label: '支付方式', value: data.paymentMethod },
    { label: '支付说明', value: data.paymentNote },
    { label: '交易单号', value: data.transactionId },
    { label: '商户单号', value: data.merchantOrderNote },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 0, paddingBottom: 0 }}>
        <View className="bg-white rounded-2xl py-6 px-5 shadow-lg shadow-black/10 elevation-6">
          <Image source={avatarSource} className="w-17.5 h-17.5 rounded-full self-center mb-3" />
          <Text className="text-lg font-semibold text-center text-gray-900 mb-2" style={{ fontFamily: 'WeChatSans-Medium' }}>
            {data.storeName}
          </Text>
          <Text className="text-5xl font-bold text-center text-gray-900 mb-4" style={{ fontFamily: 'WeChatSans-Medium' }}>
            {data.amount}
          </Text>
          <View className="h-px bg-gray-200 my-4" />
          {infoRows.map((row) => (
            <View className="flex-row justify-between items-start gap-3 my-2.5" key={row.label}>
              <Text className="text-sm text-gray-500 w-23">{row.label}</Text>
              <Text
                className={`text-base text-gray-900 flex-1 text-right leading-5.5 ${
                  row.label === '交易单号' ? 'font-mono' : ''
                }`}
                style={row.label === '交易单号' ? { fontFamily: 'WeChatSans-Light' } : {}}
              >
                {row.value}
              </Text>
            </View>
          ))}
          <View className="mt-6 items-center">
            {barcodeImageUri ? (
              <Image source={{ uri: barcodeImageUri }} className="w-full h-30 resize-contain mb-3" />
            ) : (
              <Text className="text-sm text-gray-400 mb-3">暂无条形码信息</Text>
            )}
            <Text className="text-sm tracking-wider text-gray-900" style={{ fontFamily: 'WeChatSans-Light' }}>
              {data.barcode}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


