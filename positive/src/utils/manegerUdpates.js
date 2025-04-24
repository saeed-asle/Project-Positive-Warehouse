// src/utils/manegerUdpates
import { updateDoc, deleteDoc, collection,doc, query, where, getDocs ,getDoc} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { db } from './firebase';

export const handleDescriptionChange = async (productFields, value) => {
    if (value === '') {
        alert('הוסף תיאור');
        return;
    } 
    try {
        const productQuery = query(
            collection(db, 'products'),
            where('category', '==', productFields.category),
            where('subcategory', '==', productFields.subcategory),
            where('name', '==', productFields.name)
        );
        const querySnapshot = await getDocs(productQuery);
        if (querySnapshot.empty) {
            throw new Error('Product not found');
        }
        const productDoc = querySnapshot.docs[0];
        await updateDoc(productDoc.ref, { description: value });
        console.log('Product description updated successfully');
    } catch (error) {
        console.error('Error updating product description:', error);
    }
};

export const handleQuantityChange = async (productFields, value) => {
    value = Number(value);
    if (isNaN(value) || value < 0) {
        alert('הכמות לא חוקית');
        return;
    }
    try {
        const productQuery = query(
            collection(db, 'products'),
            where('category', '==', productFields.category),
            where('subcategory', '==', productFields.subcategory),
            where('name', '==', productFields.name)
        );
        const querySnapshot = await getDocs(productQuery);
        if (querySnapshot.empty) {
            throw new Error('Product not found');
        }
        const productDoc = querySnapshot.docs[0];
        await updateDoc(productDoc.ref, { quantity: value });
        console.log('Product quantity updated successfully');
    } catch (error) {
        console.error('Error updating product quantity:', error);
    }
};



export const handleImageChange = async (productFields, file) => {
    if (!file) return;

    try {
        // Directly reference the document using its ID
        const productDocRef = doc(db, 'products', productFields.id); // 'productFields.id' should be the document ID      
        // Fetch the document snapshot
        const productDocSnap = await getDoc(productDocRef);
        
        // Check if the document exists
        if (!productDocSnap.exists()) {
            console.error('No product found with the specified ID:', productFields.id);
            throw new Error('Product not found');
        }

        const productData = productDocSnap.data();
        // console.log('Retrieved document:', productData); 

        if (productData.imageURL) {
            const oldImageRef = ref(getStorage(), productData.imageURL);
            try {
                await deleteObject(oldImageRef);
                console.log('Old image deleted successfully');
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        const newImagePath = `products/${file.name}`;
        const storageRef = ref(getStorage(), newImagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);


        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    console.log('Upload progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100, '% done');
                },
                (error) => {
                    console.error('Error uploading image:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await updateDoc(productDocRef, { imageURL: newImagePath });
                        console.log('Product imageURL updated successfully');
                        resolve(downloadURL);  // Resolve with new download URL
                    } catch (error) {
                        console.error('Error updating product imageURL:', error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error updating product image:', error);
    }
};


export const handleDeleteProduct = async (productFields, setImageURLs) => {
    if (!productFields) {
        console.error('Invalid product:', productFields);
        return;
    }
    try {
        const productQuery = query(
            collection(db, 'products'),
            where('category', '==', productFields.category),
            where('subcategory', '==', productFields.subcategory),
            where('name', '==', productFields.name)
        );
        const querySnapshot = await getDocs(productQuery);
        if (querySnapshot.empty) {
            console.error('Product not found');
            return;
        }
        const productDoc = querySnapshot.docs[0];
        const productDocRef = doc(db, 'products', productDoc.id);
        await deleteDoc(productDocRef);
        const storage = getStorage();
        const imageRef = ref(storage, productFields.imageURL);

        try {
            await deleteObject(imageRef);
        } catch (error) {
             console.error('Error deleting image:', error);
        }
        setImageURLs((prev) => {
            const updated = { ...prev };
            delete updated[productFields.id];
            return updated;
        });
        alert('המוצר נמחק בהצלחה!');
        console.log('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};