import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSignUp } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const isLoading = fetchStatus === 'fetching';
  const isVerifyStep =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0);

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code: verifyCode });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: () => {
          router.replace('/(tabs)');
        },
      });
    }
  };

  // Verification code step
  if (isVerifyStep) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: topPad + 16, paddingBottom: botPad + 24 },
        ]}
      >
        <Animated.View entering={FadeInDown.delay(100)} style={styles.inner}>
          <View style={styles.logoArea}>
            <View style={[styles.logoRing, { borderColor: colors.secondary }]}>
              <Ionicons name="mail-open-outline" size={24} color={colors.secondary} />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>تحقق من بريدك</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            أرسلنا رمزاً من 6 أرقام إلى {email}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>رمز التحقق</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.muted, color: colors.foreground, textAlign: 'center', fontSize: 22, letterSpacing: 8 }]}
              value={verifyCode}
              onChangeText={setVerifyCode}
              placeholder="------"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.fields.code && (
              <Text style={[styles.error, { color: colors.destructive }]}>{errors.fields.code.message}</Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.primary, opacity: pressed || isLoading || verifyCode.length < 6 ? 0.7 : 1 }]}
            onPress={handleVerify}
            disabled={isLoading || verifyCode.length < 6}
          >
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              {isLoading ? 'جارٍ التحقق...' : 'تأكيد'}
            </Text>
          </Pressable>

          <Pressable onPress={() => signUp.verifications.sendEmailCode()} style={styles.resendRow}>
            <Text style={[styles.linkText, { color: colors.secondary }]}>إعادة إرسال الرمز</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: botPad + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </Pressable>

      <Animated.View entering={FadeInDown.delay(100)} style={styles.inner}>
        <View style={styles.logoArea}>
          <View style={[styles.logoRing, { borderColor: colors.secondary }]}>
            <Ionicons name="moon" size={24} color={colors.secondary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.primary }]}>إنشاء حساب جديد</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          انضمي إلى مجتمع طالبات التجويد
        </Text>

        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>الاسم الكامل</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.muted, color: colors.foreground }]}
            value={name}
            onChangeText={setName}
            placeholder="اسمك الكامل"
            placeholderTextColor={colors.mutedForeground}
            textAlign="right"
          />
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>البريد الإلكتروني</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.muted, color: colors.foreground }]}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            keyboardType="email-address"
            textAlign="right"
          />
          {errors.fields.emailAddress && (
            <Text style={[styles.error, { color: colors.destructive }]}>{errors.fields.emailAddress.message}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>كلمة المرور</Text>
          <View style={[styles.passwordRow, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mutedForeground} />
            </Pressable>
            <TextInput
              style={[styles.passwordInput, { color: colors.foreground }]}
              value={password}
              onChangeText={setPassword}
              placeholder="8 أحرف على الأقل"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPassword}
              textAlign="right"
            />
          </View>
          {errors.fields.password && (
            <Text style={[styles.error, { color: colors.destructive }]}>{errors.fields.password.message}</Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.primary, opacity: pressed || isLoading || !email || !password ? 0.7 : 1 }]}
          onPress={handleSignUp}
          disabled={isLoading || !email || !password}
        >
          <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
            {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
          </Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={[styles.bottomText, { color: colors.mutedForeground }]}>لديكِ حساب بالفعل؟ </Text>
          <Link href="/sign-in" style={[styles.linkText, { color: colors.secondary }]}>
            تسجيل الدخول
          </Link>
        </View>

        {/* Required for Clerk bot protection */}
        <View nativeID="clerk-captcha" />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24 },
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { marginBottom: 8, alignSelf: 'flex-start' },
  inner: { gap: 16 },
  logoArea: { alignItems: 'center', marginBottom: 4 },
  logoRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200,148,40,0.08)',
  },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  sub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: -8 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'right' },
  input: { height: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 15, fontFamily: 'Inter_400Regular' },
  passwordRow: { height: 48, borderWidth: 1, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 12 },
  passwordInput: { flex: 1, height: 48, fontSize: 15, fontFamily: 'Inter_400Regular', paddingRight: 8 },
  error: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  primaryBtn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  bottomRow: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  bottomText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  linkText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  resendRow: { alignItems: 'center', marginTop: 4 },
});
