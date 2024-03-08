import pandas as pd

data = pd.read_csv("data/raw/Player Totals.csv")

top10 = data[['season', 'player', 'pts', 'trb', 'ast']]

top10 = top10[top10['season'] == 2020].sort_values(by='pts', ascending=False)

top10 = top10[:10]

top10.to_csv("data/cleaned/top10.csv")