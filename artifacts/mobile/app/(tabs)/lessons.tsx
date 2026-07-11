import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useListLessons } from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import type { Lesson } from '@workspace/api-client-react';

function LessonCard({ lesson, onPress }: { lesson: Lesson; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardInner}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="play-circle-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, { color: colors.primary }]} numberOfLines={2}>
            {lesson.title}
          </Text>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]} numberOfLines={1}>
            {lesson.content.replace(/<[^>]*>/g, '').slice(0, 60)}
          </Text>
        </View>
        <Ionicons name="chevron-back" size={18} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

function SectionHeader({ title, level }: { title: string; level: string }) {
  const colors = useColors();
  return (
    <View style={[styles.sectionHeader, { borderColor: colors.border }]}>
      <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
        <Text style={[styles.levelBadgeText, { color: colors.primaryForeground }]}>
          {level}
        </Text>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
    </View>
  );
}

export default function LessonsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: lessons, isLoading, refetch } = useListLessons();

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0) + 8;
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 80;

  const level1 = (lessons ?? [])
    .filter((l) => l.level === 1)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const level2 = (lessons ?? [])
    .filter((l) => l.level === 2)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  type Item =
    | { type: 'header1' }
    | { type: 'header2' }
    | { type: 'lesson'; data: Lesson }
    | { type: 'empty'; msg: string };

  const items: Item[] = [
    { type: 'header1' },
    ...(level1.length > 0
      ? level1.map((l) => ({ type: 'lesson' as const, data: l }))
      : [{ type: 'empty' as const, msg: 'لا توجد دروس في هذا المستوى حالياً' }]),
    { type: 'header2' },
    ...(level2.length > 0
      ? level2.map((l) => ({ type: 'lesson' as const, data: l }))
      : [{ type: 'empty' as const, msg: 'لا توجد دروس في هذا المستوى حالياً' }]),
  ];

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingPulse, { backgroundColor: colors.muted }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item, i) =>
          item.type === 'lesson' ? String(item.data.id) : `${item.type}-${i}`
        }
        contentContainerStyle={{
          paddingTop: topPad,
          paddingBottom: botPad,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!items.length}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.pageTitle, { color: colors.primary }]}>
              الدروس التعليمية
            </Text>
            <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>
              دروس مرئية ومكتوبة مقسمة حسب المستويات
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'header1') {
            return <SectionHeader title="المستوى الأول: التأسيس" level="١" />;
          }
          if (item.type === 'header2') {
            return <SectionHeader title="المستوى الثاني: التطبيق" level="٢" />;
          }
          if (item.type === 'empty') {
            return (
              <View style={[styles.emptyCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  {item.msg}
                </Text>
              </View>
            );
          }
          return (
            <LessonCard
              lesson={item.data}
              onPress={() => router.push(`/lesson/${item.data.id}`)}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingPulse: { width: 200, height: 20, borderRadius: 10 },
  header: { marginBottom: 20 },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  pageSub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  cardSub: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  emptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
