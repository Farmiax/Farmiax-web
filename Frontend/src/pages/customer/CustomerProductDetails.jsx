import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';
import '../../styles/customer.css';

const CustomerProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading product details...
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!product) {
    return (
      <CustomerDashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Product not found.
        </div>
      </CustomerDashboardLayout>
    );
  }

  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <CustomerDashboardLayout>
      <div className="product-details-container" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumbs */}
        <div className="breadcrumbs-bar" style={{ marginBottom: '32px' }}>
          <Link to="/customer">Home</Link>
          <span>&gt;</span>
          <Link to="/customer/shop">Shop</Link>
          <span>&gt;</span>
          <Link to={`/customer/shop?category=${product.Category}`}>{product.Category || 'Category'}</Link>
          <span>&gt;</span>
          <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Top Section: Images & Info */}
        <div className="product-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '60px' }}>
          
          {/* Left: Images */}
          <div className="product-image-gallery" style={{ display: 'flex', gap: '20px' }}>
            <div className="thumbnail-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Mocking thumbnails, ideally we'd map product.images if it existed */}
              {[1, 2, 3, 4].map(num => (
                <div key={num} style={{ width: '70px', height: '70px', borderRadius: '8px', border: num === 1 ? '2px solid var(--primary-green)' : '1px solid var(--border-light)', overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/200'} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div className="main-image-display" style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '16px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px' }}>
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#A3E635', color: '#062414', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
                New Arrival
              </span>
              <img src={product.image ? `http://localhost:5000/${product.image}` : 'https://via.placeholder.com/500'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info-panel">
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[1,2,3,4,5].map(s => <FiStar key={s} className="fill-current" />)}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>4.8 (128 Reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--dark-green)' }}>₹{product.price}</span>
              <span style={{ fontSize: '16px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{Math.round(product.price * 1.2)}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)' }}>20% OFF</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px' }}>Select Weight</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer' }}>100 gm</button>
                <button style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--dark-green)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{product.quantity} {product.unit}</button>
                <button style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer' }}>1 kg</button>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px' }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', width: '120px', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => handleQuantityChange('dec')} style={{ flex: 1, padding: '10px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><FiMinus /></button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                <button onClick={() => handleQuantityChange('inc')} style={{ flex: 1, padding: '10px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><FiPlus /></button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <button onClick={() => addToCart(product._id || product.id, quantity)} style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', background: 'var(--dark-green)', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', background: '#A3E635', color: '#062414', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                Buy Now
              </button>
            </div>
            
            <button style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: 'var(--text-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '32px' }}>
              <FiHeart size={18} /> Add to Wishlist
            </button>

            {/* Features Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <FiCheckCircle style={{ color: 'var(--primary-green)', fontSize: '24px', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>100% Natural</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiStar style={{ color: 'var(--primary-green)', fontSize: '24px', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>Direct Farmer</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiShield style={{ color: 'var(--primary-green)', fontSize: '24px', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>Premium Quality</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FiTruck style={{ color: 'var(--primary-green)', fontSize: '24px', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{ borderBottom: '1px solid var(--border-light)', marginBottom: '32px', display: 'flex', gap: '32px' }}>
          {['Description', 'Product Details', 'How it\'s Made', 'Reviews (128)', 'Farmer Info'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ padding: '16px 0', border: 'none', background: 'transparent', fontSize: '15px', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--dark-green)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--dark-green)' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: '60px' }}>
          {activeTab === 'Description' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
              <div>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '24px' }}>
                  {product.description || `Farmiax ${product.name} is made from the finest quality roots, carefully selected and ground to perfection. It adds rich color, aroma and natural goodness to your food. Sourced directly from dedicated farmers who use organic cultivation methods to ensure the highest quality.`}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '15px' }}>Key Features</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="var(--primary-green)"/> No artificial colors or preservatives</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="var(--primary-green)"/> High nutrient content</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="var(--primary-green)"/> Ethically sourced from small farms</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheckCircle color="var(--primary-green)"/> Traditional processing</li>
                    </ul>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '15px' }}>Nutritional Info (per 100g)</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Energy</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>354 kcal</span></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Protein</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>7.8g</span></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Carbohydrates</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>64.9g</span></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fat</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>9.9g</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Farmer Info Card */}
              <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: '#86EFAC', color: '#062414', fontSize: '11px', fontWeight: 700, borderRadius: '999px', marginBottom: '20px' }}>FARMER INFO</span>
                <img src="https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=150&q=80" alt="Farmer" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
                <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>Ramesh Kumar</h3>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-muted)' }}>Karnataka, India</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#15803D', fontWeight: 700, fontSize: '14px', marginBottom: '20px' }}>
                  <FiStar className="fill-current"/> 4.8 (56)
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                  "We treat our soil like our mother. Every gram of this turmeric is grown with care and heritage."
                </p>
                <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--dark-green)', color: 'var(--dark-green)', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>
                  View Farm Profile
                </button>
              </div>
            </div>
          )}
          {activeTab !== 'Description' && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Content for {activeTab} will go here.
            </div>
          )}
        </div>

      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerProductDetails;
