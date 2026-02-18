import sys
import pandas as pd
import numpy as np
from scipy import stats
import google.generativeai as genai
import traceback

# --- GEMINI CONFIGURATION ---
GEMINI_API_KEY = "AIzaSyCQ7K8xGRA0qlg0hwdK80E7YCCNgi3CSdk"
genai.configure(api_key=GEMINI_API_KEY)

def get_best_model():
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        # Prefer flash 1.5, then pro, then any
        for m in models:
            if 'gemini-1.5-flash' in m: return m
        for m in models:
            if 'gemini-pro' in m: return m
        return models[0] if models else None
    except:
        return 'gemini-pro' # Fallback default

MODEL_NAME = get_best_model() or 'gemini-1.5-flash'
model = genai.GenerativeModel(MODEL_NAME)

def perform_analysis(file_path):
    try:
        df = pd.read_csv(file_path)
        print(f"\n" + "="*60)
        print(f"🚀 CLICKS-TO-BRICKS: AI-POWERED RESEARCH INTELLIGENCE")
        print(f"="*60)
        print(f"Dataset: {file_path}")
        print(f"Sample Size (N): {len(df)}")
        print(f"AI Model: {MODEL_NAME}")
        
        # Normalize columns
        df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
        
        # Ensure numeric conversion
        for col in ['d_intent', 'o_intent', 'd_trust', 'o_trust']:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        # 1. Paired T-Test: Purchase Intent
        t_stat, p_val = stats.ttest_rel(df['d_intent'], df['o_intent'])
        intent_verdict = 'Significant preference detected' if p_val < 0.05 else 'No dominant channel preference'

        # 2. Paired T-Test: Brand Trust
        t_stat_t, p_val_t = stats.ttest_rel(df['d_trust'], df['o_trust'])
        trust_verdict = 'Significant trust variance' if p_val_t < 0.05 else 'Trust is channel-neutral'

        # 3. One-Way ANOVA: Age vs Intent
        anova_summary = "Insufficient groups for ANOVA"
        p_val_a = 1.0
        valid_groups = [group['d_intent'].values for name, group in df.groupby('age') if len(group) > 0]
        if len(valid_groups) > 1:
            f_stat, p_val_a = stats.f_oneway(*valid_groups)
            anova_summary = f"Variance is {'statistically significant' if p_val_a < 0.05 else 'not significant'}"

        # 4. Chi-Square: Age vs Preference
        df['pref'] = np.where(df['d_intent'] >= df['o_intent'], 'Digital', 'Offline')
        contingency = pd.crosstab(df['age'], df['pref'])
        if not contingency.empty and contingency.sum().sum() > 0:
            chi2, p_chi, dof, ex = stats.chi2_contingency(contingency)
            chi_verdict = 'Preference is age-dependent' if p_chi < 0.05 else 'Preference is age-independent'
        else:
            p_chi = 1.0
            chi_verdict = "Insufficient data for Chi-Square"

        print(f"\n[📊 Statistical Core Results]")
        print(f"• Purchase Intent: p={p_val:.4f} ({intent_verdict})")
        print(f"• Brand Trust:    p={p_val_t:.4f} ({trust_verdict})")
        print(f"• Age Impact:     p={p_val_a:.4f} ({anova_summary})")
        print(f"• Demographic:    p={p_chi:.4f} ({chi_verdict})")

        # --- GEMINI AI POWERED INTERPRETATION ---
        print(f"\n[🧠 Gemini AI Strategic Analysis...]")
        
        avg_d_intent = df['d_intent'].mean()
        avg_o_intent = df['o_intent'].mean()
        avg_d_trust = df['d_trust'].mean()
        avg_o_trust = df['o_trust'].mean()
        
        prompt = f"""
        Analyze this marketing research dataset:
        Context: A study comparing Digital Marketing vs Offline Marketing.
        Sample Size: {len(df)} users.
        
        Statistical Results:
        1. Mean Digital Purchase Intent: {avg_d_intent:.2f} / 5
        2. Mean Offline Purchase Intent: {avg_o_intent:.2f} / 5
        3. Mean Digital Trust: {avg_d_trust:.2f} / 5
        4. Mean Offline Trust: {avg_o_trust:.2f} / 5
        5. T-Test (Intent) P-Value: {p_val:.4f}
        6. T-Test (Trust) P-Value: {p_val_t:.4f}
        7. ANOVA (Age vs Intent) P-Value: {p_val_a:.4f}
        8. Chi-Square (Demographic preference) P-Value: {p_chi:.4f}
        
        Task: 
        - Provide a sophisticated 3-paragraph business strategy.
        - Predict future market behavior for this brand.
        - Give specific tactical recommendations for different age groups based on the statistics.
        - If p-values are high, explain why the brand might be struggling to differentiate.
        - Focus on maximizing ROI.
        
        Keep the tone professional, data-driven, and visionary. Avoid generic advice.
        """
        
        try:
            response = model.generate_content(prompt)
            print("-" * 60)
            print(response.text)
            print("-" * 60)
        except Exception as ai_err:
            print(f"AI Generation Failed: {str(ai_err)}")
            print("Falling back to local interpretation...")
            print(f"Verdict: Success! Data processed with precision. Focus on {'Digital' if avg_d_intent > avg_o_intent else 'Offline'} based on raw averages.")

    except Exception as e:
        print(f"❌ Critical Error: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python research_analyzer.py <csv_file>")
    else:
        perform_analysis(sys.argv[1])
