# F1 Laboratory

## Website - [F1 Laboratory](https://immastersam.github.io/F1-Laboratory/)

### Live Timing Data
![Live Timing](/public/image/Live%20Timing%20Page.png)

| Standings | Schedule |
|:-------:|:------------:|
![Live Timing](/public/image/Standings%20Page.png)|![Live Timing](/public/image/Schedule%20Page.png)|

## Data Source

| Source | Description |
|:-------|:------------|
|[FastF1](https://docs.fastf1.dev/)|For model training|
|[jolpi.ca F1 API](https://api.jolpi.ca/ergast/)|For results|

## Running the Project

### Frontend - Website
```sh
npm install
npm run dev
```

### Backend - api
We use [**uv**](https://pypi.org/project/uv/) to manage the Python environment and dependencies. You can install it using pip:
```sh
pip install uv
```
Then, you can run the API using the following command:
```sh
uv sync
uv run tui.py
```

---
> This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One Licensing B.V.