import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type FormState = {
  storeName: string
  amount: string
  status: string
  payTime: string
  productName: string
  merchantFullName: string
  acquiringInstitution: string
  clearingDescription: string
  paymentMethod: string
  paymentNote: string
  transactionId: string
  merchantOrderNote: string
  barcode: string
}

const defaultForm: FormState = {
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
}

const avatarPresets = [
  {
    key: 'e-pay',
    label: 'E支付',
    source: require('@/assets/icons/e-pay.png'),
  },
  {
    key: 'e-pay2',
    label: 'E支付2',
    source: require('@/assets/icons/e-pay2.png'),
  },
  {
    key: 'jianhang',
    label: '建行',
    source: require('@/assets/icons/jianhang.png'),
  },
  {
    key: 'jianhang2',
    label: '建行2',
    source: require('@/assets/icons/jianhang2.png'),
  },
  {
    key: 'lan',
    label: '蓝色',
    source: require('@/assets/icons/lan.png'),
  },
  {
    key: 'meituan',
    label: '美团',
    source: require('@/assets/icons/meituan.png'),
  },
  {
    key: 'meituan2',
    label: '美团2',
    source: require('@/assets/icons/meituan2.png'),
  },
  {
    key: 'nonghang',
    label: '农行',
    source: require('@/assets/icons/nonghang.png'),
  },
  {
    key: 'shihua',
    label: '石化',
    source: require('@/assets/icons/shihua.png'),
  },
  {
    key: 'shouqianba',
    label: '收钱吧',
    source: require('@/assets/icons/shouqianba.png'),
  },
  {
    key: 'xiong',
    label: '小熊',
    source: require('@/assets/icons/xiong.png'),
  },
  {
    key: 'yunshanfu',
    label: '云闪付',
    source: require('@/assets/icons/yunshanfu.png'),
  },
  {
    key: 'zhifutong',
    label: '支付通',
    source: require('@/assets/icons/zhifutong.png'),
  },
]

const STORAGE_KEY = 'payment-config-v1'

