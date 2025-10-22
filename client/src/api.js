// src/api.js

const API_URI = "https://snippet-vault-server.onrender.com";

// 1. Fetch all snippets
export async function fetchAllSnippets() {
  const response = await fetch(`${API_URI}/snippets`);
  if (!response.ok) {
    throw new Error("Failed to fetch snippets");
  }
  return response.json();
}

// 2. Create a new snippet
export async function createSnippet(snippetData) {
  const response = await fetch(`${API_URI}/snippets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(snippetData),
  });

  if (!response.ok) {
    // 409 is our "duplicate title" error
    if (response.status === 409) {
      throw new Error("A snippet with this title already exists");
    }
    throw new Error("Failed to create snippet");
  }
  return response.json();
}

// 3. Search snippets
export async function searchSnippets(query) {
  const response = await fetch(`${API_URI}/search?q=${query}`);
  if (!response.ok) {
    throw new Error("Failed to search snippets");
  }
  return response.json();
}

// 4. Filter by language
export async function filterByLanguage(lang) {
  const response = await fetch(`${API_URI}/snippets/lang/${lang}`);
  if (!response.ok) {
    throw new Error("Failed to filter snippets");
  }
  return response.json();
}

// 5. Delete a snippet
export async function deleteSnippet(id) {
  const response = await fetch(`${API_URI}/snippets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete snippet");
  }
  return response.json();
}