const API_URL = 'http://localhost:5000/api';

export const api = {
    getProjects: async () => {
        try {
            console.log(`Fetching projects from ${API_URL}/projects...`);
            const res = await fetch(`${API_URL}/projects`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            console.log("Projects fetched:", data.length);
            return data;
        } catch (error) {
            console.error("API Error (getProjects):", error);
            return [];
        }
    },
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
    getReports: async () => {
        try {
            const res = await fetch(`${API_URL}/reports`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("API Error (getReports):", error);
            return [];
        }
    }
};
