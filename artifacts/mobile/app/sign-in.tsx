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
import { useSignIn } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const isLoading = fetchStatus === 'fetching';

  const handleSignIn = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: () => {
          router.replace('/(tabs)');
        },
      });
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code: verifyCode });
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: () => {
          router.replace('/(tabs)');
        },
      });
    }
  };

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0);

  // MFA verification step
  if (signIn.status === 'needs_client_trust') {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: botPad },
        ]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.inner}>
          <Text style={[styles.title, { color: colors.primary }]}>التحقق من هويتك</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            أدخلي الرمز المرسل إلى بريدك الإلكتروني
          </Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.muted, color: colors.foreground }]}
            value={verifyCode}
            onChangeText={setVerifyCode}
            placeholder="رمز التحقق"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            textAlign="right"
          />
          {errors.fields.code && (
            <Text style={[styles.error, { color: colors.destructive }]}>{errors.fields.code.message}</Text>
          )}
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.primary, opacity: pressed || isLoading ? 0.75 : 1 }]}
            onPress={handleVerify}
            disabled={isLoading}
          >
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>تحقق</Text>
          </Pressable>
          <Pressable onPress={() => signIn.mfa.sendEmailCode()} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.secondary }]}>إعادة إرسال الرمز</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: topPad + 16, paddingBottom: botPad + 24 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </Pressable>

      <Animated.View entering={FadeInDown.delay(100)} style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={[styles.logoRing, { borderColor: colors.secondary }]}>
            <Ionicons name="moon" size={24} color={colors.secondary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.primary }]}>مرحباً بعودتك</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          سجلي دخولك للوصول إلى دروسك
        </Text>

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
          {errors.fields.identifier && (
            <Text style={[styles.error, { color: colors.destructive }]}>{errors.fields.identifier.message}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>كلمة المرور</Text>
          <View style={[styles.passwordRow, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
            <TextInput
              style={[styles.passwordInput, { color: colors.foreground }]}
              value={password}
              onChangeText={setPassword}
              placeholder="كلمة المرور"
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
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: colors.primary,
              opacity: pressed || isLoading || !email || !password ? 0.7 : 1,
            },
          ]}
          onPress={handleSignIn}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>جارٍ الدخول...</Text>
          ) : (
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>تسجيل الدخول</Text>
          )}
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={[styles.bottomText, { color: colors.mutedForeground }]}>ليس لديكِ حساب؟ </Text>
          <Link href="/sign-up" style={[styles.linkText, { color: colors.secondary }]}>
            إنشاء حساب
          </Link>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24 },
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { marginBottom: 8, alignSelf: 'flex-start' },
  inner: { flex: 1, gap: 16 },
  logoArea: { alignItems: 'center', marginBottom: 8 },
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
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  passwordRow: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: { paddingHorizontal: 12 },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingRight: 8,
  },
  error: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  bottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  bottomText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  linkText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  linkRow: { alignItems: 'center', marginTop: 8 },
});
