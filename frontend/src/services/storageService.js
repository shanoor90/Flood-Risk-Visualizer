import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const storageService = {
  // Upload a file (e.g., photo of a flood area)
  uploadFile: async (filePath, folder = "uploads") => {
    try {
      // For mobile apps, you usually get a URI. This is a simplified web/expo version.
      const response = await fetch(filePath);
      const blob = await response.blob();
      
      const fileName = filePath.split('/').pop();
      const storageRef = ref(storage, `${folder}/${Date.now()}_${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }
};
