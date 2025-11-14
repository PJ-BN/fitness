import { useCallback, useEffect, useMemo, useState } from 'react';
import { IntakeApi, FoodsApi } from '../apiclient/nutritionApi';
import type { DailySummary, IntakeEntry, Food, UpdateIntakeRequest } from '../types/nutrition';

interface UseDailyIntakeResult {
  date: string;
  foods: Food[];
  entries: IntakeEntry[];
  summary?: DailySummary;
  loading: boolean;
  error?: string;
  addEntry: (data: { foodId: string; quantityGrams: number; notes?: string }) => Promise<void>;
  updateEntry: (id: number, data: UpdateIntakeRequest) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
  totals: { calories: number; protein: number; carbs: number; fat: number };
}

export function useDailyIntake(date: string): UseDailyIntakeResult {
  const [foods, setFoods] = useState<Food[]>([]);
  const [entries, setEntries] = useState<IntakeEntry[]>([]);
  const [summary, setSummary] = useState<DailySummary | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const results = await Promise.allSettled([
        FoodsApi.list(),            // 0
        IntakeApi.list(date),       // 1
        IntakeApi.summary(date),    // 2
      ]);

      const foodsRes = results[0];
      const entriesRes = results[1];
      const summaryRes = results[2];

      if (foodsRes.status === 'fulfilled') {
        setFoods(foodsRes.value);
      } else {
        console.warn('Failed to load foods:', foodsRes.reason);
        setError(prev => (prev ? prev + ' | ' : '') + 'Foods load failed');
      }

      if (entriesRes.status === 'fulfilled') {
        setEntries(entriesRes.value);
      } else {
        console.warn('Failed to load intake entries:', entriesRes.reason);
        setError(prev => (prev ? prev + ' | ' : '') + 'Entries load failed');
      }

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      } else {
        console.warn('Failed to load daily summary:', summaryRes.reason);
        // Not critical; keep going
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load daily intake');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const addEntry = useCallback(async (data: { foodId: string; quantityGrams: number; notes?: string }) => {
    try {
      setLoading(true);
      await IntakeApi.create({ foodId: data.foodId, quantityGrams: data.quantityGrams, notes: data.notes });
      await load();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [load]);

  const updateEntry = useCallback(async (id: number, data: UpdateIntakeRequest) => {
    try { setLoading(true); await IntakeApi.update(id, data); await load(); } catch (e:any){ setError(e.message);} finally { setLoading(false);} }, [load]);

  const deleteEntry = useCallback(async (id: number) => {
    try { setLoading(true); await IntakeApi.delete(id); await load(); } catch (e:any){ setError(e.message);} finally { setLoading(false);} }, [load]);

  const totals = useMemo(() => {
    if (summary) return { calories: summary.totalCalories, protein: summary.protein, carbs: summary.carbs, fat: summary.fat };
    return entries.reduce((acc, cur) => {
      if (cur.food) {
  const factor = cur.quantityGrams / 100; // macros per 100g from backend
  acc.calories += cur.food.caloriesPer100g * factor;
  acc.protein += cur.food.proteinGramsPer100g * factor;
  acc.carbs += cur.food.carbsGramsPer100g * factor;
  acc.fat += cur.food.fatGramsPer100g * factor;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [summary, entries]);

  return { date, foods, entries, summary, loading, error, addEntry, updateEntry, deleteEntry, refresh: load, totals };
}
