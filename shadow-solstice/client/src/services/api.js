// shadow-solstice/client/src/services/api.js

// Using a relative path for Vercel deployment so it routes through the proxy correctly
const API_URL = '/api';

export const api = {
    /**
     * Fetches all projects and maps flat Supabase fields to the nested 
     * structure expected by components like StatCard and ProjectCard.
     */
    getProjects: async () => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            
            // Map flat database fields to nested frontend objects
            return data.map(p => ({
                ...p,
                price: { 
                    current: p.price_current, 
                    change_24h_value: p.change_24h_value,
                    change_24h_percent: p.change_24h_percent 
                },
                stats: { 
                    volume: p.volume, 
                    rating: p.rating, 
                    visual_score: p.visual_score 
                },
                verification: { 
                    agency: p.agency, 
                    verified: p.verified 
                }
            }));
        } catch (error) {
            console.error("API Error (getProjects):", error);
            return [];
        }
    },

    /**
     * Fetches market statistics.
     */
    getMarketStats: async () => {
        try {
            const res = await fetch(`${API_URL}/stats`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getMarketStats):", error);
            return null;
        }
    },

    /**
     * Fetches market news, including dynamically generated "live" items.
     */
    getNews: async () => {
        try {
            const res = await fetch(`${API_URL}/news`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getNews):", error);
            return [];
        }
    },

    /**
     * Fetches user portfolio and its associated holdings.
     */
    getPortfolio: async () => {
        try {
            const res = await fetch(`${API_URL}/portfolio`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getPortfolio):", error);
            return null;
        }
    },

    /**
     * Fetches the order history.
     */
    getOrders: async () => {
        try {
            const res = await fetch(`${API_URL}/orders`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getOrders):", error);
            return [];
        }
    },

    /**
     * Fetches generated reports and documents.
     */
    getReports: async () => {
        try {
            const res = await fetch(`${API_URL}/reports`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getReports):", error);
            return [];
        }
    },

    /**
     * Executes a Buy or Sell trade.
     */
    executeTrade: async (tradeData) => {
        try {
            const res = await fetch(`${API_URL}/trade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tradeData),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (executeTrade):", error);
            throw error;
        }
    }
};
