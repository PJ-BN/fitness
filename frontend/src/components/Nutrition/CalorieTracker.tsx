import React, { useState } from 'react';
import { useDailyIntake } from '../../hooks/useDailyIntake';
import type { Food, IntakeEntry } from '../../types/nutrition';
import styles from './CalorieTracker.module.css';

function formatDateInput(d: Date){ return d.toISOString().split('T')[0]; }

const todayStr = formatDateInput(new Date());

const CalorieTracker: React.FC = () => {
  const [date, setDate] = useState<string>(todayStr);
  const { foods, entries, totals, addEntry, deleteEntry, loading, error } = useDailyIntake(date);
  const [foodId, setFoodId] = useState<string | undefined>();
  const [quantityGrams, setQuantityGrams] = useState<number>(100);
  const [notes, setNotes] = useState('');

  const selectedFood: Food | undefined = foods.find(f => f.id === foodId);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!foodId || quantityGrams <= 0) return; // basic validation
  await addEntry({ foodId, quantityGrams, notes });
    setQuantityGrams(100);
    setNotes('');
  };

  const handleDelete = async (entry: IntakeEntry) => {
    if(window.confirm('Delete entry?')){
      await deleteEntry(entry.id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Add Intake</h3>
        </div>
        <input
          type="date"
          className={styles.select + ' ' + styles.datePicker}
          value={date}
          max={todayStr}
          onChange={e=>setDate(e.target.value)}
        />
        <form className={styles.form} onSubmit={handleAdd}>
          <select className={styles.select} value={foodId ?? ''} onChange={e=>setFoodId(e.target.value || undefined)} required>
            <option value="">Select Food...</option>
            {foods.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.caloriesPer100g} kcal/100g)</option>
            ))}
          </select>
          <input className={styles.input} type="number" min={1} value={quantityGrams} onChange={e=>setQuantityGrams(Number(e.target.value))} placeholder="Quantity (g)" />
          {selectedFood && (
            <div className={styles.macrosRow}>
              <span className={styles.badge}>≈ {(selectedFood.caloriesPer100g * (quantityGrams/100)).toFixed(0)} kcal</span>
              <span className={styles.badge}>P {(selectedFood.proteinGramsPer100g * (quantityGrams/100)).toFixed(1)}</span>
              <span className={styles.badge}>C {(selectedFood.carbsGramsPer100g * (quantityGrams/100)).toFixed(1)}</span>
              <span className={styles.badge}>F {(selectedFood.fatGramsPer100g * (quantityGrams/100)).toFixed(1)}</span>
            </div>
          )}
          <input className={styles.input} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes (optional)" />
          <button className={styles.button} disabled={loading}>{loading ? <span className={styles.spinner}/> : 'Add Entry'}</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}><span className={styles.summaryLabel}>Calories</span><span className={styles.summaryValue}>{totals.calories.toFixed(0)}</span></div>
          <div className={styles.summaryCard}><span className={styles.summaryLabel}>Protein</span><span className={styles.summaryValue}>{totals.protein.toFixed(1)}g</span></div>
            <div className={styles.summaryCard}><span className={styles.summaryLabel}>Carbs</span><span className={styles.summaryValue}>{totals.carbs.toFixed(1)}g</span></div>
            <div className={styles.summaryCard}><span className={styles.summaryLabel}>Fat</span><span className={styles.summaryValue}>{totals.fat.toFixed(1)}g</span></div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Entries</h3>
        </div>
        <ul className={styles.entryList}>
          {entries.length === 0 && <li className={styles.empty}>No entries logged for this date.</li>}
          {entries.map(entry => (
            <li key={entry.id} className={styles.entryItem}>
              <div style={{flex:1}}>
                <strong>{entry.food?.name || `#${entry.foodId}`}</strong>
                <div className={styles.macrosRow}>
                  {entry.food && (
                    <>
                      <span className={styles.badge}>{(entry.food.caloriesPer100g * (entry.quantityGrams/100)).toFixed(0)} kcal</span>
                      <span className={styles.badge}>P {(entry.food.proteinGramsPer100g * (entry.quantityGrams/100)).toFixed(1)}</span>
                      <span className={styles.badge}>C {(entry.food.carbsGramsPer100g * (entry.quantityGrams/100)).toFixed(1)}</span>
                      <span className={styles.badge}>F {(entry.food.fatGramsPer100g * (entry.quantityGrams/100)).toFixed(1)}</span>
                    </>
                  )}
                </div>
                <small>{entry.quantityGrams} g {entry.notes && `• ${entry.notes}`}</small>
              </div>
              <div className={styles.inlineActions}>
                <button type="button" className={styles.smallBtn + ' ' + styles.danger} onClick={()=>handleDelete(entry)}>Del</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalorieTracker;
