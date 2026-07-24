export type WebsiteResponse = {
    id: string,
    ticks: {
        response_ms: string,
        status: "Up" | "Down" | "Unknown"
    }[],
    url: string
}


export type Ticks = {
    id: string,
    created_at: string,
    region_id: string,
    response_ms: string,
    status: "Up" | "Down" | "Unknown",
    website_id: string
    region: {
        name: String
    }
}


export type WebsiteData = {
    id: string,
    url: string,
    user_id: string,
    ticks: Ticks[];
}



