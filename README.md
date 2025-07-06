# ⚡ Azure Function Local Development

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) *(optional)*
- [Docker](https://www.docker.com/) *(optional, if you use services like Cosmos DB emulator)*
- VS Code + Azure Functions Extension *(optional but recommended)*

---

## 🚀 Running the Function App Locally

1. **Clone this repository**

```bash
git clone <YOUR_REPO_URL>
cd <project-folder>
```

2. **Install dependencies**

```bash
npm install
# or
bun install
```

3. **Create `local.settings.json` from template**

```bash
cp local.settings.template.json local.settings.json
```

> ⚠️ `local.settings.json` is ignored by Git. Fill it with your secret values (e.g., connection strings, API keys).

4. **Start the function app**

```bash
func start
```

If you're using TypeScript and need to compile:

```bash
npm run build
func start
```

---

## 🧪 Example Request

Assuming you're testing `UpdateTask` function:

```bash
curl -X POST http://localhost:7071/api/UpdateTask \
  -H "Content-Type: application/json" \
  -d '{"id":"123", "title":"Sample Task"}'
```

---

## 📁 Project Structure Example

```bash
.
├── api/
│   └── UpdateTask/index.ts
├── shared/
│   └── auth/
├── local.settings.json       ← ignored (created from template)
├── template.settings.json    ← settings template
├── package.json
└── ...
```

---

## 🛠 Bonus: Add Dev Script (Optional)

You can add this to your `package.json` to auto-generate the local settings and start the app:

```json
"scripts": {
  "dev": "cp template.settings.json local.settings.json && func start"
}
```

---

## ✅ Tips

- Do **not** commit `local.settings.json` — it contains sensitive data
- Use `.env` or environment variable manager if you want advanced config

---

Best regard Erick Marlendo Noviyanto ⚡
