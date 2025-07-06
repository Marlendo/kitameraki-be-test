# ⚡ Azure Function Local Development

## 🌐 Live Demo Endpoints

The following public Azure Function endpoints are available for demo and testing purposes:

- [CreateOrUpdateSchema](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/createorupdateschema)
- [DeleteTask](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/deletetask)
- [GetSchema](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/getschema)
- [GetTasks](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/gettasks)
- [InsertTask](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/inserttask)
- [UpdateTask](https://erick-kitameraki-test-f4bnabcddud4bkbp.indonesiacentral-01.azurewebsites.net/api/updatetask)

Feel free to test them using Postman, cURL, or directly from your frontend.

---

## 🧰 Prerequisites

Make sure the following tools are installed on your system:

- [Node.js](https://nodejs.org/)
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) *(optional)*
- [Docker](https://www.docker.com/) *(optional – useful for services like Cosmos DB emulator)*
- Visual Studio Code with Azure Functions Extension *(recommended)*

---

## 🚀 Running the Function App Locally

1. **Clone the repository**

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

> ⚠️ `local.settings.json` is excluded from version control. Populate it with your secrets (e.g., connection strings, API keys).

4. **Start the function app**

```bash
func start
```

If using TypeScript and compilation is needed:

```bash
npm run build
func start
```

---

## 🧪 Example Request

Example cURL request for testing the `UpdateTask` function:

```bash
curl -X POST http://localhost:7071/api/UpdateTask \
  -H "Content-Type: application/json" \
  -d '{"id":"123", "title":"Sample Task"}'
```

---

## 📁 Project Structure Overview

```bash
.
├── api/
│   └── UpdateTask/index.ts
├── shared/
│   └── auth/
├── local.settings.json         ← ignored (generated from template)
├── local.settings.template.json
├── package.json
└── ...
```

---

## 🛠 Optional: Add Development Script

To streamline local development, you can add this script to your `package.json`:

```json
"scripts": {
  "dev": "cp template.settings.json local.settings.json && func start"
}
```

---

## ✅ Tips

- Do **not** commit `local.settings.json` — it contains sensitive credentials.
- Use `.env` or environment variable managers for advanced secret management.
- Use Azure Emulator for local testing (e.g., Cosmos DB, Storage) if needed.

---

Best regards,  
**Erick Marlendo Noviyanto** ⚡
