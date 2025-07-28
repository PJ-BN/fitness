import React from 'react';
import styles from './NutritionPage.module.css';

const NutritionPage: React.FC = () => {
  return (
    <div className={styles.nutritionPageContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Nutrition Guide</h1>
        <p className={styles.pageSubtitle}>
          Understanding the fundamentals of nutrition for optimal health and fitness
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What is Nutrition?</h2>
        <p className={styles.sectionText}>
          Nutrition is the science that interprets the interaction of nutrients and other substances in food in relation to maintenance, growth, reproduction, health and disease of an organism. It includes food intake, absorption, assimilation, biosynthesis, catabolism and excretion.
        </p>
        <p className={styles.sectionText}>
          Good nutrition involves consuming a balanced diet that provides the right amounts of macronutrients (carbohydrates, proteins, and fats) and micronutrients (vitamins and minerals) to support optimal health.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Essential Nutrients</h2>
        <div className={styles.nutrientGrid}>
          <div className={styles.nutrientCard}>
            <h3>Carbohydrates</h3>
            <p className={styles.cardText}>Primary source of energy for the body and brain. Found in grains, fruits, and vegetables.</p>
            <div className={styles.benefit}>Energy Production</div>
            <div className={styles.caution}>Excess can lead to weight gain</div>
          </div>
          
          <div className={styles.nutrientCard}>
            <h3>Proteins</h3>
            <p className={styles.cardText}>Building blocks for muscles, enzymes, and hormones. Found in meat, fish, eggs, and legumes.</p>
            <div className={styles.benefit}>Muscle Repair & Growth</div>
            <div className={styles.caution}>Excess can strain kidneys</div>
          </div>
          
          <div className={styles.nutrientCard}>
            <h3>Fats</h3>
            <p className={styles.cardText}>Essential for hormone production and nutrient absorption. Found in nuts, oils, and fish.</p>
            <div className={styles.benefit}>Hormone Production</div>
            <div className={styles.caution}>Saturated fats can increase heart disease risk</div>
          </div>
          
          <div className={styles.nutrientCard}>
            <h3>Vitamins & Minerals</h3>
            <p className={styles.cardText}>Support various bodily functions and prevent deficiencies. Found in fruits, vegetables, and dairy.</p>
            <div className={styles.benefit}>Immune Support</div>
            <div className={styles.caution}>Excess of certain vitamins can be toxic</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Benefits of Proper Nutrition</h2>
        <ul className={styles.benefitsList}>
          <li>Increased energy levels and reduced fatigue</li>
          <li>Improved immune system function</li>
          <li>Better weight management</li>
          <li>Enhanced cognitive function and mood</li>
          <li>Reduced risk of chronic diseases (diabetes, heart disease, cancer)</li>
          <li>Stronger bones and muscles</li>
          <li>Faster recovery from illness and injury</li>
          <li>Improved sleep quality</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Potential Disadvantages of Poor Nutrition</h2>
        <ul className={styles.disadvantagesList}>
          <li>Increased risk of obesity and related health conditions</li>
          <li>Weakened immune system</li>
          <li>Decreased energy and fatigue</li>
          <li>Poor mental health and mood disorders</li>
          <li>Increased risk of chronic diseases</li>
          <li>Digestive problems</li>
          <li>Poor skin, hair, and nail health</li>
          <li>Slower wound healing</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nutrition Planning Guidelines</h2>
        <div className={styles.guidelines}>
          <div className={styles.guidelineCard}>
            <h3>Balanced Diet</h3>
            <p>Include a variety of foods from all food groups to ensure you get all essential nutrients.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Portion Control</h3>
            <p>Pay attention to serving sizes to avoid overeating, even with healthy foods.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Hydration</h3>
            <p>Drink plenty of water throughout the day - aim for at least 8 glasses.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Timing</h3>
            <p>Eat regular meals and snacks to maintain stable blood sugar levels.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Limit Processed Foods</h3>
            <p>Minimize intake of processed and ultra-processed foods high in added sugars, sodium, and unhealthy fats.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Personalization</h3>
            <p>Consider your individual needs based on age, gender, activity level, and health conditions.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Meal Prep</h3>
            <p>Plan and prepare meals in advance to ensure you have healthy options available.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Read Labels</h3>
            <p>Check nutrition labels for calorie content, serving sizes, and ingredients.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Plan for Special Occasions</h3>
            <p>Allow yourself occasional treats while maintaining overall healthy eating patterns.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Track Your Intake</h3>
            <p>Keep a food diary to identify patterns and areas for improvement.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Focus on Whole Foods</h3>
            <p>Prioritize minimally processed foods like fruits, vegetables, whole grains, and lean proteins.</p>
          </div>
          
          <div className={styles.guidelineCard}>
            <h3>Consider Supplements</h3>
            <p>Use supplements only when necessary and after consulting with a healthcare professional.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tipsSection}`}>
        <h2 className={styles.sectionTitle}>Quick Nutrition Tips</h2>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>1</span>
            <p>Fill half your plate with colorful fruits and vegetables</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>2</span>
            <p>Choose whole grains over refined grains</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>3</span>
            <p>Include a source of protein at every meal</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>4</span>
            <p>Snack on nuts and seeds instead of processed snacks</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>5</span>
            <p>Read nutrition labels to make informed choices</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>6</span>
            <p>Plan and prep meals in advance to avoid impulsive food choices</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>7</span>
            <p>Start your day with a nutritious breakfast to boost metabolism</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>8</span>
            <p>Use herbs and spices instead of salt to flavor your food</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>9</span>
            <p>Choose lean protein sources like fish, poultry, and legumes</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>10</span>
            <p>Incorporate healthy fats like avocados, olive oil, and nuts</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>11</span>
            <p>Eat slowly and mindfully to recognize fullness cues</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipNumber}>12</span>
            <p>Limit sugary drinks and opt for water or herbal teas</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NutritionPage;