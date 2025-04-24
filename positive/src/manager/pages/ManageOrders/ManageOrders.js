import React, { useState, useEffect } from "react";
import { useCombined } from "../../../context/CombinedContext";
import "./ManageOrders.css";
import { Button, Modal, Form } from 'react-bootstrap';
import { deleteDoc, doc, updateDoc, collection, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from "../../../utils/firebase";
import { selectfetchProducts, addProductToOrder } from "../../../utils/firebaseUtils";
import OrderFieldEditor from '../../components/OrderFieldEditor/OrderFieldEditor'; 
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'; 
import { notifiyLateOrder } from '../../../utils/emailSender';
import Text from '../../components/Text/Text'; 

const ManageOrders = () => {
  const {
    searchOrders,
    orders,
    category, 
    categories,
    setCategory,
    subCategory,
    setSubCategory,
    subCategories,
  } = useCombined();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    productName: "",
    selectedQuantity: 1,
    subcategory:"",
    category:"",
  });
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);

  const handleNotifyCreator = function(order) {
    return (target) => {
      const endDate = new Date(order.endDate);
      const currentDate = new Date();
      const day_since_return_date = Math.floor((currentDate - endDate) / (1000 * 60 * 60 * 24));
      notifiyLateOrder({
        name:  order.user.name,
        email: order.user.email,
        days_since_return_date: day_since_return_date
      }, order.products);
      setShowEmailSentModal(true); 
    }
  }

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [editedFields, setEditedFields] = useState({});
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(null);

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !(timestamp instanceof Date)) return '';
    const date = timestamp;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const convertToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return Timestamp.fromDate(date);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      alert(".בבקשה הכנס מייל, שם או מספר טלפון לשורת החיפוש");
      return; 
    }
    const searchParams = {
      userEmail: searchTerm.includes('@') ? searchTerm : "",
      userName: !searchTerm.includes('@') && !/^\d+$/.test(searchTerm) ? searchTerm : "",
      userPhone: /^\d+$/.test(searchTerm) ? searchTerm : ""
    };
      
    await searchOrders(searchParams);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditField = (orderId, field, value) => {
    setEditedFields({ ...editedFields, [orderId]: { ...editedFields[orderId], [field]: value } });
    updateOrderField(orderId, field, value);
  };

  const updateOrderField = async (orderId, field, value) => {
    try {
      let updateValue = value;
      if (['orderTime', 'endDate', 'startDate', 'orderDate'].includes(field)) {
        updateValue = convertToTimestamp(value);
      }

      await updateDoc(doc(db, "orders", orderId), { [field]: updateValue });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" });
    } catch (error) {
      console.error('Error updating order field:', error);
    }
  };
 
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      handleCloseModal();

      await searchOrders({ userEmail: "", userName: "", userPhone: "" }); 
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const moveToOld = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      const orderData = orderSnapshot.data();
      const oldOrdersCollection = collection(db, "oldOrders");
      await addDoc(oldOrdersCollection, orderData);
      await deleteDoc(orderRef);
      handleCloseModal();

      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 

    } catch (error) {
      console.error('Error moving order to oldOrders or deleting order:', error);
    }
  };

  const handleDeleteProduct = async (orderId, productId) => {
    try {

      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedProducts = orderToUpdate.products.filter(product => product.id !== productId);
      await updateDoc(doc(db, "orders", orderId), { products: updatedProducts });
      
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 
      handleCloseModal();
      setSelectedProductQuantity(null);

      console.log("product has been deleted");
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
 
  const handleEditProduct = async (orderId, productId, field, value) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedProducts = orderToUpdate.products.map(product =>
        product.id === productId ? { ...product, [field]: value } : product
      );
      await updateDoc(doc(db, "orders", orderId), { products: updatedProducts });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null);

      console.log("Product updated successfully in the order!");
    } catch (error) {
      console.error('Error editing product in the order:', error);
    }
  };

  const handleEditUserField = async (orderId, field, value) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedUser = { ...orderToUpdate.user, [field]: value };
      await updateDoc(doc(db, "orders", orderId), { user: updatedUser });
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, null); 
    } catch (error) {
      console.error('Error editing user field:', error);
    }
  };

  const handleAddProduct = async (orderId) => {
    try {
      const productToAdd = products.find(product => product.id === newProduct.id);
      if (!productToAdd) {
        alert(".אנא מלא את כל השדות");
        return;
      }
  
      if (newProduct.selectedQuantity > productToAdd.quantity) {
        alert(".הכמות חורגת מהמלאי הקיים");
        return;
      }
  
      const productData = {
        id: productToAdd.id,
        productName: productToAdd.name,
        selectedQuantity: newProduct.selectedQuantity,
        subcategory:productToAdd.subcategory,
        category:productToAdd.category,

      };
    
      await addProductToOrder(orderId, productData);
      await searchOrders({ userEmail: "", userName: "", userPhone: "" });
  
      setNewProduct({
        id: "",
        productName: "",
        selectedQuantity: 1,
        subcategory:"",
        category:"",
      });
      setSelectedCategory('');
      setSelectedSubCategory('');
      setSelectedProductQuantity(null);

      console.log("Product added successfully!");
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.message || ".שגיאה בעת הוספת מוצר. אנא נסה שנית");
    }
  };
  

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCategory(event.target.value);
    setSubCategory('');
    setSelectedSubCategory('');
  };

  const handleSubCategoryChange = (event) => { 
    setSubCategory(event.target.value);
    setSelectedSubCategory(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productList = await selectfetchProducts(selectedCategory, selectedSubCategory);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSubCategory]);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find(prod => prod.id === productId);
    if (product) {
      setNewProduct({ id: product.id, productName: product.name, selectedQuantity: 1 ,category:product.category,subcategory:product.subcategory});
      setSelectedProductQuantity(product.quantity);
    }
  };

  const handleFetchOldOrders = async () => {
    try{
      const now = new Date();
      const oldDateTimestamp = Timestamp.fromDate(now);
      setSearchTerm('');
      await searchOrders({ userEmail: "", userName: "", userPhone: "" }, oldDateTimestamp);

    } catch (error) {
      console.error('Error fetching old orders:', error);
      // await searchOrders(searchParams);
    }
  };

  const openConfirmModal = (action, title, body) => {
    setConfirmAction(() => action);
    setModalTitle(title);
    setModalBody(body);
    setShowConfirmModal(true);
  };



  const handleCloseModal = () => setShowConfirmModal(false);

  return (
    <div className="manage-orders-body">
      <Text className="text-title">ניהול הזמנות</Text>
      <div className="manage-orders">
        <div className="search-form">
          <Button className="custom-button-search" onClick={handleFetchOldOrders}>הזמנות ישנות</Button>
          <Button className="custom-button-search" onClick={() => handleSearch(searchTerm, searchOrders)}>חיפוש</Button>
          <input id="text-input"
            type="text"
            placeholder="חפש לפי מייל, שם או מספר נייד"
            onChange={handleSearchChange}
          />
        </div>
        <div className="orders-list">{orders.length === 0 ? (<p className="noOrdersHasFound">לא נמצאו הזמנות</p>) : 
          (orders.map((order, index) => (
            <div key={`${order.id}-${index}`} className="order">
              <strong>מספר הזמנה: {order.id}</strong>
              <div className="order-details">
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="orderDate"
                  currentValue={formatTimestamp(order.orderDate)}
                  handleEditField={handleEditField}
                />
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="startDate"
                  currentValue={formatTimestamp(order.startDate)}
                  handleEditField={handleEditField}
                />
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="endDate"
                  currentValue={formatTimestamp(order.endDate)}
                  handleEditField={handleEditField}
                />
                <strong>פרטי הלקוח:</strong> <br />
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="email"
                  currentValue={order.user.email}
                  handleEditField={(id, field, value) => handleEditUserField(id, 'email', value, orders, searchOrders)}
                />
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="name"
                  currentValue={order.user.name}
                  handleEditField={(id, field, value) => handleEditUserField(id, 'name', value, orders, searchOrders)}
                />
                <OrderFieldEditor
                  orderId={order.id}
                  fieldName="phone"
                  currentValue={order.user.phone}
                  handleEditField={(id, field, value) => handleEditUserField(id, 'phone', value, orders, searchOrders)}
                />
              </div>
              <strong>מוצרים שהלקוח הזמין:</strong>
              <ul>
                {order.products.map((product , index) => (
                  <li key={product.id + index}>
                    <div><Text className="text-bold">מזהה מוצר: </Text>{product.id}</div>
                    <div><Text className="text-bold">שם המוצר: </Text>{product.productName}</div>
                    <div><Text className="text-bold">קטגוריה: </Text>{product.category == null ? 'לא מוגדר' : product.category}</div>
                    <div><Text className="text-bold">תת קטגוריה: </Text>{product.subcategory == null ? 'לא מוגדר' : product.subcategory}</div>
                    <div><Text className="text-bold">כמות: </Text>{product.selectedQuantity}</div>
                    <Button className="custom-button"
                      onClick={async () => {
                        handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity + 1, orders, searchOrders);
                      }}>הגדלת הכמות
                    </Button>
                    <Button className="custom-button" onClick={async() => {
                      if (product.selectedQuantity > 1) {
                        handleEditProduct(order.id, product.id, 'selectedQuantity', product.selectedQuantity - 1, orders, searchOrders);
                      } else{
                        alert("אם ברצונך למחוק את המוצר לחץ על מחיקת מוצר");
                      }
                    }}>הורדת הכמות
                    </Button>
                    <Button className="custom-button-delete" onClick={() => 
                      openConfirmModal(() => {
                        let a = product.selectedQuantity;
                        handleDeleteProduct(order.id, product.id, a, orders, searchOrders, handleCloseModal, setSelectedProductQuantity)
                      }, "מחיקת מוצר", "האם אתה בטוח שברצונך למחוק מוצר זה?")}>מחיקת מוצר
                    </Button>
                  </li>
                ))}
              </ul>
              <strong>הוספת מוצרים להזמנה זו:</strong>
              <Form.Group>
                <Text className="text-bold">בחר קטגוריה: </Text>
                <Form.Control className="select-new-product" as="select" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">כל הקטגוריות</option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Text className="text-bold">בחר תת קטגוריה: </Text>
                <Form.Control className="select-new-product" as="select" value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
                    <option value="">כל תתי הקטגוריות</option>
                    {subCategories.map((subCat) => {
                      return (
                        <option key={subCat} value={subCat.name}>
                          {subCat}
                        </option>
                      );
                    })}
                </Form.Control>
              </Form.Group>
              <Form.Group >
                <Text className="text-bold">בחר מוצר: </Text>
                <Form.Control className="select-new-product" as="select" value={newProduct.id} onChange={handleProductChange}>
                    <option value="">שם המוצר</option>
                    {products.map((product, index )=> (
                        <option key={index} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </Form.Control>
                {selectedProductQuantity !== null && (
                <p style={{color:'gray'}}>הכמות במלאי: {selectedProductQuantity} </p>
                )}
              </Form.Group>
              <Form.Group>
                <Text className="text-bold">בחר כמות: </Text>
                <Form.Control
                  className="select-new-product"
                  type="number"
                  placeholder="כמות"
                  value={newProduct.selectedQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setNewProduct({
                      ...newProduct,
                      selectedQuantity: Math.min(Math.max(1, value), Math.max(1, selectedProductQuantity)),
                    });
                  }}
                  min="1"
                  max={selectedProductQuantity || 1}
                />
              </Form.Group>
              <div>
                <Button className="custom-button"
                  onClick={async() => {
                    handleAddProduct(order.id, products, newProduct, searchOrders, setNewProduct, setSelectedCategory, setSelectedSubCategory, setSelectedProductQuantity)}}
                    disabled={newProduct.selectedQuantity > selectedProductQuantity}>הוספת המוצר
                </Button>
                <Button className="custom-button"
                    onClick={() => openConfirmModal(() => moveToOld(order.id, searchOrders, handleCloseModal), "העברה לתקיה של הזמנות ישנות", "האם אתה בטוח שברצונך להעביר הזמנה זו לתיקיית הזמנות ישנות? (לא תוכל להחזיר)")}>העברה לתיקיית הזמנות ישנות
                </Button>
                {new Date(order.endDate) < new Date()? (
                  <Button className="custom-button"
                    id={"notify-"+order.id}
                    onClick={handleNotifyCreator(order, setShowEmailSentModal)}
                    >שלח תזכורת
                  </Button>
                  ):(null)}
                <Button className="custom-button-delete"
                    onClick={() => openConfirmModal(() => handleDeleteOrder(order.id, searchOrders, handleCloseModal), "מחיקת הזמנה", "האם אתה בטוח שברצונך למחוק הזמנה זו? (לא תוכל לשחזר)")}>מחיקת הזמנה
                </Button>
              </div>
            </div>
          )))}
        </div>
        <ConfirmModal
          show={showConfirmModal}
          handleClose={handleCloseModal}
          handleConfirm={confirmAction}
          title={modalTitle}
          body={modalBody}
        />
        <Modal className="coral123" show={showEmailSentModal} onHide={() => setShowEmailSentModal(false)}>
          <Modal.Body className="coral321">התזכורת נשלחה בהצלחה!</Modal.Body>
          <Modal.Footer>
            <Button className="custom-button"  variant="primary" onClick={() => setShowEmailSentModal(false)}>
              אישור
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageOrders;