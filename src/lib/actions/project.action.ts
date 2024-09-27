// src/actions/fetchMetadata.ts

import { Console } from "console";

export async function fetchMetadataFromUri(uri: string) {
  try {
    const response = await fetch(uri, {
      headers: {
        Accept: "application/json", // Specify that you are expecting JSON
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error("Error fetching metadata from URI:", error);
    throw error;
  }
}
