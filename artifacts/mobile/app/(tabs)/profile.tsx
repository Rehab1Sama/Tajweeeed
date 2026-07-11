import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useGetCurrentUser, useGetStudentDashboard } from '@workspace/api-client-react';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

function MenuItem({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      <Ionicons name="chevron-back" size={16} color={colors.mutedForeground} />
      <Text
        style={[
          styles.menuLabel,
          { color: danger ? colors.destructive : colors.foreground },
        ]}
      >
        {label}
      </Text>
      <Ionicons name={icon} size={20} color={danger ? colors.destructive : colors.primary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: localUser } = useGetCurrentUser();
  const { data: dashboard } = useGetStudentDashboard();

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0) + 8;
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 80;

  const name = localUser?.name ?? clerkUser?.fullName ?? 'طالبة';
  const email = localUser?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? '';
  const progressPct = dashboard?.totalRulesCount
    ? Math.round(((dashboard.masteredRulesCount ?? 0) / dashboard.totalRulesCount) * 100)
    : 0;

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      await signOut();
      router.replace('/');
      return;
    }
    Alert.alert('تسجيل الخروج', 'هل أنتِ متأكدة من تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج',
        style: 'destructive',
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar area */}
      <Animated.View entering={FadeInDown.delay(50)}>
        <View style={[styles.avatarSection, { backgroundColor: colors.primary }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.secondary + '30', borderColor: colors.secondary }]}>
            <Text style={[styles.avatarInitial, { color: colors.primaryForeground }]}>
              {name.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.primaryForeground }]}>{name}</Text>
          <Text style={[styles.userEmail, { color: 'rgba(249,245,235,0.7)' }]}>{email}</Text>

          {/* Role badge */}
          <View style={[styles.roleBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.roleText, { color: colors.secondaryForeground }]}>
              {localUser?.role === 'teacher' ? 'معلمة' : 'طالبة'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats summary */}
      <Animated.View entering={FadeInDown.delay(150)} style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {dashboard?.masteredRulesCount ?? 0}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>أحكام متقنة</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.secondary }]}>{progressPct}%</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>نسبة الإتقان</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {dashboard?.certificates?.length ?? 0}
            </Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>شهادات</Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu items */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>الحساب</Text>
        <MenuItem
          icon="person-outline"
          label="معلوماتي الشخصية"
          onPress={() => {}}
        />
        <MenuItem
          icon="notifications-outline"
          label="الإشعارات"
          onPress={() => {}}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>التعلم</Text>
        <MenuItem
          icon="book-outline"
          label="دروسي"
          onPress={() => router.push('/(tabs)/lessons')}
        />
        <MenuItem
          icon="bar-chart-outline"
          label="تقدمي"
          onPress={() => router.push('/(tabs)/progress')}
        />
        <MenuItem
          icon="ribbon-outline"
          label="شهاداتي"
          onPress={() => {}}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={[styles.section, { paddingHorizontal: 20 }]}>
        <MenuItem
          icon="log-out-outline"
          label="تسجيل الخروج"
          onPress={handleSignOut}
          danger
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 32,
    gap: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarInitial: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  userName: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  userEmail: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  roleBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 4,
  },
  roleText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  statsRow: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLbl: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, height: 40 },
  section: { marginTop: 20, paddingHorizontal: 20, gap: 10 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', textAlign: 'right' },
});
