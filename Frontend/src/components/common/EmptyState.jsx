import { FiPackage, FiShoppingCart, FiHeart, FiInbox } from 'react-icons/fi';

const icons = {
  product: FiPackage,
  cart: FiShoppingCart,
  wishlist: FiHeart,
  order: FiInbox,
  default: FiInbox,
};

const EmptyState = ({ type = 'default', title, message, action, onAction }) => {
  const Icon = icons[type] || icons.default;

  const defaults = {
    product: { title: 'No Products Found', message: 'No products are available yet. Check back later!' },
    cart: { title: 'Your Cart is Empty', message: 'Add some products to your cart to get started.' },
    wishlist: { title: 'Your Wishlist is Empty', message: 'Save products you love for later.' },
    order: { title: 'No Orders Found', message: 'You haven\'t placed any orders yet.' },
    default: { title: 'Nothing Here', message: 'No data available.' },
  };

  const d = defaults[type] || defaults.default;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Icon size={36} color="var(--primary)" />
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--gray-800)', marginBottom: 8 }}>
        {title || d.title}
      </h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '15px', maxWidth: 360, marginBottom: action ? 20 : 0 }}>
        {message || d.message}
      </p>
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction}>{action}</button>
      )}
    </div>
  );
};

export default EmptyState;
