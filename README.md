# Treadstone

This project aims to provide a tempalte UI that allows users to chart on IBKR datastreams. It is by no means finished, and will be undergoing constant improvements! 

This project has included pre-written indicators that are coded from scratch in Typescript, as well as multi-charting functionalities. In the home page, you will also see a built in Bloomberg news stream.

<img src="./assets/sample-dashboard.png" width="500px"/>

## Quick Start

1. Install frontend dependencies
```bash
cd frontend
yarn install # or whatever package manager
```
2. Install backend dependencies
```bash
conda activate my_env # or whatever virtual environment you are using
cd backend
pip install -e .
```
3. Set up your mongoDB 
```bash
MONGODB_URI="..."
# Database name should be 'finflow'
# Collection name should be 'all_tickers'
```
4. Spin up and login to your TWS workstation. Port should be running on `7497`.
5. Spin up frontend and backend 
```bash
cd backend && uvicorn backend.app.main:app --reload --port 1245
cd frontend && yarn start
```

And you should be good to go.

## Routes
At the moment, only the following routes are available
```bash
/ # For home bloomberg video feed
/charting # For custom charting
```