export default function HomeScreen() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [selectedAvatarKey, setSelectedAvatarKey] = useState<string>(avatarPresets[0]?.key ?? '')
  const [isHydrated, setIsHydrated] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (!raw) {
          if (isMounted) {
            setIsHydrated(true)
          }
          return
        }
        const parsed = JSON.parse(raw) as {
          form?: Partial<FormState>
          avatarKey?: string
        }
        if (isMounted) {
          setForm((prev) => ({ ...prev, ...(parsed.form ?? {}) }))
          const candidate = parsed.avatarKey
          const matched = avatarPresets.find((avatar) => avatar.key === candidate)?.key
          if (matched) {
            setSelectedAvatarKey(matched)
          }
          setIsHydrated(true)
        }
      } catch (error) {
        console.warn('加载配置失败', error)
        if (isMounted) {
          setIsHydrated(true)
        }
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    ;(async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            form,
            avatarKey: selectedAvatarKey,
          })
        )
      } catch (error) {
        console.warn('保存配置失败', error)
      }
    })()
  }, [form, selectedAvatarKey, isHydrated])

  const selectedAvatar = useMemo(() => {
    return avatarPresets.find((avatar) => avatar.key === selectedAvatarKey) ?? avatarPresets[0]
  }, [selectedAvatarKey])

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const isPreviewDisabled = useMemo(() => {
    return !form.storeName.trim() || !form.amount.trim() || !form.status.trim()
  }, [form.amount, form.status, form.storeName])


  const handlePreview = () => {
    if (isPreviewDisabled) return
    router.push({
      pathname: '/details',
      params: {
        ...form,
        avatarKey: selectedAvatar.key,
      },
    })
  }

  // useEffect(() => {
  //   handlePreview()
  // }, [selectedAvatar.key])

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 10 }}>

      <TouchableOpacity
          className={`mt-6 py-3.5 rounded-xl items-center ${isPreviewDisabled ? 'bg-blue-300' : 'bg-primary'}`}
          onPress={handlePreview}
          activeOpacity={0.8}
          disabled={isPreviewDisabled}
        >
          <Text className="text-base font-semibold text-white">预览详情页</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-semibold text-gray-900 mb-4">账单页面配置</Text>

        <Image source={selectedAvatar.source} className="rounded-full mr-3" style={{ width: 48, height: 48 }} />

        <Text className="text-base font-medium text-gray-700 mb-3">头像选择</Text>
        <View className="relative mb-6">
          <TouchableOpacity
            className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex-row items-center justify-between"
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Image source={selectedAvatar.source} className="rounded-full mr-3" style={{ width: 48, height: 48 }} />
              <Text className="text-base color-gray-900 font-medium">{selectedAvatar.label}</Text>
            </View>
            <Text className={`text-gray-400 text-sm ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View className="absolute top-full left-0 right-0 bg-white rounded-b-2xl border border-t-0 border-gray-200 max-h-72 z-10">
              <ScrollView className="max-h-72">
                {avatarPresets.map((avatar) => {
                  const isSelected = selectedAvatarKey === avatar.key
                  return (
                    <TouchableOpacity
                      key={avatar.key}
                      className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onPress={() => {
                        setSelectedAvatarKey(avatar.key)
                        setIsDropdownOpen(false)
                      }}
                      activeOpacity={0.7}
                    >
                      <Image source={avatar.source} className="rounded-full mr-3" style={{ width: 40, height: 40 }} />
                      <Text className={`text-base ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        {avatar.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
          <FormField
            label="店铺名称"
            value={form.storeName}
            onChangeText={(text) => handleChange('storeName', text)}
            placeholder="请输入店铺名称"
          />
          <FormField
            label="支付金额"
            value={form.amount}
            onChangeText={(text) => handleChange('amount', text)}
            placeholder="例如：-500.00"
            keyboardType="decimal-pad"
          />
          <FormField
            label="当前状态"
            value={form.status}
            onChangeText={(text) => handleChange('status', text)}
            placeholder="例如：支付成功"
          />
          <FormField
            label="支付时间"
            value={form.payTime}
            onChangeText={(text) => handleChange('payTime', text)}
            placeholder="例如：2025年7月10日 21:53:38"
          />
          <FormField
            label="商品信息"
            value={form.productName}
            onChangeText={(text) => handleChange('productName', text)}
            placeholder="请输入商品信息"
            multiline
          />
          <FormField
            label="商户全称"
            value={form.merchantFullName}
            onChangeText={(text) => handleChange('merchantFullName', text)}
            placeholder="请输入商户全称"
            multiline
          />
          <FormField
            label="收单机构"
            value={form.acquiringInstitution}
            onChangeText={(text) => handleChange('acquiringInstitution', text)}
            placeholder="请输入收单机构"
          />
          <FormField
            label="清算说明"
            value={form.clearingDescription}
            onChangeText={(text) => handleChange('clearingDescription', text)}
            placeholder="请输入清算说明"
            multiline
          />
          <FormField
            label="支付方式"
            value={form.paymentMethod}
            onChangeText={(text) => handleChange('paymentMethod', text)}
            placeholder="例如：零钱"
          />
          <FormField
            label="支付说明"
            value={form.paymentNote}
            onChangeText={(text) => handleChange('paymentNote', text)}
            placeholder="请输入支付说明"
            multiline
          />
          <FormField
            label="交易单号"
            value={form.transactionId}
            onChangeText={(text) => handleChange('transactionId', text)}
            placeholder="请输入交易单号"
          />
          <FormField
            label="商户单号提示"
            value={form.merchantOrderNote}
            onChangeText={(text) => handleChange('merchantOrderNote', text)}
            placeholder="请输入商户单号提示"
          />
          <FormField
            label="条形码编号"
            value={form.barcode}
            onChangeText={(text) => handleChange('barcode', text)}
            placeholder="请输入条形码编号"
          />
        </View>

        <TouchableOpacity
          className={`mt-6 py-3.5 rounded-xl items-center ${isPreviewDisabled ? 'bg-blue-300' : 'bg-primary'}`}
          onPress={handlePreview}
          activeOpacity={0.8}
          disabled={isPreviewDisabled}
        >
          <Text className="text-base font-semibold text-white">预览详情页</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

type FormFieldProps = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'decimal-pad'
  multiline?: boolean
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: FormFieldProps) {
  return (
    <View className="mb-3.5">
      <Text className="text-sm text-gray-500 mb-1.5">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        className={`border border-gray-300 rounded-xl px-3.5 py-2.5 text-base text-gray-900 bg-gray-50 ${
          multiline ? 'min-h-20 py-3' : ''
        }`}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  )
}
