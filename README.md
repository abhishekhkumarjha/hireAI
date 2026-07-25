# HirePortal

A modern, highly optimized recruitment and talent acquisition portal designed for Indian-based corporate hiring. HirePortal features complete real-time synchronization, isolated portal views for administrators and recruiters, dynamic recruitment stage pipelines, and offline-resilient indexing.

## Key Features

- **Isolated Admin & Recruiter Portals**: Role-based access ensures that administrators have full control over permission configurations and billing metrics, while recruiters oversee candidate screening and selection.
- **Interactive Kanban Pipeline**: Breaks down the candidate hiring cycle into four clear, sequential stages:
  1. **Screening Call** (Auto-scheduler calendar integration)
  2. **Assessment** (Support for AI Agent evaluations or scheduled human meetings)
  3. **Verdict** (Review scorecard evaluations, select, or reject candidates)
  4. **Offer Letters** (Auto-template release and dynamic candidate signatures)
- **Real-Time Cross-Tab Syncing**: Leverages local storage listeners so recruiters and candidates see instantaneous state updates across open browser tabs.
- **Indian Market Localization**: Fully localized with Rupee (`₹`) currencies, Provident Fund (PF) configurations, and localized equipment allowances.
- **Offline Fallback Architecture**: Outfitted with robust local parsing, keyword search matches, and evaluation scorecards, preventing API disruptions if network services are unavailable.

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   ```

3. **Launch local Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the portal.

### Build and Compile for Production
To bundle assets and compile the server-side logic:
```bash
npm run build
```
