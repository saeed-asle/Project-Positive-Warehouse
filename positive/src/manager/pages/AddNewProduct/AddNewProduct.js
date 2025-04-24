import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../../../utils/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, listAll } from 'firebase/storage';
import './AddNewProduct.css';
import { Button } from 'react-bootstrap';
import Text from '../../components/Text/Text';

const AddNewProduct = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ description: '', quantity: '', imageURL: '', name: '' });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            const categoriesCollectionRef = collection(db, 'קטגוריות');
            const categorySnapshot = await getDocs(categoriesCollectionRef);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoryList);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchSubcategories = useCallback(async (categoryName) => {
        try {
            const categoryDocRef = query(collection(db, 'קטגוריות'), where('name', '==', categoryName));
            const categorySnapshot = await getDocs(categoryDocRef);

            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                setSubCategories(categoryDoc.data().subcategory || []);
            } else {
                setSubCategories([]);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        }
    }, [selectedCategory, fetchSubcategories]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const checkDuplicateImageName = async (fileName) => {
        try {
            const productsFolderRef = ref(storage, 'products');
            const listResult = await listAll(productsFolderRef);

            for (const itemRef of listResult.items) {
                if (itemRef.name === fileName) {
                    console.log('Duplicate found');
                    return true;
                }
            }

            console.log('No duplicate found');
            return false;
        } catch (error) {
            console.error('Error checking duplicate image name:', error);
            return false;
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.quantity || !selectedCategory || !selectedSubcategory || !selectedFile) {
            alert('עליך למלא את כל השדות.');
            return;
        }

        try {
            const fileName = selectedFile.name;

            // Check for duplicate image name
            const isDuplicate = await checkDuplicateImageName(fileName);
            if (isDuplicate) {
                alert('תמונה זו כבר קיימת במערכת.');
                return;
            }

            const relativePath = `products/${fileName}`;
            const storageRef = ref(storage, relativePath);
            await uploadBytes(storageRef, selectedFile);
            const imageURL = await getDownloadURL(storageRef);

            console.log('New image URL:', imageURL);

            const productData = {
                category: selectedCategory,
                subcategory: selectedSubcategory,
                name: newProduct.name,
                description: newProduct.description,
                quantity: parseInt(newProduct.quantity),
                imageURL: imageURL,
                imagePath: relativePath  // Store the relative path
            };

            const productsCollectionRef = collection(db, 'products');
            await addDoc(productsCollectionRef, productData);

            setNewProduct({ description: '', quantity: '', imageURL: '', name: '' });
            setSelectedCategory('');
            setSelectedSubcategory('');
            setSelectedFile(null);

            alert('המוצר נוסף בהצלחה');
            console.log('Product added successfully');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className='Add-new-product-body'>
            <Text className="text-title">הוספת מוצר</Text>
            <div className="add-product-container">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">בחר קטגוריה</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                    <option value="">בחר תת קטגוריה</option>
                    {subCategories.map((subCat, index) => (
                        <option key={index} value={subCat}>
                            {subCat}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="description"
                    placeholder="תיאור המוצר"
                    value={newProduct.description}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="כמות"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="שם המוצר"
                    value={newProduct.name}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                />
                <Button variant="link" onClick={handleAddProduct}>הוספת מוצר</Button>
            </div>
        </div>
    );
};

export default AddNewProduct;