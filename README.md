## Clone the repository
```bash
git clone https://github.com/your-username/financial-assistant.git
```

```bash
cd financial-assistant
```

## Switch to backend branch
```bash
git checkout backend
```

## Move to functions directory
```bash
cd functions
```

## Install dependencies
```bash
npm install
```

## Set up environment variables (Create a .env file)
```bash
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

## Run Firebase functions locally
```bash
firebase emulators:start --only functions
```

API will be available at: http://localhost:5001/financial-assistant-jart/us-central1/api/chat

## To deploy on Firebase:
```bash
firebase deploy --only functions
```

## Switch to frontend branch
```bash
git checkout frontend
```

## Move to Angular project directory
```bash
cd frontend
```

## Install dependencies
```bash
npm install
```

## Start Angular development server
```bash
ng serve
```

Frontend will be available at: http://localhost:4200

Ensure the backend is running before testing.
