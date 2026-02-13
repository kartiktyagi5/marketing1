import sys
import pandas as pd
import numpy as np
from scipy import stats

def perform_analysis(file_path):
    try:
        df = pd.read_csv(file_path)
        print(f"\n--- Statistical Research Report: {file_path} ---")
        print(f"Sample Size (N): {len(df)}")
        
        # Normalize columns
        df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
        
        # 1. Paired T-Test: Digital vs Offline Intent
        t_stat, p_val = stats.ttest_rel(df['d_intent'], df['o_intent'])
        print(f"\n[Paired T-Test: Purchase Intent]")
        print(f"t-statistic: {t_stat:.4f}")
        print(f"p-value: {p_val:.4f}")
        print(f"Verdict: {'Significant' if p_val < 0.05 else 'Not Significant'}")

        # 2. Paired T-Test: Digital vs Offline Trust
        t_stat_t, p_val_t = stats.ttest_rel(df['d_trust'], df['o_trust'])
        print(f"\n[Paired T-Test: Brand Trust]")
        print(f"t-statistic: {t_stat_t:.4f}")
        print(f"p-value: {p_val_t:.4f}")
        print(f"Verdict: {'Significant' if p_val_t < 0.05 else 'Not Significant'}")

        # 3. One-Way ANOVA: Intent across Age Groups
        groups = [group['d_intent'].values for name, group in df.groupby('age')]
        if len(groups) > 1:
            f_stat, p_val_a = stats.f_oneway(*groups)
            print(f"\n[One-Way ANOVA: Age vs Digital Intent]")
            print(f"F-statistic: {f_stat:.4f}")
            print(f"p-value: {p_val_a:.4f}")
            print(f"Verdict: {'Significant variance across age groups' if p_val_a < 0.05 else 'No significant variance'}")

        # 4. Chi-Square: Age vs Preference
        # (Simplified preference: which channel had higher intent)
        df['pref'] = np.where(df['d_intent'] >= df['o_intent'], 'Digital', 'Offline')
        contingency = pd.crosstab(df['age'], df['pref'])
        chi2, p, dof, ex = stats.chi2_contingency(contingency)
        print(f"\n[Chi-Square: Age vs Channel Preference]")
        print(f"Chi2: {chi2:.4f}")
        print(f"p-value: {p:.4f}")
        print(f"Verdict: {'Preference is age-dependent' if p < 0.05 else 'Preference is age-independent'}")

    except Exception as e:
        print(f"Error processing analysis: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python research_analyzer.py <csv_file>")
    else:
        perform_analysis(sys.argv[1])
