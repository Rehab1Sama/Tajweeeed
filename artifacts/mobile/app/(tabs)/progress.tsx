import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import {
  useListTajweedRules,
  useGetStudentProgress,
} from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import type { TajweedRule, ProgressEntry } from '@workspace/api-client-react';

const MASTERY_LABELS = ['لم تبدأ', 'قيد التعلم', 'متقنة'] as const;
const MASTERY_COLORS = ['#DDD1B8', '#C89428', '#0D5454'] as const;

function RuleCard({
  rule,
  progress,
}: {
  rule: TajweedRule;
  progress?: ProgressEntry;
}) {
  const colors = useColors();
  const mastery = progress?.masteryLevel ?? 0;
  const masteryColor = MASTERY_COLORS[mastery] ?? MASTERY_COLORS[0];
  const masteryLabel = MASTERY_LABELS[mastery] ?? MASTERY_LABELS[0];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.masteryDot, { backgroundColor: masteryColor }]} />
        <View style={styles.cardInfo}>
          <Text style={[styles.ruleName, { color: colors.primary }]}>
            {rule.nameAr}
          </Text>
          <Text style={[styles.ruleNameEn, { color: colors.mutedForeground }]}>
            {rule.nameEn}
          </Text>
        </View>
        <View style={[styles.masteryBadge, { backgroundColor: masteryColor + '20' }]}>
          <Text style={[styles.masteryText, { color: masteryColor }]}>
            {masteryLabel}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.barBg, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: masteryColor,
              width: `${(mastery / 2) * 100}%`,
            },
          ]}
        />
      </View>

      {rule.example ? (
        <Text style={[styles.example, { color: colors.mutedForeground }]} numberOfLines={1}>
          مثال: {rule.example}
        </Text>
      ) : null}
    </View>
  );
}

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: rules, isLoading: rulesLoading, refetch } = useListTajweedRules();
  const { data: progressEntries, isLoading: progressLoading } = useGetStudentProgress();

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0) + 8;
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 80;
  const isLoading = rulesLoading || progressLoading;

  const progressMap = Object.fromEntries(
    (progressEntries ?? []).map((p) => [p.ruleId, p])
  );

  const masteredCount = (progressEntries ?? []).filter(
    (p) => p.masteryLevel === 2
  ).length;
  const inProgressCount = (progressEntries ?? []).filter(
    (p) => p.masteryLevel === 1
  ).length;

  const level1Rules = (rules ?? []).filter((r) => r.level === 1).sort((a, b) => a.orderIndex - b.orderIndex);
  const level2Rules = (rules ?? []).filter((r) => r.level === 2).sort((a, b) => a.orderIndex - b.orderIndex);

  type Item =
    | { type: 'header'; label: string; count: number }
    | { type: 'rule'; rule: TajweedRule };

  const items: Item[] = [
    { type: 'header', label: 'المستوى الأول', count: level1Rules.length },
    ...level1Rules.map((r) => ({ type: 'rule' as const, rule: r })),
    { type: 'header', label: 'المستوى الثاني', count: level2Rules.length },
    ...level2Rules.map((r) => ({ type: 'rule' as const, rule: r })),
  ];

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.pulse, { backgroundColor: colors.muted }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item, i) =>
          item.type === 'rule' ? String(item.rule.id) : `hdr-${i}`
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
            <Text style={[styles.pageTitle, { color: colors.primary }]}>خريطة التقدم</Text>
            <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>
              مستوى إتقانكِ لأحكام التجويد
            </Text>

            {/* Summary pills */}
            <View style={styles.summaryRow}>
              <View style={[styles.pill, { backgroundColor: '#0D5454' + '15' }]}>
                <Ionicons name="checkmark-circle" size={15} color="#0D5454" />
                <Text style={[styles.pillText, { color: '#0D5454' }]}>
                  {masteredCount} متقن
                </Text>
              </View>
              <View style={[styles.pill, { backgroundColor: '#C89428' + '15' }]}>
                <Ionicons name="time" size={15} color="#C89428" />
                <Text style={[styles.pillText, { color: '#C89428' }]}>
                  {inProgressCount} قيد التعلم
                </Text>
              </View>
              <View style={[styles.pill, { backgroundColor: colors.muted }]}>
                <Ionicons name="ellipse-outline" size={15} color={colors.mutedForeground} />
                <Text style={[styles.pillText, { color: colors.mutedForeground }]}>
                  {(rules?.length ?? 0) - masteredCount - inProgressCount} لم تبدأ
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={[styles.sectionHeader, { borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {item.label}
                </Text>
                <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                  {item.count} أحكام
                </Text>
              </View>
            );
          }
          return (
            <RuleCard
              rule={item.rule}
              progress={progressMap[item.rule.id]}
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
  pulse: { width: 200, height: 20, borderRadius: 10 },
  header: { marginBottom: 16 },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  pageSub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'right', marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionCount: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  masteryDot: { width: 10, height: 10, borderRadius: 5 },
  cardInfo: { flex: 1, gap: 2 },
  ruleName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  ruleNameEn: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  masteryBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  masteryText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  barBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  example: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'right' },
});
