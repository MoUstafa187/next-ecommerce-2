import { Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(limit = 30, skip = 0): Promise<ProductsResponse> {
    const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`, {
        next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    return res.json();
}

export async function getProductById(id: number | string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch product with id: ${id}`);
    }

    return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
    return getProductById(slug);
}

export async function searchProducts(query: string, limit = 30, skip = 0): Promise<ProductsResponse> {
    const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`, {
        next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
        throw new Error("Failed to search products");
    }

    return res.json();
}

export async function getProductsByCategory(category: string, limit = 30, skip = 0): Promise<ProductsResponse> {
    const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`, {
        next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch products in category: ${category}`);
    }

    return res.json();
}

export async function getCategories(): Promise<{ slug: string, name: string, url: string }[]> {
    const res = await fetch(`${BASE_URL}/products/categories`, {
        next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch product categories");
    }

    return res.json();
}
