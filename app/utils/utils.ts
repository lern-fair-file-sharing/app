import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerAsset, DocumentPickerResult } from "expo-document-picker";


export enum LastModified {
    LAST_THREE_HOURS,
    TODAY,
    THIS_WEEK,
    OLDER
}


export const PERSONAL_SPACE_FOLDER_NAME = "Persönliche Ablage";


export function getTimeFrame(dateTimeString: string): LastModified {
    try {
        const dateTime = new Date(dateTimeString);
        const now = new Date();

        // Check if time is from the last 3 hours
        const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
        if (dateTime >= threeHoursAgo) {
            return LastModified.LAST_THREE_HOURS;
        }

        // Check if time is from today
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (dateTime >= startOfToday) {
            return LastModified.TODAY;
        }

        // Check if time is from this week
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek.getTime() + (7 * 24 * 60 * 60 * 1000));
        if (dateTime >= startOfWeek && dateTime <= endOfWeek) {
            return LastModified.THIS_WEEK;
        }

        return LastModified.OLDER;
    } catch (error) {
        console.error(`Error: Could not parse date time string '${dateTimeString}'`, error);
        return LastModified.OLDER;
    }
}


export async function pickFileFromDevice(): Promise<{blob: Blob, fileName: string} | void> {
    try {
        let result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({});
        if (result?.assets) {
            const uploadedAsset: DocumentPickerAsset = result.assets[0];
            
            return fetch(uploadedAsset.uri)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`FILE error - status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    return {
                        blob: blob,
                        fileName: uploadedAsset.name
                    }
                })
                .catch(error => {
                    throw error;
                });
        }
    }
    catch (error) {
        console.error("Error picking document:", error);
    }
}


export const getCurrentDateTimeString = () => {
    const now = new Date();
  
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
  
    return `${hours}:${minutes}T${day}-${month}-${year}`;
  };